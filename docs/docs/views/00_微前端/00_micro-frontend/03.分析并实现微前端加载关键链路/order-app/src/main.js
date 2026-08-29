import { createApp } from 'vue'
import { createWebHashHistory } from 'vue-router'
import App from './App.vue'
import { createOrderRouter } from './router'
import './style.css'

const router = createOrderRouter(createWebHashHistory())

router.afterEach((to) => {
  document.title = `订单管理 - ${to.meta.title}`
})

createApp(App).use(router).mount('#app')