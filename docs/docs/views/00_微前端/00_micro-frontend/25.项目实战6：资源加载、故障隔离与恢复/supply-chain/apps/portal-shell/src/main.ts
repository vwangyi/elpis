import '@supply-chain/design-tokens/theme.css'
import './styles.css'

import { initializeTheme } from '@supply-chain/design-tokens/theme'
import { createApp, nextTick } from 'vue'

import App from './App.vue'
import { startMicroRouterHost } from './micro-router-host'
import { startPlatformCommunication } from './platform-communication'
import router from './router'

initializeTheme()
createApp(App).use(router).mount('#app')
startMicroRouterHost(router)

await router.isReady()
await nextTick()
startPlatformCommunication(router)
// 先让 Vue Router 完成首次导航，再加载 qiankun/single-spa。
// 动态导入完成后立即 start，既不干扰主应用首屏，也不会触发 single-spa 的延迟启动提醒。
const { startMicroApps } = await import('./micro-apps')
startMicroApps(router)
