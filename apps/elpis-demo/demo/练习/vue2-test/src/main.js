import Vue from 'vue'
import App from './App.vue'
import MyRate from './components/my-rate.vue'

// 组件名, 组件本尊
Vue.component('MyRate', MyRate)

Vue.config.productionTip = false

// 注册全局自定义指令
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted(el) {
    // 聚焦元素
    el.focus()
  },
})

new Vue({
  render: (h) => h(App),
}).$mount('#app')
