import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import store from './store'
// 有后端了就注释掉
import '@/mock'

Vue.use(ElementUI)

new Vue({
  store,
  el: '#app',
  render: (h) => h(App),
})
