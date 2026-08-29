import './public-path'
import '@supply-chain/design-tokens/theme.css'
import './styles.css'

import { initializeTheme } from '@supply-chain/design-tokens/theme'
import { createApp, type App as VueApp } from 'vue'

import App from './App.vue'
import { ensureAuthenticated } from './auth'
import { createFulfillmentRouter } from './router'

interface MicroAppProps {
  container?: Element
}

let app: VueApp<Element> | null = null

function render(props: MicroAppProps = {}) {
  if (!ensureAuthenticated()) return

  const container = props.container
    ? props.container.querySelector<Element>('#app')
    : document.querySelector<Element>('#app')

  if (!container) throw new Error('履约中心挂载容器 #app 不存在')

  initializeTheme()
  app = createApp(App)
  app.use(createFulfillmentRouter())
  app.mount(container)
}

export async function bootstrap() {}

export async function mount(props: MicroAppProps) {
  render(props)
}

export async function unmount() {
  app?.unmount()
  app = null
}

if (!window.__POWERED_BY_QIANKUN__) render()
