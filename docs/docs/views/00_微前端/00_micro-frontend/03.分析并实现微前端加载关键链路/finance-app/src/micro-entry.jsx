import '@vitejs/plugin-react/preamble'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { createFinanceRouter } from './router.jsx'
import './style.css'

let root = null
let router = null

export async function mount({ container, hostApi, initialPath = '/finance/bills' } = {}) {
  router = createFinanceRouter({
    type: 'memory',
    hostApi,
    initialPath,
  })

  console.log(window.sharedRuntime);

  root = createRoot(container)
  root.render(<RouterProvider router={router} />)
  hostApi?.onMounted?.('财务子应用已经执行了 mount()，业务区开始显示。')
}

export async function navigate(path) {
  if (!router || router.state.location.pathname === path) {
    return
  }

  await router.navigate(path)
}

export async function unmount() {
  root?.unmount()
  root = null
  router = null
}