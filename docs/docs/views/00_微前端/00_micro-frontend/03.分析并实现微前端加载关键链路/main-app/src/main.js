import { createApp } from 'vue'
import { createHostRouter } from './router'
import App from './App.vue'
import './style.css'

const router = createHostRouter()

createApp(App).use(router).mount('#app')
