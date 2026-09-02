import { isLocationInBase, normalizeBase } from './path.ts'

export interface MicroAppRouteDefinition {
  appName: string
  base: string
}

export interface MicroRouteStore {
  remember(appName: string, browserLocation: string): void
  resolve(appName: string, fallback: string): string
  clear(appName?: string): void
  entries(): Record<string, string>
}

export interface CreateMicroRouteStoreOptions {
  apps: MicroAppRouteDefinition[]
  storage?: Storage | null
  storageKey?: string
}

const DEFAULT_STORAGE_KEY = '__MICRO_ROUTER_LAST_ROUTES__'

function readStorage(storage: Storage | null, storageKey: string): Record<string, string> {
  if (!storage) return {}

  try {
    const value = JSON.parse(storage.getItem(storageKey) ?? '{}') as unknown
    return typeof value === 'object' && value !== null && !Array.isArray(value)
      ? (value as Record<string, string>)
      : {}
  } catch {
    return {}
  }
}

export function createMicroRouteStore(options: CreateMicroRouteStoreOptions): MicroRouteStore {
  const definitions = new Map(
    options.apps.map((app) => [app.appName, { ...app, base: normalizeBase(app.base) }]),
  )
  const storage = options.storage ?? null
  const storageKey = options.storageKey ?? DEFAULT_STORAGE_KEY
  let routes = readStorage(storage, storageKey)

  const persist = () => {
    try {
      storage?.setItem(storageKey, JSON.stringify(routes))
    } catch {
      // sessionStorage may be unavailable in privacy mode. Memory retention still works.
    }
  }

  return {
    remember(appName, browserLocation) {
      const definition = definitions.get(appName)
      if (!definition || !isLocationInBase(browserLocation, definition.base)) return

      routes = { ...routes, [appName]: browserLocation }
      persist()
    },
    resolve(appName, fallback) {
      const definition = definitions.get(appName)
      const remembered = routes[appName]
      return definition && remembered && isLocationInBase(remembered, definition.base)
        ? remembered
        : fallback
    },
    clear(appName) {
      if (appName) {
        const { [appName]: _removed, ...remainingRoutes } = routes
        routes = remainingRoutes
      } else {
        routes = {}
      }
      persist()
    },
    entries() {
      return { ...routes }
    },
  }
}
