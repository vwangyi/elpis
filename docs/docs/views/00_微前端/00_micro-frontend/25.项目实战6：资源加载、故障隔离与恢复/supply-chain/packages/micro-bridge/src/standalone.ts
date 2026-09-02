import { getStoredTheme, resolveTheme } from '@supply-chain/design-tokens/theme'

import { createMicroBridge } from './bridge.ts'

/**
 * 子应用独立启动时没有主应用通过 props 注入通信桥，因此创建一个本地备用实例。
 * 备用实例仍然支持主题切换，但只在当前子应用内部生效。
 */
export function createStandaloneBridge() {
  const theme = getStoredTheme()
  return createMicroBridge({
    initialState: {
      theme,
      resolvedTheme: resolveTheme(theme),
      badges: { fulfillment: 0, settlement: 0 },
    },
  })
}
