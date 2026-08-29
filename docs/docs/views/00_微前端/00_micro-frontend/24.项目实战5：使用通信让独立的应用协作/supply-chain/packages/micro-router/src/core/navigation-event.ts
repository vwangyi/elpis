export const MICRO_ROUTER_NAVIGATION_EVENT = 'micro-router:navigation'
export const MICRO_ROUTER_ACTIVITY_EVENT = 'micro-router:activity'

export type MicroRouterNavigationAction = 'push' | 'replace' | 'sync'
export type MicroRouterNavigationPhase = 'before' | 'after'
export type MicroRouterNavigationSource = 'micro-app' | 'host'

export interface MicroRouterNavigationDetail {
  appName: string
  base: string
  from: string
  to: string
  action: MicroRouterNavigationAction
  phase: MicroRouterNavigationPhase
  source: MicroRouterNavigationSource
}

export interface MicroRouterActivityDetail {
  appName: string
  active: boolean
}

export function dispatchMicroRouterNavigation(
  targetWindow: Window,
  detail: MicroRouterNavigationDetail,
) {
  targetWindow.dispatchEvent(
    new CustomEvent<MicroRouterNavigationDetail>(MICRO_ROUTER_NAVIGATION_EVENT, {
      detail,
    }),
  )
}

export function dispatchMicroRouterActivity(
  targetWindow: Window,
  detail: MicroRouterActivityDetail,
) {
  targetWindow.dispatchEvent(
    new CustomEvent<MicroRouterActivityDetail>(MICRO_ROUTER_ACTIVITY_EVENT, {
      detail,
    }),
  )
}
