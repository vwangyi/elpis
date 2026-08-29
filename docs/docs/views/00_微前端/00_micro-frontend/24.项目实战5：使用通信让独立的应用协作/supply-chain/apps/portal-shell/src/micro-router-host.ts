import {
  createMicroRouteStore,
  type MicroAppRouteDefinition,
} from '@supply-chain/micro-router/core'
import {
  installVueMicroRouterHost,
  type VueMicroRouterHost,
} from '@supply-chain/micro-router/host/vue'
import type { Router } from 'vue-router'

export const microAppRoutes: MicroAppRouteDefinition[] = [
  { appName: 'fulfillmentApp', base: '/fulfillment' },
  { appName: 'settlementApp', base: '/settlement' },
]

const routeStore = createMicroRouteStore({
  apps: microAppRoutes,
  storage: window.sessionStorage,
})

let host: VueMicroRouterHost | null = null

export function startMicroRouterHost(router: Router) {
  host ??= installVueMicroRouterHost({ router, apps: microAppRoutes, routeStore })
  const currentApp = microAppRoutes.find((app) =>
    router.currentRoute.value.path.startsWith(app.base),
  )
  if (currentApp) routeStore.remember(currentApp.appName, router.currentRoute.value.fullPath)
  return host
}

export function resolveMicroAppRoute(appName: string, fallback: string) {
  return host?.resolve(appName, fallback) ?? routeStore.resolve(appName, fallback)
}

export function clearMicroAppRoutes() {
  host?.clearRoutes()
  if (!host) routeStore.clear()
}
