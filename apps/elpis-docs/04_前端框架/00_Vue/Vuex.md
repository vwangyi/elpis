

## 应用场景
```javascript
一开始 状态就是在 组件内部的  随着项目的迭代 发现需要多个页面或组件 需要复用或通信 
  才提取到 全局store管理
根据经验得知 一定会复用 就可以一开始就写在 store里面

是否需要提取到 全局store 管理状态 

取决于 
1 是否多个页面共享数据
2 跳走后 跳回页面 是否需要还原跳之前的状态 （只针对react vue有keep-alive ）

拒绝 傻瓜式的 全部写进store 
也拒绝 傻瓜式的 全部写进 组件内部

应该根据  项目的不断迭代 成长  做对应的调整 
```





字段的默认值 应该是 页面的data或ref 决定 而不是store的state决定 

## Vuex的核心成员
```javascript
// 类似于 vue2导出的核心成员一样  
import * as interveneAPI from '@/api/intervene' 
export default {
  namespaced: true, // 开启命名空间 

  // 状态 
  state: {
    xxxList：[], // 响应式数据 
  }, 

  // 同步更新状态的方法
  mutations: { 
    UPDATE_XXX_LIST(state, payload) {
      state.xxxList = payload
    } 
  },

  // 封装异步方法
  actions: {  
    /* 更新体质辨识列表 */
    async updateInterveneList({ commit }, params) {
      const res = await interveneAPI.getInterveneList(params)
      commit('updateInterveneList', res.data)
    },
    async updateXxxList(context, params) {
      const res = await interveneAPI.getXxxList(params) 
      context.commit('UPDATE_XXX_LIST', res)
 
      // 调用本模块的mutations  
      context.commit('函数名', '传参') 
      // 调用其他模块的mutations   
      context.commit('模块名/函数名', '传参', { root: true }) 
      
      // 调用本模块的actions
      context.dispatch('函数名', '传参') 
      // 调用其他模块的actions  
      context.dispatch('模块名/函数名', '传参', { root: true }) 
      
      context.state // 本模块的state
    },
  },

  // 计算属性 
  // 1 计算出新值 2 简化访问 
  getters: {
    xxx: (state) => state, // 计算属性 可以拿到state对象 
    xx: (state) => state.xx.xx.xx.xx.xx.xx
  },
}
```



## 如何创建Store仓库
```javascript
import Vuex from 'vuex'
Vue.use(Vuex) // Vuex属于Vue的插件 插件都需要use注册一下 
const store = new Vuex.store({
  state: {},  // 根级别的state 
  mutations: {}, // 根级别的mutations 
  actions: {}, // 根级别的actions 
  getters: {}, // 根级别的getters 
  modules: {
    store1, 
    store2
  }
})


```



## 如何操作Store 
```javascript
// 一般的操作有 增删改查  
import Vuex from 'vuex' 
import Store from '@/store'
Vuex.mapState
Vuex.mapGetters
Vuex.mapActions
Vuex.mapMutations  
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex' 
const computed = {
  ...mapState('xxx', [
    'list',
    'xxx'
  ]),
  ...mapGetters('xxx', [
    'list',
    'xxx'
  ]), 
}

const methods = {
  ...mapActions('xxx', [
    'list',
    'xxx'
  ]),
  ...mapMutations('xxx', [
    'list',
    'xxx'
  ]), 
} 


store.dispatch() 
store.commit() 


export default {
  computed: { 
    取名() { 
      return this.$store.state.模块名1.数据名1  // this.$store.state['模块名/数据名']
    },
    ...mapState('模块名1', ['数据名1']),

    取名() { 
      return this.$store.getters.模块名1.数据名1 // this.$store.getters['模块名/数据名']
    },
    ...mapGetters('模块名1', ['数据名1']), 
  },
  methods: {

    取名() { 
      return this.$store.dispatch('模块名1/函数名1', 传参)
    },
    ...mapActions('模块名1', ['函数名1']),

    取名() { 
      return this.$store.commit('模块名1/函数名1', 传参)
    },
    ...mapMutations('模块名1', ['函数名1']), 
  }

}


import { useStore } from 'vuex'
const store = useStore() 

const xx = computed(() => store.xx.xx )
store.dispacth('', 传参)
```



## Vuex总结 
```javascript



> 全面分析vuex https://www.cnblogs.com/guojie-guojie/tag/vue-vuex/
-
```js

mutations 是定义同步的 是唯一可以修改state值的地方 因为devtools插件会检测到

getters 是全局的计算属性 computed是局部的计算属性 

没有vuex也可以写项目 但是vuex是vue的一个插件 用来管理组件状态的
有了vuex 项目的状态管理就更加清晰了
没有vuex 也可以过日子 


为什么只要是渲染数据 都要走 store 

state是响应式数据  页面上可以直接 用 this.$store.state.xxx 或 辅助函数的计算属性mapState
state是存放在内存中的 缺点一刷新就没了 优点 读取速度快 [内存中读取数据比从本地读取数据快很多]
所以 token个人信息 要过一下vuex 拿vuex里面的token去请求接口



走vuex 可以把响应式数据放 state中 而不是页面的data中 这样可以让页面更清爽

一般是大项目要走vuex 因为响应式数据太多了 小项目页面响应式数据不多嫌麻烦没走vuex

state和data都是响应式数据 都是存在内存中的 但是state是全局的 data是局部的





 一个页面使用的组件越多或者嵌套的组件越多
势必组件间通信越多 这样就很麻烦  就可以使用vuex来管理组件状态

一般小公司小项目 使用vuex比较少  没有像大项目那样 只要是异步借口获取的数据都走store
而是 直接在页面上 调用 api里面的函数拿到数据 挂在 页面的data中

大项目 只要是接口获取的数据是 渲染到页面上的 都要走store 
使用vuex的store注意点：
state虽然是 响应式数据 但和页面的data响应式数据 有点区别 
v-model是传一个变量 且只能传data中的响应式变量  不能把state中的变量 传到v-model里面 

因为 state的值 不能直接 更改 需要通过 vuex的commit函数 来更改 state中的值
我们使用vuex时 遇到页面的v-model 就只能在 data中 声明一个响应式变量 传到v-model里
最终v-model收集的值 在data中 发请求 调用actions 来更改服务器上的数据库的数据
数据库的数据修改成功之后  重新获取接口的数据。   state的值就更改了 

页面上要做v-model的反显 同样是 在页面上 调用actions的函数 发请求 
请求回来之后 拿到state的值  赋值给 data中 传递给v-model的那个变量

state的值 可以 赋值 给 data中的变量 
但不能直接 data() {return { hehe: this.$store.state.xxx }}  data中变量初始值不能直接写state的值
但 props接收的值 可以直接 写到 data中的变量 作为初始值因为 props比data先初始化
 
```

 
```

## 
