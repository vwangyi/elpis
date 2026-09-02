import { dispatchMicroRouterActivity, isLocationInBase } from '@supply-chain/micro-router/core'
import { loadMicroApp, start, type MicroApp } from 'qiankun'
import type { Router } from 'vue-router'

import { platformBridge } from './platform-communication'
import {
  beginMicroAppAttempt,
  isCurrentMicroAppAttempt,
  markActiveMicroAppRuntimeFailure,
  markMicroAppFailed,
  markMicroAppInactive,
  markMicroAppMounted,
  markMicroAppTimeout,
  resetMicroAppRuntime,
  type MicroAppFailureKind,
} from './micro-app-runtime'

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
    entry:
      import.meta.env.VITE_FULFILLMENT_ENTRY ??
      (import.meta.env.PROD ? '//localhost:6174' : '//localhost:5174'),
    container: '#micro-app-fulfillment',
  },
  {
    appName: 'settlementApp',
    base: '/settlement',
    entry:
      import.meta.env.VITE_SETTLEMENT_ENTRY ??
      (import.meta.env.PROD ? '//localhost:6175' : '//localhost:5175'),
    container: '#micro-app-settlement',
  },
]

const cache = new Map<string, CachedMicroApp>()
const maxCacheSize = 2
const loadTimeoutMs = 3500
let activeAppName: string | null = null
let navigationVersion = 0
let removeAfterEach: (() => void) | null = null
let runtimeErrorListenersInstalled = false

function appendAttemptQuery(resourceUrl: string, attempt: number, baseUrl = window.location.href) {
  const url = new URL(resourceUrl, baseUrl)
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return resourceUrl
  url.searchParams.set('__micro_attempt', String(attempt))
  return url.href
}

function refreshTemplateResourceUrls(template: string, attempt: number, entryUrl: string) {
  return template.replace(
    /(<(?:script|link)\b[^>]*?\b(?:src|href)=["'])([^"']+)(["'])/gi,
    (_match, prefix: string, resourceUrl: string, suffix: string) =>
      `${prefix}${appendAttemptQuery(resourceUrl, attempt, entryUrl)}${suffix}`,
  )
}

function classifyLoadFailure(error: unknown): MicroAppFailureKind {
  const detail = error instanceof Error ? `${error.name} ${error.message}` : String(error)
  return /fetch|network|404|script|chunk|stylesheet|imported module/i.test(detail)
    ? 'resource'
    : 'lifecycle'
}

function setContainerVisible(definition: KeepAliveAppDefinition, visible: boolean) {
  const container = document.querySelector<HTMLElement>(definition.container)
  if (container) container.hidden = !visible
}

function setAppActivity(appName: string, active: boolean) {
  dispatchMicroRouterActivity(window, { appName, active })
}

function clearContainer(definition: KeepAliveAppDefinition) {
  document.querySelector<HTMLElement>(definition.container)?.replaceChildren()
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

async function activateMicroApp(definition: KeepAliveAppDefinition | undefined, retry = false) {
  const currentVersion = ++navigationVersion
  const nextAppName = definition?.appName ?? null

  for (const app of appDefinitions) {
    const active = app.appName === nextAppName
    setContainerVisible(app, active)
    if (!active) {
      setAppActivity(app.appName, false)
      markMicroAppInactive(app.appName)
    }
  }

  activeAppName = nextAppName
  if (!definition) return

  const existing = cache.get(definition.appName)
  if (existing?.instance.getStatus() === 'MOUNTED') {
    existing.lastActiveAt = Date.now()
    const attempt = beginMicroAppAttempt(definition.appName)
    markMicroAppMounted(definition.appName, attempt)
    setContainerVisible(definition, true)
    setAppActivity(definition.appName, true)
    return
  }

  const attempt = beginMicroAppAttempt(definition.appName, retry)
  const timeoutId = window.setTimeout(
    () => markMicroAppTimeout(definition.appName, attempt, loadTimeoutMs),
    loadTimeoutMs,
  )

  let cached = cache.get(definition.appName)
  try {
    if (!cached) {
      const entry = appendAttemptQuery(definition.entry, attempt)
      // qiankun 2.x 会按“应用名 + 容器路径”缓存加载 Promise。
      // 失败 Promise 也会留在内部缓存，重试必须使用新的运行实例名。
      const runtimeName = `${definition.appName}__attempt_${attempt}`
      const instance = loadMicroApp(
        {
          name: runtimeName,
          entry,
          container: definition.container,
          props: {
            platformBridge,
          },
        },
        {
          singular: false,
          sandbox: true,
          getTemplate: (template) => refreshTemplateResourceUrls(template, attempt, entry),
        },
      )
      cached = { definition, instance, lastActiveAt: Date.now() }
      cache.set(definition.appName, cached)
    }
    await cached.instance.mountPromise
  } catch (error) {
    if (cached && cache.get(definition.appName)?.instance === cached.instance) {
      cache.delete(definition.appName)
    }
    clearContainer(definition)
    markMicroAppFailed(definition.appName, attempt, classifyLoadFailure(error), error)
    return
  } finally {
    window.clearTimeout(timeoutId)
  }

  if (!cached || !isCurrentMicroAppAttempt(definition.appName, attempt)) return
  cached.lastActiveAt = Date.now()
  if (currentVersion !== navigationVersion || activeAppName !== definition.appName) {
    markMicroAppInactive(definition.appName, attempt)
    return
  }

  setContainerVisible(definition, true)
  setAppActivity(definition.appName, true)
  markMicroAppMounted(definition.appName, attempt)
  await evictInactiveApps()
}

function installRuntimeErrorListeners() {
  if (runtimeErrorListenersInstalled) return
  runtimeErrorListenersInstalled = true

  window.addEventListener(
    'error',
    (event) => {
      if (!activeAppName) return
      const target = event.target
      if (!(target instanceof HTMLScriptElement || target instanceof HTMLLinkElement)) return
      const resourceUrl = target instanceof HTMLScriptElement ? target.src : target.href
      markActiveMicroAppRuntimeFailure(
        activeAppName,
        'resource',
        new Error(`子应用资源加载失败：${resourceUrl || '未知资源'}`),
      )
    },
    true,
  )

  window.addEventListener('unhandledrejection', (event) => {
    if (!activeAppName) return
    const detail = event.reason instanceof Error ? event.reason.message : String(event.reason)
    if (!/chunk|dynamically imported module|loading css|loading script/i.test(detail)) return
    markActiveMicroAppRuntimeFailure(activeAppName, 'runtime', event.reason)
  })
}

export function startMicroApps(router: Router) {
  if (removeAfterEach) return

  start({ prefetch: false, singular: false })
  installRuntimeErrorListeners()

  const activateForPath = (path: string) => {
    const definition = appDefinitions.find((app) => isLocationInBase(path, app.base))
    void activateMicroApp(definition)
  }

  removeAfterEach = router.afterEach((to) => activateForPath(to.fullPath))
  activateForPath(router.currentRoute.value.fullPath)
}

export async function retryMicroApp(appName: string) {
  const definition = appDefinitions.find((app) => app.appName === appName)
  if (!definition || activeAppName !== appName) return

  navigationVersion += 1
  const cached = cache.get(appName)
  cache.delete(appName)
  if (cached) await unmountCachedApp(cached)
  clearContainer(definition)
  await activateMicroApp(definition, true)
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
  resetMicroAppRuntime()
}
