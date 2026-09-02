import '@supply-chain/design-tokens/theme.css'
import './styles.css'

import { initializeTheme } from '@supply-chain/design-tokens/theme'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

initializeTheme()
createApp(App).use(router).mount('#app')
