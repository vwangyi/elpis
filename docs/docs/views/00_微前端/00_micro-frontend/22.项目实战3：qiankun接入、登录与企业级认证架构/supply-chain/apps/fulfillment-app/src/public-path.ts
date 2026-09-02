declare let __webpack_public_path__: string

interface QiankunWindow extends Window {
  __POWERED_BY_QIANKUN__?: boolean
  __INJECTED_PUBLIC_PATH_BY_QIANKUN__?: string
}

declare global {
  interface Window {
    __POWERED_BY_QIANKUN__?: boolean
    __INJECTED_PUBLIC_PATH_BY_QIANKUN__?: string
  }
}

const qiankunWindow = window as QiankunWindow

if (qiankunWindow.__POWERED_BY_QIANKUN__) {
  __webpack_public_path__ = qiankunWindow.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ ?? '/'
}

export {}
