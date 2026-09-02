import {createApp} from 'vue'
import {createOrderRouter} from './router'
import { createMemoryHistory } from 'vue-router'
import App from './App.vue'
import './style.css'

let app = null
let router = null
/**
 * 
 * @param {*} container 
 * @param {*} hostApi 提供两个回调函数 onChildRouteChange  onMounted
 * @param {*} initialPath 
 */
export async function mount({container,hostApi,initialPath='/orders/list'}) {
  // 订单子应用如果是独立运行，可以自己直接管理地址栏
  // 但是主应用接入进来之后，浏览器地址栏的控制权应该在主应用手里
  // 这里子应用直接使用内存路由
  router = createOrderRouter(createMemoryHistory())

  window.sharedRuntime = {
    owner:"订单子应用",
    form: "order-app mount"
  }

  await router.push(initialPath)

  // 使用vue的全局后置路由钩子
  router.afterEach((to)=>{
    // 子应用路由变化之后，通知主应用
    hostApi?.onChildRouteChange?.({
      path: to.fullPath,
      route: `#${to.fullPath}`
    })
  })

  app = createApp(App)
  app.use(router)

  await router.isReady()

  app.mount(container);

  hostApi?.onChildRouteChange?.({
    path: router.currentRoute.value.fullPath,
    route: `#${router.currentRoute.value.fullPath}`
  })

  hostApi?.onMounted?.('订单子应用已经执行了mount(),业务区开始显示')
}

export async function unmount(){
  app?.unmount()
  app = null;
  router = null;
}

export async function navigate(path){
  if(!router || router.currentRoute.value.fullPath === path){
    return;
  }

  await router.push(path)
}