import type { HistoryState, RouterHistory } from 'vue-router'

import {
  dispatchMicroRouterNavigation,
  getBrowserLocation,
  isLocationInBase,
  MICRO_ROUTER_ACTIVITY_EVENT,
  MICRO_ROUTER_NAVIGATION_EVENT,
  normalizeBase,
  readScopedState,
  toBrowserLocation,
  toInternalLocation,
  writeScopedState,
} from '../core'
import type { MicroRouterActivityDetail, MicroRouterNavigationDetail } from '../core'

type HistoryListener = Parameters<RouterHistory['listen']>[0]
type NavigationInformation = Parameters<HistoryListener>[2]
type HistoryLocation = string

interface VueHistoryState extends HistoryState {
  back: HistoryLocation | null
  current: HistoryLocation
  forward: HistoryLocation | null
  position: number
  replaced: boolean
  scroll: { left: number; top: number } | null
}

function createInitialState(current: HistoryLocation, position: number): VueHistoryState {
  return {
    back: null,
    current,
    forward: null,
    position,
    replaced: true,
    scroll: null,
  }
}

function getDirection(delta: number) {
  if (delta > 0) return 'forward'
  if (delta < 0) return 'back'
  return 'unknown'
}

/**
 * Vue Router 的 native history 适配器。
 * location 使用子应用内部路径，URL 使用带应用前缀的真实浏览器路径。
 */
export function createNativeVueHistory(
  appName: string,
  base: string,
  targetWindow: Window = window,
): RouterHistory {
  const normalizedBase = normalizeBase(base)
  const browserHistory = targetWindow.history
  const listeners = new Set<HistoryListener>()
  let skipNextPop = false
  let active = isLocationInBase(getBrowserLocation(targetWindow), normalizedBase)

  const readLocation = () =>
    toInternalLocation(getBrowserLocation(targetWindow), normalizedBase) as HistoryLocation

  let currentLocation = readLocation()
  const storedInitialState = readScopedState<VueHistoryState>(browserHistory, appName)
  let currentState: VueHistoryState

  if (!storedInitialState || storedInitialState.current !== currentLocation) {
    currentState = createInitialState(currentLocation, Math.max(0, browserHistory.length - 1))
    writeScopedState(browserHistory, appName, currentState, null, true)
  } else {
    currentState = storedInitialState
  }

  const syncFromBrowser = () => {
    if (!isLocationInBase(getBrowserLocation(targetWindow), normalizedBase)) return

    const from = currentLocation
    const nextLocation = readLocation()
    if (nextLocation === from) return

    const storedState = readScopedState<VueHistoryState>(browserHistory, appName)
    const nextState = storedState ?? createInitialState(nextLocation, currentState.position)
    const delta = nextState.position - currentState.position

    currentLocation = nextLocation
    currentState = nextState

    if (skipNextPop) {
      skipNextPop = false
      return
    }

    const information = {
      delta,
      type: 'pop',
      direction: getDirection(delta),
    } as NavigationInformation
    listeners.forEach((listener) => listener(nextLocation, from, information))
  }

  const handlePopState = (event: PopStateEvent) => {
    if (
      (event as PopStateEvent & { __microRouterSourceApp?: string }).__microRouterSourceApp ===
      appName
    ) {
      return
    }
    if (!active) return
    syncFromBrowser()
  }

  const handleNavigation = (event: Event) => {
    const detail = (event as CustomEvent<MicroRouterNavigationDetail>).detail
    if (detail.phase === 'after' && detail.source === 'host' && detail.appName === appName) {
      syncFromBrowser()
    }
  }

  const handleActivity = (event: Event) => {
    const detail = (event as CustomEvent<MicroRouterActivityDetail>).detail
    if (detail.appName !== appName) return

    active = detail.active
    if (active) syncFromBrowser()
  }

  targetWindow.addEventListener('popstate', handlePopState)
  targetWindow.addEventListener(MICRO_ROUTER_NAVIGATION_EVENT, handleNavigation)
  targetWindow.addEventListener(MICRO_ROUTER_ACTIVITY_EVENT, handleActivity)

  return {
    base: normalizedBase,
    get location() {
      return currentLocation
    },
    get state() {
      return currentState
    },
    push(to, data = {}) {
      const from = currentLocation
      const previousState: VueHistoryState = {
        ...currentState,
        forward: to,
        scroll: { left: targetWindow.scrollX, top: targetWindow.scrollY },
      }
      writeScopedState(browserHistory, appName, previousState, null, true)

      const browserFrom = toBrowserLocation(from, normalizedBase)
      const browserTo = toBrowserLocation(to, normalizedBase)
      dispatchMicroRouterNavigation(targetWindow, {
        appName,
        base: normalizedBase,
        from: browserFrom,
        to: browserTo,
        action: 'push',
        phase: 'before',
        source: 'micro-app',
      })

      const nextState: VueHistoryState = {
        ...data,
        back: from,
        current: to,
        forward: null,
        position: currentState.position + 1,
        replaced: false,
        scroll: null,
      }
      writeScopedState(browserHistory, appName, nextState, browserTo, false)
      currentLocation = to
      currentState = nextState
      dispatchMicroRouterNavigation(targetWindow, {
        appName,
        base: normalizedBase,
        from: browserFrom,
        to: browserTo,
        action: 'push',
        phase: 'after',
        source: 'micro-app',
      })
    },
    replace(to, data = {}) {
      const from = currentLocation
      const browserFrom = toBrowserLocation(from, normalizedBase)
      const browserTo = toBrowserLocation(to, normalizedBase)
      dispatchMicroRouterNavigation(targetWindow, {
        appName,
        base: normalizedBase,
        from: browserFrom,
        to: browserTo,
        action: 'replace',
        phase: 'before',
        source: 'micro-app',
      })

      const nextState: VueHistoryState = {
        ...currentState,
        ...data,
        current: to,
        replaced: true,
        position: currentState.position,
      }
      writeScopedState(browserHistory, appName, nextState, browserTo, true)
      currentLocation = to
      currentState = nextState
      dispatchMicroRouterNavigation(targetWindow, {
        appName,
        base: normalizedBase,
        from: browserFrom,
        to: browserTo,
        action: 'replace',
        phase: 'after',
        source: 'micro-app',
      })
    },
    go(delta, triggerListeners = true) {
      if (!triggerListeners) skipNextPop = true
      browserHistory.go(delta)
    },
    listen(callback) {
      listeners.add(callback)
      return () => listeners.delete(callback)
    },
    createHref(location) {
      return toBrowserLocation(location, normalizedBase)
    },
    destroy() {
      listeners.clear()
      targetWindow.removeEventListener('popstate', handlePopState)
      targetWindow.removeEventListener(MICRO_ROUTER_NAVIGATION_EVENT, handleNavigation)
      targetWindow.removeEventListener(MICRO_ROUTER_ACTIVITY_EVENT, handleActivity)
    },
  }
}
