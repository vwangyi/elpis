import { createWebHistory, type RouterHistory } from 'vue-router'

import { getMicroAppWindow, isMicroAppRuntime } from '../core'
import { createNativeVueHistory } from './native-history'

export interface MicroVueHistoryOptions {
  appName: string
  base: string
  embedded?: boolean
  window?: Window
  standalone?: () => RouterHistory
}

export function createMicroVueHistory(options: MicroVueHistoryOptions): RouterHistory {
  const embedded = options.embedded ?? isMicroAppRuntime()
  if (!embedded) return options.standalone?.() ?? createWebHistory()

  return createNativeVueHistory(
    options.appName,
    options.base,
    options.window ?? getMicroAppWindow(),
  )
}

export { createNativeVueHistory } from './native-history'
