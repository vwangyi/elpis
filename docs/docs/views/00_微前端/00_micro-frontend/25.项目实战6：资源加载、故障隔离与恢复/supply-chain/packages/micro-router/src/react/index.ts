import {
  createBrowserRouter,
  createHashRouter,
  type DOMRouterOpts,
  type RouteObject,
} from 'react-router-dom'

import { createScopedWindow, getMicroAppWindow, isMicroAppRuntime, normalizeBase } from '../core'

export interface MicroReactRouterOptions {
  appName: string
  base: string
  routes: RouteObject[]
  embedded?: boolean
  window?: Window
  standalone?: 'browser' | 'hash'
  routerOptions?: Omit<DOMRouterOpts, 'basename' | 'window'>
}

export function createMicroReactRouter(
  options: MicroReactRouterOptions,
): ReturnType<typeof createBrowserRouter> {
  const runtimeWindow = options.window ?? getMicroAppWindow()
  const embedded = options.embedded ?? isMicroAppRuntime()

  if (!embedded) {
    return options.standalone === 'hash'
      ? createHashRouter(options.routes, options.routerOptions)
      : createBrowserRouter(options.routes, options.routerOptions)
  }

  return createBrowserRouter(options.routes, {
    ...options.routerOptions,
    basename: normalizeBase(options.base),
    window: createScopedWindow(options.appName, options.base, runtimeWindow),
  })
}
