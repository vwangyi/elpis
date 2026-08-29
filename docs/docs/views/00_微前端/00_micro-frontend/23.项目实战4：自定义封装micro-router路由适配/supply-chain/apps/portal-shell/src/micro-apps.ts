import { dispatchMicroRouterActivity, isLocationInBase } from '@supply-chain/micro-router/core'
import { loadMicroApp, start, type MicroApp } from 'qiankun'
import type { Router } from 'vue-router'

interface KeepAliveAppDefinition {
  appName: string
  base: string
  entry: string
  container: string
}

interface CachedMicroApp {
  definition: KeepAliveAppDefinition
  instance: MicroApp
  lastActiveAt: number
}

const appDefinitions: KeepAliveAppDefinition[] = [
  {
    appName: 'fulfillmentApp',
    base: '/fulfillment',
    entry: '//localhost:5174',
    container: '#micro-app-fulfillment',
  },
  {
    appName: 'settlementApp',
    base: '/settlement',
    entry: '//localhost:5175',
    container: '#micro-app-settlement',
  },
]

const cache = new Map<string, CachedMicroApp>()
const maxCacheSize = 2
let activeAppName: string | null = null
let navigationVersion = 0
let removeAfterEach: (() => void) | null = null

function setContainerVisible(definition: KeepAliveAppDefinition, visible: boolean) {
  const container = document.querySelector<HTMLElement>(definition.container)
  if (container) container.hidden = !visible
}

function setAppActivity(appName: string, active: boolean) {
  dispatchMicroRouterActivity(window, { appName, active })
}

async function unmountCachedApp(cached: CachedMicroApp) {
  try {
    await cached.instance.mountPromise
  } catch {
    return
  }

  if (cached.instance.getStatus() === 'MOUNTED') await cached.instance.unmount()
}

async function evictInactiveApps() {
  if (cache.size <= maxCacheSize) return

  const candidates = [...cache.values()]
    .filter((item) => item.definition.appName !== activeAppName)
    .sort((left, right) => left.lastActiveAt - right.lastActiveAt)

  while (cache.size > maxCacheSize && candidates.length > 0) {
    const cached = candidates.shift()
    if (!cached) break

    setAppActivity(cached.definition.appName, false)
    await unmountCachedApp(cached)
    cache.delete(cached.definition.appName)
    setContainerVisible(cached.definition, false)
  }
}

async function activateMicroApp(definition: KeepAliveAppDefinition | undefined) {
  const currentVersion = ++navigationVersion
  const nextAppName = definition?.appName ?? null

  for (const app of appDefinitions) {
    const active = app.appName === nextAppName
    setContainerVisible(app, active)
    if (!active) setAppActivity(app.appName, false)
  }

  activeAppName = nextAppName
  if (!definition) return

  let cached = cache.get(definition.appName)
  if (!cached) {
    const instance = loadMicroApp(
      {
        name: definition.appName,
        entry: definition.entry,
        container: definition.container,
      },
      {
        singular: false,
        sandbox: true,
      },
    )
    cached = { definition, instance, lastActiveAt: Date.now() }
    cache.set(definition.appName, cached)
    await instance.mountPromise
  }

  cached.lastActiveAt = Date.now()
  if (currentVersion !== navigationVersion || activeAppName !== definition.appName) return

  setContainerVisible(definition, true)
  setAppActivity(definition.appName, true)
  await evictInactiveApps()
}

export function startMicroApps(router: Router) {
  if (removeAfterEach) return

  start({ prefetch: false, singular: false })

  const activateForPath = (path: string) => {
    const definition = appDefinitions.find((app) => isLocationInBase(path, app.base))
    void activateMicroApp(definition)
  }

  removeAfterEach = router.afterEach((to) => activateForPath(to.fullPath))
  activateForPath(router.currentRoute.value.fullPath)
}

export async function clearMicroAppCache() {
  navigationVersion += 1
  activeAppName = null

  const cachedApps = [...cache.values()]
  cache.clear()
  for (const cached of cachedApps) {
    setAppActivity(cached.definition.appName, false)
    await unmountCachedApp(cached)
    setContainerVisible(cached.definition, false)
  }
}
