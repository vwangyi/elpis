

# store 

## Pinia

### 定义 store（推荐）
```js
// 定义store  /src/stores/user.ts
import { ref, computed } from 'vue';
import { defineStore } from 'pinia'
import * as screenAPI from '@/api/screen'
import { useXxxStore } from './xxx.js'
// useXxxxStore  取名规则
export const useUserStore = defineStore('user', () => {
    const count = ref(0)
    const xxxStore = useXxxStore(); // store中使用其他store
    const a = computed(() => count.value + 1)
    function increment() {
      count.value++
    }
    return { count, increment }
},
// pnpm install pinia-plugin-persistedstate
{
  persist: {
    storage: localStorage,
    pick: ["count"],
  },
}); 
```
### 使用 store （推荐）
```vue  
<script setup>
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'vue';
const userStore = useUserStore();

// pinia会帮我们把ref自动解包 所以不用.value 
console.log( userStore.count  ) 
// 顶层setup 不允许 await （解决方法 1 在store里面写await 2写.then）
console.log( userStore.increment()  ) 

  
// 直接解构会丢失响应式 需要用storeToRefs才可以解构
const { count, increment } = storeToRefs(userStore) 


// tsx中使用store 
// todo

</script>
```



### main.js
```js
// npm i pinia@next  
import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import persistentState from 'pinia-plugin-persistedstate'; // pinia做持久化的一个插件
const store = createPinia() 
store.use(persistentState); // 向Pinia注册piniaPersistedState插件

const app = createApp(App)
app.use(store); // 向Vue注册pinia插件
app.mount('#app') 


/**
 * store目录结构
 * pinia 取消了大store的概念 直接就是一个个小store
 * src 
 *  stores
 *    user.js
 *    order.js
 *    goods.js
 *    screen.js 
 */
```



### 其他
```js
定义 store 和 使用 store 的其他方式 
方式一 :pinia取消了大store的概念 直接就是一个个小store
import { defineStore } from 'pinia'
import * as screenAPI from '@/api/screen'
// useXxxxStore  取名规则
export const useUserStore = defineStore('user', () => {
    const count = ref(0)
    
    function increment() {
      count.value++
    }
    return { count, increment }
})
方式二
import { defineStore } from 'pinia'
import * as screenAPI from '@/api/screen'
export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    count: 0
  }),
  actions: {
    increment() {
      this.count++
    }
  }
})
方式三： 注意pinia取消了mutations的概念
import { defineStore } from 'pinia'
import * as screenAPI from '@/api/screen'
export const useUserStore = defineStore('user', {
  state: () => ({
    count: 0
  }),
  actions: {
    increment() {
      this.count++
    }
  }
})


import { useUserStore } from '@/stores/user'
export default {
  computed: {
    // other computed properties
    // ...
    // gives access to this.counterStore and this.userStore
    ...mapStores(useCounterStore, useUserStore),
    // gives read access to this.count and this.double
    ...mapState(useCounterStore, ['count', 'double']),
  },
  methods: {
    // gives access to this.increment()
    ...mapActions(useCounterStore, ['increment']),
  },
}


// 在页面上 引入刚刚 export 的小store
import { useCounterStore } from '@/stores/counter'

export default {
  setup() {
    const counter = useCounterStore()

    counter.count++
    // with autocompletion ✨
    counter.$patch({ count: counter.count + 1 })
    // or using an action instead
    counter.increment()
  },
}



// setup函数写法
import { useCounterStore } from '@/stores/counter'
export default {
  setup() {
    const store = useCounterStore()

    // store.updateUser()
    // store.xxx

    return {
      // you can return the whole store instance to use it in the template
      // 你可以返回整个store实例 在模板中使用 . 外面可以 this.store
      store,
    }
  },
}
pinia源码解析 https://www.jianshu.com/p/552ab71d7823 
```




## Vuex 
