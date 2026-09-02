import {
  applyTheme,
  getResolvedTheme,
  getStoredTheme,
  THEME_CHANGE_EVENT,
  type Theme,
} from '@supply-chain/design-tokens/theme'

import type { MicroBridge } from './contracts.ts'

interface ThemeChangeDetail {
  /** 用户选择的主题。 */
  theme: Theme
  /** 根据用户选择和操作系统主题计算出的实际主题。 */
  resolvedTheme: 'light' | 'dark'
}

/**
 * 将页面主题模块与通信桥双向连接：
 * 1. 通信桥状态变化时，把新主题应用到当前应用；
 * 2. 当前应用切换主题时，把新主题写回通信桥，通知其他应用。
 */
export function connectThemeToBridge(bridge: MicroBridge, persistStateChanges = false) {
  // bridge -> 当前应用：包括订阅时立即取得的当前主题和以后的主题变化。
  const unsubscribeState = bridge.subscribeState((state) => {
    const currentTheme = document.documentElement.dataset.theme

    // 当前页面已经是目标主题时直接结束，避免双向同步产生循环更新。
    if (currentTheme === state.theme && getResolvedTheme() === state.resolvedTheme) return
    applyTheme(state.theme, persistStateChanges)
  })

  // 当前应用 -> bridge：ThemeToggle 切换主题后会触发统一的浏览器事件。
  const handleThemeChange = (event: Event) => {
    const detail = (event as CustomEvent<ThemeChangeDetail>).detail
    bridge.setState({
      theme: detail?.theme ?? getStoredTheme(),
      resolvedTheme: detail?.resolvedTheme ?? getResolvedTheme(),
    })
  }

  window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange)

  // 一个函数同时清理两条方向的监听，供子应用 unmount 时调用。
  return () => {
    unsubscribeState()
    window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange)
  }
}
