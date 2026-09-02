import {
  dispatchMicroRouterNavigation,
  MICRO_ROUTER_NAVIGATION_EVENT,
  type MicroRouterNavigationDetail,
} from './navigation-event'
import { getBrowserLocation, isLocationInBase, normalizeBase } from './path'
import { mergeScopedState, readScopedState } from './scoped-state'

function resolveBrowserLocation(targetWindow: Window, url?: string | URL | null): string {
  if (url == null) return getBrowserLocation(targetWindow)

  const resolvedUrl = new URL(url, targetWindow.location.href)
  return `${resolvedUrl.pathname}${resolvedUrl.search}${resolvedUrl.hash}`
}

function callEventListener(listener: EventListenerOrEventListenerObject, event: Event) {
  if (typeof listener === 'function') listener(event)
  else listener.handleEvent(event)
}

/**
 * React Router 支持注入 window。这里不修改全局对象，只让当前 Router
 * 看到自己的 history.state；真实 URL 和浏览器历史栈仍然共用。
 */
export function createScopedWindow(
  appName: string,
  base: string,
  targetWindow: Window = window,
): Window {
  const normalizedBase = normalizeBase(base)
  const targetHistory = targetWindow.history
  const popstateListeners = new Map<
    EventListenerOrEventListenerObject,
    { navigation: EventListener; popstate: EventListener }
  >()

  const scopedHistory = new Proxy(targetHistory, {
    get(history, property) {
      if (property === 'state') return readScopedState(history, appName)

      if (property === 'pushState' || property === 'replaceState') {
        return (state: unknown, unused: string, url?: string | URL | null) => {
          const from = getBrowserLocation(targetWindow)
          const to = resolveBrowserLocation(targetWindow, url)
          const action = property === 'pushState' ? 'push' : 'replace'
          const routeChanged = action === 'push' || from !== to

          if (routeChanged) {
            dispatchMicroRouterNavigation(targetWindow, {
              appName,
              base: normalizedBase,
              from,
              to,
              action,
              phase: 'before',
              source: 'micro-app',
            })
          }

          const nextState = mergeScopedState(history, appName, state)
          history[property](nextState, unused, url)

          if (routeChanged) {
            dispatchMicroRouterNavigation(targetWindow, {
              appName,
              base: normalizedBase,
              from,
              to,
              action,
              phase: 'after',
              source: 'micro-app',
            })
          }
        }
      }

      const value = Reflect.get(history, property, history) as unknown
      return typeof value === 'function' ? value.bind(history) : value
    },
    set(history, property, value) {
      return Reflect.set(history, property, value, history)
    },
  })

  // Proxy 的 target 使用空对象，避免覆盖 Window 自身不可配置属性的限制。
  return new Proxy({} as Window, {
    get(_emptyTarget, property) {
      if (property === 'history') return scopedHistory

      if (property === 'addEventListener') {
        return (
          type: string,
          listener: EventListenerOrEventListenerObject | null,
          options?: boolean | AddEventListenerOptions,
        ) => {
          if (type !== 'popstate' || !listener) {
            targetWindow.addEventListener(type, listener as EventListener, options)
            return
          }

          const popstate = (event: Event) => {
            if (
              (event as PopStateEvent & { __microRouterSourceApp?: string })
                .__microRouterSourceApp === appName
            ) {
              return
            }
            if (isLocationInBase(getBrowserLocation(targetWindow), normalizedBase)) {
              callEventListener(listener, event)
            }
          }
          const navigation = (event: Event) => {
            const detail = (event as CustomEvent<MicroRouterNavigationDetail>).detail
            if (
              detail.phase !== 'after' ||
              detail.source !== 'host' ||
              detail.appName !== appName
            ) {
              return
            }

            callEventListener(
              listener,
              new PopStateEvent('popstate', {
                state: readScopedState(targetHistory, appName),
              }),
            )
          }

          popstateListeners.set(listener, { navigation, popstate })
          targetWindow.addEventListener('popstate', popstate, options)
          targetWindow.addEventListener(MICRO_ROUTER_NAVIGATION_EVENT, navigation)
        }
      }

      if (property === 'removeEventListener') {
        return (
          type: string,
          listener: EventListenerOrEventListenerObject | null,
          options?: boolean | EventListenerOptions,
        ) => {
          if (type !== 'popstate' || !listener) {
            targetWindow.removeEventListener(type, listener as EventListener, options)
            return
          }

          const wrapped = popstateListeners.get(listener)
          if (!wrapped) return
          targetWindow.removeEventListener('popstate', wrapped.popstate, options)
          targetWindow.removeEventListener(MICRO_ROUTER_NAVIGATION_EVENT, wrapped.navigation)
          popstateListeners.delete(listener)
        }
      }

      const value = Reflect.get(targetWindow, property, targetWindow) as unknown
      return typeof value === 'function' ? value.bind(targetWindow) : value
    },
    set(_emptyTarget, property, value) {
      return Reflect.set(targetWindow, property, value, targetWindow)
    },
  })
}
