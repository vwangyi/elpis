import '@supply-chain/design-tokens/theme.css'
import './styles.css'

import { initializeTheme } from '@supply-chain/design-tokens/theme'
import { createApp, nextTick } from 'vue'

import App from './App.vue'
import { startMicroApps } from './micro-apps'
import { startMicroRouterHost } from './micro-router-host'
import { startPlatformCommunication } from './platform-communication'
import router from './router'

initializeTheme()
createApp(App).use(router).mount('#app')
startMicroRouterHost(router)

await router.isReady()
await nextTick()
startPlatformCommunication(router)
startMicroApps(router)
