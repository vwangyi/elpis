import { createApp } from 'vue'
import type { Plugin } from 'vue'
import { createPinia } from 'pinia'
import App from './App.tsx'
import router from './router'
import Antd from 'ant-design-vue'
import './styles/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Antd as unknown as Plugin)
app.mount('#app')
