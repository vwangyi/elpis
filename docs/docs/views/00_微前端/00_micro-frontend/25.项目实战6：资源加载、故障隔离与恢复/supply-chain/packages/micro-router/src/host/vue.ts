import type { Router } from 'vue-router'

import {
  dispatchMicroRouterNavigation,
  isLocationInBase,
  MICRO_ROUTER_NAVIGATION_EVENT,
  normalizeBase,
  type MicroAppRouteDefinition,
  type MicroRouteStore,
  type MicroRouterNavigationDetail,
} from '../core'

interface HostHistoryState extends Record<string, unknown> {
  back?: string | null
  current?: string
  forward?: string | null
  position?: number
  replaced?: boolean
  scroll?: { left: number; top: number } | null
}

export interface InstallVueMicroRouterHostOptions {
  router: Router
  apps: MicroAppRouteDefinition[]
  routeStore: MicroRouteStore
  window?: Window
}

export interface VueMicroRouterHost {
  resolve(appName: string, fallback: string): string
  clearRoutes(appName?: string): void
  destroy(): void
}

function getState(history: History): HostHistoryState {
  return typeof history.state === 'object' && history.state !== null
    ? (history.state as HostHistoryState)
    : {}
}

function createSyntheticPopState(targetWindow: Window, appName: string): PopStateEvent {
  const event = new PopStateEvent('popstate', { state: targetWindow.history.state })
  Object.defineProperty(event, '__microRouterSourceApp', { value: appName })
  return event
}

/**
 * 子应用已经完成真实 push/replace 后，只修正主应用的 History 状态并触发一次
 * 合成 popstate，让主应用 Router 更新内部位置，不再新增第二条历史记录。
 */
export function installVueMicroRouterHost(
  options: InstallVueMicroRouterHostOptions,
): VueMicroRouterHost {
  const targetWindow = options.window ?? window
  const definitions = new Map(
    options.apps.map((app) => [app.appName, { ...app, base: normalizeBase(app.base) }]),
  )

  const handleMicroNavigation = (event: Event) => {
    const detail = (event as CustomEvent<MicroRouterNavigationDetail>).detail
    if (detail.source !== 'micro-app') return

    const definition = definitions.get(detail.appName)
    if (!definition || !isLocationInBase(detail.to, definition.base)) return

    const history = targetWindow.history
    const state = getState(history)

    if (detail.phase === 'before') {
      if (detail.action === 'push') {
        history.replaceState(
          {
            ...state,
            forward: detail.to,
            scroll: { left: targetWindow.scrollX, top: targetWindow.scrollY },
          },
          '',
          detail.from,
        )
      }
      return
    }

    const nextState: HostHistoryState =
      detail.action === 'push'
        ? {
            ...state,
            back: detail.from,
            current: detail.to,
            forward: null,
            position: (typeof state.position === 'number' ? state.position : 0) + 1,
            replaced: false,
            scroll: null,
          }
        : {
            ...state,
            current: detail.to,
            replaced: true,
          }

    history.replaceState(nextState, '', detail.to)
    options.routeStore.remember(detail.appName, detail.to)
    targetWindow.dispatchEvent(createSyntheticPopState(targetWindow, detail.appName))
  }

  const removeAfterEach = options.router.afterEach((to) => {
    const browserLocation = to.fullPath
    const definition = options.apps.find((app) => isLocationInBase(browserLocation, app.base))
    if (!definition) return

    options.routeStore.remember(definition.appName, browserLocation)
    dispatchMicroRouterNavigation(targetWindow, {
      appName: definition.appName,
      base: normalizeBase(definition.base),
      from: browserLocation,
      to: browserLocation,
      action: 'sync',
      phase: 'after',
      source: 'host',
    })
  })

  targetWindow.addEventListener(MICRO_ROUTER_NAVIGATION_EVENT, handleMicroNavigation)

  return {
    resolve(appName, fallback) {
      return options.routeStore.resolve(appName, fallback)
    },
    clearRoutes(appName) {
      options.routeStore.clear(appName)
    },
    destroy() {
      removeAfterEach()
      targetWindow.removeEventListener(MICRO_ROUTER_NAVIGATION_EVENT, handleMicroNavigation)
    },
  }
}
