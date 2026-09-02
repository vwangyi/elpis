interface QiankunWindow extends Window {
  __POWERED_BY_QIANKUN__?: boolean
  proxy?: Window & { __POWERED_BY_QIANKUN__?: boolean }
}

/**
 * webpack qiankun 子应用通常直接看到代理 window；vite-plugin-qiankun
 * 则把代理挂在真实 window.proxy。环境差异统一在运行时内部消化。
 */
export function getMicroAppWindow(targetWindow: Window = window): Window {
  const qiankunWindow = targetWindow as QiankunWindow
  return qiankunWindow.proxy ?? targetWindow
}

export function isMicroAppRuntime(targetWindow: Window = window): boolean {
  const qiankunWindow = targetWindow as QiankunWindow
  return Boolean(
    qiankunWindow.__POWERED_BY_QIANKUN__ || qiankunWindow.proxy?.__POWERED_BY_QIANKUN__,
  )
}
