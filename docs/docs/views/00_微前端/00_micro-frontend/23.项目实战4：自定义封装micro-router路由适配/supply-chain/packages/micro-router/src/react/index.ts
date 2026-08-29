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
  //1. 判断独立运行还是嵌入运行
  if (!embedded) {
    return options.standalone === 'hash'
      ? createHashRouter(options.routes, options.routerOptions)
      : createBrowserRouter(options.routes, options.routerOptions)
  }

  return createBrowserRouter(options.routes, {
    ...options.routerOptions,
    // 2. 使用 basename 处理路径前缀
    basename: normalizeBase(options.base),
    // 3. 注入代理 window
    window: createScopedWindow(options.appName, options.base, runtimeWindow),
  })
}
