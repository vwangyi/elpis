import '@supply-chain/design-tokens/theme.css'
import './styles.css'

import { initializeTheme } from '@supply-chain/design-tokens/theme'
import type { MicroBridge } from '@supply-chain/micro-bridge'
import { StrictMode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { qiankunWindow, renderWithQiankun } from 'vite-plugin-qiankun/dist/helper'

import App from './App'
import { ensureAuthenticated } from './auth'
import { activatePlatformBridge, deactivatePlatformBridge } from './platform-bridge'
import { createSettlementRouter } from './router'

interface MicroAppProps {
  container?: Element
  platformBridge?: MicroBridge
}

let root: Root | null = null

function render(props: MicroAppProps = {}) {
  activatePlatformBridge(props.platformBridge)
  if (!ensureAuthenticated()) return

  const container = props.container
    ? props.container.querySelector<HTMLElement>('#root')
    : document.querySelector<HTMLElement>('#root')

  if (!container) throw new Error('结算中心挂载容器 #root 不存在')

  initializeTheme()
  root = createRoot(container)
  root.render(
    <StrictMode>
      <App router={createSettlementRouter()} />
    </StrictMode>,
  )
}

renderWithQiankun({
  bootstrap() {},
  mount(props) {
    render(props)
  },
  unmount() {
    root?.unmount()
    root = null
    deactivatePlatformBridge()
  },
  update() {},
})

if (!qiankunWindow.__POWERED_BY_QIANKUN__) render()
