

### 问：Vue 的组件间通信
+ Vue组件间通信
    - 组件通信，有 父子 兄弟 跨代 全局
    - 父子通信
        * 父子通信 只能传 3个东西 属性 事件 插槽
        * 属性和事件 用 props和emits 或 $attrs接收
        * 插槽用 slot标签 或 $slots接收
    - 兄弟通信 
        * eventBus
    - 跨代通信
        * 用 provide 和 inject
    - 全局通信
        * 用 vuex 或 pinia 



```vue
$attrs包含所有事件和属性 用porps和emit接收 自动剔除   
<script setup>
import xixi from './xixi.vue'; 
</script>

<template> 
    <xixi :a="123" b="b" @onxixi="() => console.log('onxixi')" >   
        <template #default></template> 
         <template #xixi1> xixi1 </template>  
          <template v-slot:xixi2> xixi2 </template>
    </xixi>  
</template>

<!--  xxx 分割线 -->
<script setup> 
import { getCurrentInstance } from 'vue';
const vm = getCurrentInstance();
const props = defineProps({
    a: Number,
    b: String
});
const emit = defineEmits(['onxixi']);

console.log('$attrs', vm.attrs);
console.log('$slots', vm.slots);
</script> 
<template>
    <div v-bind="$attrs" @click="emit('onxixi')">
        <slot> 123 </slot>
        <template v-for="(_, name) in $slots">{{name}}</template>
    </div>
</template>

```

## 情况一：父子组件传参
```javascript
// 父传子 v-bind传 + props接 传递数据 基础类型和引用类型都可以   
// 父传子 v-on绑定 + $emit调用 传递事件函数   （this.$on()监听 this.$off()取消监听 this.$emit 调用）  v-model + model   .sync 可以传多个v-model
// 父传子 传结构化数据 传一个template标签 本质是传了一个回调函数 
//     传递 用   标签体里面传递 <template v-slot:插槽名="scoped"></template>  </子组件>   scoped是回调函数的形参 由slot标签上的所有属性组成的对象
//                 <template #插槽名="scoped"></template>
//                 <template #default="scoped"></template> 默认插槽  等价 <template v-slot:default="scoped"></template> 等价 <template v-slot="scoped"></template> 等价 <template></template>
//                 <template slot="插槽名" slot-scope="scoped">默认值 当父组件不传值 我就展示</template> 已废弃

//                 用template标签包裹 template不会生成多余的结构
                
//     接收 用    <slot name="自定插槽名" :xx="xx" /> 去接收 任意数量的标签属性 标签 



// 子传父 用$emit调用 传递事件函数  传递数据   函数形参传递数据 基础类型和引用类型都可以
//     传递 用 this.$emit('事件名', 数据)
//     接收 用 @事件名="函数名"  用$event接收数据

//     子传父 不能传递DOM结构


// 通过实例对象通信 
//  $parent / $children

//  ref='xx' this.$refs.xx // 拿到子组件实例对象 相当于子组件的this 

// this.$parent 是父组件的实例 拿到父组件实例 可以访问父组件实例身上的属性和方法 (组件只有一个父亲)
// this.$children[0]  可以访问子组件实例身上的属性和方法 (组件可以有多个儿子 所以是数组)   $children并不能保证顺序 且访问的数据也不是响应式的

// this.$parent // 相当于父组件的this
// this.$parent.$parent // 相当于父组件的父组件的this
// this.$children[0] // 相当于某个子组件的this 但数据不是响应式的 拿子组件this的数据 用ref标记比较好


// 父组件调用子组件的方法 
// 用 ref="xxx" 和 this.$refs.xxx.方法名 // 通过ref属性拿到子组件实例对象 通过子组件实例对象 调用子组件的方法
 


// props传递下来的值 是异步的 不知道值什么时候传递下来 
//     1 props 配置项 computed 和 watch 和 template 可以拿到 每次更新的值
//     2 除了computed和watch和 template 其他地方拿props的值都是 第一次的默认值 不会更新
//     比如 data里面 return {xixi: this.value}
//     created mounted 等地方 即使加了 nextTick也没用
//     只能拿到第一次传递的默认值

//     3 props是只读的 不能修改

//     4 template里面用 xxx-xxx  script里面用小驼峰 xxxXxx

//     正常情况是不会改props的 只有数据源 才有资格改数据 如果要改 通知父组件改数据 

```





## 情况二： 定义全局事件总线 $bus  可以全局通信 常用兄弟间通信
```javascript

命名 $bus ｜ $eventBus ｜ $globalBus | $baseEventBus 反正都是 全局事件总线的意思
 全局事件总线 可以全局通信 常用兄弟间通信   $bus 通过绑定事件来传递数据 注意先绑定 后触发

路由跳转 触发 初始化 
用户交互比如点击按钮 触发 更新
用户离开 或跳走 触发 销毁


> 命名 $bus ｜ $eventBus ｜ $globalBus | $baseEventBus 反正都是 全局事件总线的意思
```

> 第一种方式
>

```javascript
// main.js
new Vue({
    el: '#app',
    beforeCreate() {
        // 创建vue实例之前 把全局this挂着构造函数Vue的原型对象上  所有this上都有$bus了
        Vue.prototype.$bus = this
    }
})
```

> 第二种方式
>

```javascript
// main.js  在能拿到Vue的地方都可以 
Vue.prototype.$bus = new Vue()    // new了一个新的vue实例 作为全局事件总线  相当于这个项目有了两个vue
```

> 第三种方式
>

```javascript
// main.js
import Vue from 'vue' 
const Bus = Vue.extend({})  // 创建一个空的vue实例
const bus = new Bus()
Vue.prototype.$bus = bus
new Vue({
  el: '#app',
  render: h => h(App)
}) 
```

> 使用全局事件总线
>

```javascript
// 拿到全局事件总线 $bus
this.$bus // 这就是一个全局的this vue实例 用来绑定一堆事件 通过触发事件传值 实现通信
 
//  只要组件一挂载 A组件绑定自定义事件 接收数据
mounted(){
  // this.$bus 就是一个全局的vue实例 所有this都可以拿到
    this.$bus.$on('自定事件名',this.demo | 箭头函数)
// 参数2 要么写一个箭头函数 要么写一个method里面的函数 涉及到this
}


//  B组件  触发事件 传递数据
this.$bus.$emit('函数名xxx', 传参)

// 销毁前解绑 谁绑定就是谁解绑 给谁绑定 事件就在谁身上 谁就可以解绑 (如果不传事件名 默认解绑所有事件 就坏事了)
beforeDestroyed(){
  this.$bus.$off('事件名')
}
 
// 之前绑定事件 不解绑 是因为 this实例都销毁了 实例身上的事件自然也没了
// 这里是全局事件总线    这个实例一直存在 不会销毁 所以要解绑


// （适用于少量数据的组件间共享  兄弟间）

// （太多数据的组件共享 使用vuex）

// > 全局事件总线这个实例身上专门用来绑定事件和触发事件的
// 因为是总线 组件A在总线上 绑定 haha 事件 其他组件就不能再绑定haha事件了

// 所以公司一般用一个 src/config/constanst.js文件定义常量 里面是一堆定义了总线上的事件名
// 防止 事件重名
// const EVENT = {
//     haha: 'haha',
//     xixi: 'xixi'
// }
```



## 爷传孙  $ attrs /  $listeners
```vue
隔代少 用传递数据 用$attrs / $listeners
隔代多 用依赖注入 provide/inject




考虑一种场景，如果A是B组件的父组件，B是C组件的父组件。如果想要组件A给组件C传递数据，这种隔代的数据，该使用哪种方式呢？

如果是用props/$emit来一级一级的传递，确实可以完成，但是比较复杂；如果使用事件总线，在多人开发或者项目较大的时候，维护起来很麻烦；如果使用Vuex，的确也可以，但是如果仅仅是传递数据，那可能就有点浪费了。

针对上述情况，Vue引入了$attrs / $listeners，实现组件之间的跨代通信。

先来看一下inheritAttrs，它的默认值true，继承所有的父组件属性除props之外的所有属性；inheritAttrs：false 只继承class属性 。
● $attrs：继承所有的父组件属性（除了prop传递的属性、class 和 style ），一般用在子组件的子元素上
● $listeners：该属性是一个对象，里面包含了作用在这个组件上的所有监听器，可以配合 v-on="$listeners" 将所有的事件监听器指向这个组件的某个特定的子元素。（相当于子组件继承父组件的事件）
```





## 
##  
## vue-router 的 路由的 params 和 query 和 props 传参
路由组件之间通信 A路由组件 跳转 B路由组件 传递数据

传基础类型  用路由的query  
传对象数组  用路由的props

```javascript
// npm i vue@2.6.10


// 第一步 拿到Vue类
import Vue from 'vue';

// 第二步 拿到VueComponent类
const VueComponent = Vue.extend(options);

// 第三步 把Vue类实例化为对象
const viewModel = new Vue({})

// 第四步 把VueComponent类实例化为对象
const vm = new VueComponent({}) // 有些人叫这个为vc 我还是叫vm


// 第五步 实例化对象需要的配置参数
const options = {   
    // DOM
    el: '#app', // 挂载元素
    name: 'app', // 组件名  
    template: '<div></div>', // 模板 template和render只能存在一个 template会被编译成render函数  
    render: h => h(App), // 渲染函数
    renderError(h, err) {}, // 渲染错误


    // 数据 
    data: function() {return {} }, // 根组件可以是对象 非根组件必须是函数返回一个对象 不能是箭头函数 定义响应式数据的默认值 类似数据库
    props: {}, // 父组件传递过来的数据 类似函数的形参变量
    propsData: {}, // 传递给props的默认值
    computed: {}, // 计算属性
    methods: {}, // 方法
    watch: {}, // 监听属性 

    // 生命周期钩子函数   一般先在methods里面封装函数 在下面的钩子函数里面调用
    beforeCreate() {}, // 创建前
    created() {}, // 创建后
    beforeMount() {}, // 挂载前
    mounted() {}, // 挂载后
    beforeUpdate() {}, // 更新前 
    updated() {}, // 更新后 
    // vue-router提供的钩子函数 执行顺序在销毁之前 
    activated() {}, // keep-alive组件激活时调用
    deactivated() {}, // keep-alive组件停用时调用 
    beforeDestroy() {}, // 销毁前
    destroyed() {}, // 销毁后 
    errorCaptured(err, vm, info) {}, // 捕获错误

    // vue-router提供的钩子函数
    beforeRouteEnter(to, from, next) {}, // 路由进入前
    beforeRouteUpdate(to, from, next) {}, // 路由更新前
    beforeRouteLeave(to, from, next) {}, // 路由离开前 


    // 资源
    directives: {}, // 指令
    filters: {}, // 过滤器
    components: { '自定义组件名': 组件对象 }, // 组件 

    // 组合
    parent: {}, // 父组件
    mixins: [], // 混入
    extends: {}, // 继承
    provide: {}, // 提供
    provide: function() {return {}}, // 提供
    inject: [], // 注入

    // 其他 
    router, // 路由器实例对象
    store, // store实例对象
    delimiters: ['${', '}'],
    functional: true, // 函数式组件
    model: { prop: 'value', event: 'input' }, // v-model
    inheritAttrs: false, // true 继承父组件除了props的其他所有属性 false只继承父组件class属性
    comments: true, // 注释
}
 


// 第六步 Vue类的属性方法    共享 提升到类层面的 全局共享方法属性 
Vue.extend({}); // 获取VueComponent类
Vue.nextTick(callback); // 异步更新DOM
Vue.set(target, key, value); // 设置响应式数据
Vue.delete(target, key); // 删除响应式数据
Vue.directive('指令名', {}); // 注册全局指令
Vue.filter('过滤器名', {}); // 注册全局过滤器
Vue.component('组件名', 组件对象); // 注册全局组件
Vue.use(插件); // 使用插件
Vue.mixin({}); // 全局混入
Vue.compile('<div></div>'); // 编译模板
Vue.observable({}); // 创建响应式数据
Vue.version; // 获取版本号
Vue.config; // 获取配置参数



// 第七步 viewModel实例对象的属性方法
// 实例属性

数据 vm.$data; // 获取响应式数据
数据 vm.$props; // 获取props属性
 vm.$isServer; // 是否服务端渲染
 vm.$attrs; // 获取非props属性
 vm.$listeners; // 获取非原生事件
数据 vm.$options; // 获取所有配置参数

dom vm.$el; // 获取挂载元素
dom vm.$root; // 获取根组件实例对象
dom vm.$parent; // 获取父组件实例对象
dom vm.$children; // 获取子组件实例对象
dom vm.$slots; // 获取插槽内容
dom vm.$scopedSlots; // 获取作用域插槽内容 

dom vm.$refs; // 获取ref属性值对应的DOM元素

// 实例方法 数据
vm.$watch('表达式', callback); // 监听数据变化
vm.$set(target, key, value); // 设置响应式数据
vm.$delete(target, key); // 删除响应式数据

// 实例方法 事件
vm.$on('事件名', callback); // 监听/绑定 自定义事件
vm.$once('事件名', callback); // 监听/绑定 一次自定义事件
vm.$off('事件名', callback); // 取消 监听/绑定 自定义事件
vm.$emit('事件名', 参数); // 触发自定义事件

// 实例方法 生命周期
vm.$mount('#app'); // 手动挂载
vm.$destroy(); // 销毁实例对象
vm.$forceUpdate(); // 强制更新视图
vm.$nextTick(callback); // 异步更新DOM 
语法：this.$nextTick(回调函数)
作用：在下一次DOM更新结束后执行其指定的回调。
什么时候用：当改变数据后，要基于更新后的新DOM进行某些操作时，要在nextTick所指定的回调函数中执行。

vm.$store; // 获取store实例对象
vm.$router; // 获取router实例对象
vm.$route; // 获取当前路由对象 
 





























vue模版其实就是 render函数

// 第八步 vue指令


// 第九步 vue特殊属性


// 第十步 vue内置组件
component
transition
transition-group
keep-alive
slot

```





```markdown
# Vue2



## 新建vue2项目 
> 方式一 直接采用github上的开源模版
```shell
# 采用github上的开源模版
git clone https://github.com/PanJiaChen/vue-admin-template
```
> 方式二 npx在线创建vue2项目 
```shell
# 在线 搭建 vue项目 而不用下载@vue/cli脚手架  
# -m npm 的意思是采用npm创建项目    
# 一般项目名或文件名 会作为url路径一部分 建议不要有大写字母
npx @vue/cli create 项目名 -m npm  
```

> 方式三 采用@vue/cli脚手架创建vue2项目
```shell
# 安装npm第三方库 @vue/cli 得到一个vue命令
npm install @vue/cli -g
# 验证是否安装成功
vue -V
# 创建项目 
vue create 项目名
cd 项目名
npm run serve

``` 

## 认识Vue
```js
// Vue 读音 /vjuː/ 类似于 view 视图 

// Vue是一套用于 构建用户界面的渐进式框架。

// 构建用户界面：vue把数据渲染到页面上 至于怎么渲染 那是vue的事情 不需要程序员关心
// 程序员只需要做的就是 
// 把拿到数据 把数据处理成 vue组件需要的样子 传给vue组件 vue就会做接下来的事情把数据渲染到页面上

// 渐进式: Vue 被设计为可以自底向上逐层应用。
// 意思就是 vue是支持插件的 
// 如果你只是一个小应用 你只需要用到vue的核心功能就可以了 不需要使用 vue-router vuex等插件
// 如果你的应用变得越来越大 这个时候可以引入 vuex 来管理状态 vue-router 来管理路由等一系列的插件

// vue推荐声明式渲染 就是用 template 模板语法 指令等 来渲染数据
// vue也支持编程式渲染 就是用 js 语法来渲染数据

// vue官网推荐一些vue库
// https://github.com/vuejs/awesome-vue
// https://awesomejs.dev/for/vue/

// npm i vue@2.6.10 
import Vue from 'vue' // 拿到Vue构造函数 或者说 拿到Vue类

// 1 Vue本身挂了很多API 也就是静态属性和静态方法 用于全局共享
// 2 可以 new Vue() 得到一个Vue实例对象 vm 也就是组件实例对象 
//  一个vue项目中 一般只会 new 一个Vue实例对象 vm
//   其他页面的属于 子组件实例对象 vc

const vm = new Vue({ 
  el: '#app',
  router,
  store,
  components: { 
    // 项目中所有的二级组件都会在这里注册 他们的内部同样会有三级组件 以此类推
    // 但是 我们不会用这种方式 而是用Vue.component()全局注册组件
    UserList: UserList,
    UserAdd: UserAdd,
    // 组件名: 组件对象
  },
  render: h => h(App)
}) 
// vm中配置项的data可以是对象 因为vm在整个vue项目中只有一个 vm是一个根组件 不存在复用的情况
// vc中的配置项的data必须是函数 因为vc不是根组件 是存在复用的情况 所以data必须是函数返回一个新对象
``` 
 
## Vue类
> const vm = new Vue({配置项})
```js
// npm i vue@2.6.10
import Vue from 'vue'

const vm = new Vue({})

```
```js
Vue.config
Vue.extend
Vue.nextTick
Vue.set
Vue.delete
Vue.directive
```

## VueComponent类 
```js
const VueComponent = Vue.extend({配置项})
const vc = new VueComponent() // vc是一个组件实例对象


对于 VueComponent的实例对象 叫vc 是民间说法
而 Vue的实例对象 叫vm 是官方说法 

vm是viewModel的缩写 也就是视图模型

本人更倾向于 不管是Vue或VueComponent的实例对象 都叫 vm 

只不过Vue的实例是根组件实例对象 vc是子组件实例对象  我认为都是 viewModel 

如果把VueComponent 叫 vc 那Vue的实例对象 为啥不叫 v 呢

所以 我把VueComponent或Vue的实例对象 都叫 vm    vm毕竟是官方说法
 

```  
## 配置项
```js
new Vue({}) 和 new VueComponent({}) 创建实例传入的配置项 大体一样 
区别是 
  const vm = new Vue({}) // 有el属性 指定一个挂载点DOM 和 data可以是对象  
    // 创建的实例是 根组件实例对象 简称 vm
  const vc = new VueComponent({}) // 没有el属性 data必须是函数返回一个对象 
    // 创建的实例是 子组件实例对象 简称 vc
```

## 配置项-数据
### data 
```js  
    // data只能传一个函数返回一个对象 不能是箭头函数 
    // 里面存放组件的响应式数据 不需要渲染的数据 放在导出对象的上方
export default {
    // 定义响应式数据的默认值
    data: function() {
        return { 
            loading: false,
            data: {
                name: '--', // 张三
                age: '--' // 0 99
            },
            params: {
                name: '',
                age: 0
            }
        }
    },
 
    // vuex的state中的数据也是响应式的 和这里一样 区别就是 state是全局 data是组件内部

    // 对于没有初始化的变量 需要通过 this.$set() $delete 可以实现响应式

    // this.$set(todo,'isEdit',true)
    // 给todo对象添加 isEdit属性 值为true 并且是响应式的
    // this.$set(this, 'msg', 'hello world')
    // this.$delete(todo,'isEdit')
    props: {},
    computed: {},
    watch: {},
    methods: {},
}
```
### props 
```js 
// 只有子组件才有 props: {} 配置项
// props是只读的  不能更改props的变量
// props是响应式的 
// 遵循单向数据流  父组件传递给子组件的数据 不能在子组件中修改
// 垃圾写法 把props 赋值到data中的响应式变量中 修改这个响应变量
export default {
    data: function() {return {}},
    // 定义组件外部传入的数据的默认值 类似于函数形参
    props: {
        data: {
            type: Object,
            default: () => ({
                name: '--', // 张三
                age: '--' // 0 99
            })

        },
        // 接收父组件传递过来的数据 
        msg: String,
        obj: Object,
        fn: Function,
        count: Number,
        isShow: Boolean,
        arr: Array,
        // 自定义校验规则
        age: {
            type: Number,
            default: 18,
            required: true,
            validator: function (value) {
                return value > 18
            }
        }
    },
    computed: {},
    watch: {},
    methods: {},
}
```  
### computed 
```js 
export default {
    data: function() {return {}},
    props: {},
    computed: {
        // 计算属性
        fullName: function() {
            return this.firstName + this.lastName
        },
        name: {
            get: function() {
                return this.firstName + this.lastName
            },
            set: function(newValue) {
                var names = newValue.split(' ')
                this.firstName = names[0]
                this.lastName = names[names.length - 1]
            }
        }
    },
    watch: {},
    methods: {},
}
``` 
### watch 
```js 
export default {
    data: function() {return {}},
    props: {},
    computed: {},
// 监视属性 一般监听用户的同步操作 操作了哪个属性
// 监听 props vuex中的state this上的所有属性
    watch: {
        'data.name': function(newValue, oldValue) {
            console.log(newValue, oldValue)
        },
        'data.age': {
            handler: function(newValue, oldValue) {
                console.log(newValue, oldValue)
            },
            immediate: true,
            deep: true
        },

    // 写法一  
    watch: {
        firstName: function (newValue, oldValue) {
            console.log(newValue, oldValue)
        },
        'obj.a': function (newValue, oldValue) {
            console.log(newValue, oldValue)
        }
    },
    // 写法二 
    watch: {
      //  // 属性--- 是监听组件实例身上的 属性的属性值变化  表示watch监视这个数据
      属性: {
        // 当浅层次监听不到 才使用deep: true
        deep: true,
        // 表示handler在初始化时就会立即调用一次
        immediate: true,
        // 监测数据 数据发生变化 就调用
        handler(newvalue, oldvalue){
          localStirage.setItem('todos',JSON.stringify(newvalue))
        }
      }
    }
    },
    methods: {},
}
``` 

### methods 
```js 
export default {
    // 组件中 封装方法的地方
    methods: {

        // 事件处理函数 一般是 描述用户的同步操作 并不强调异步网络请求
        // 页面上所有事件 比如 命名为 动词+名词  click open close change submit save delete add update edit 
        // 页面loading属于页面状态 属于同步事件去处理 不应该把loading封装在 异步请求事件里面  
        // 同步事件里面 调用异步接口前 开启loading 异步接口数据回来后关闭loading
        // 处理数据给 异步事件接口 处理事件也是同步事件里面做 
        clickAppleBtn(){}, // 点击苹果按钮
        openDialog(){}, // 打开弹窗
        closeDialog(){}, // 关闭弹窗
        clearInput(){}, // 清空输入框
        clearForm(){}, // 清空表单

        // 还有一个异步的 定义到 action里面  update add delete get     // updateXxxList updateXxxDetail
        // 封装action的异步接口 完整的遵循 接收什么参数 返回对应数据
        updateUserInfo(){}, // 更新用户信息



        initData: function() {
            this.loading = true
            setTimeout(() => {
                this.loading = false
                this.data = {
                    name: '张三',
                    age: 18
                }
            }, 1000)
        },

        test:function () {
            console.log('test')
        },
        test() {
            console.log('test')
        },
        'test-msg': function () {
            console.log('test')
        },
        'test-msg'() {

        },
    },
}
``` 


 
## 配置项-生命周期钩子
### beforeCreate 
```js
export default {
    data: function() {return {}},
    props: {},
    computed: {},
    watch: {},
    methods: {},
    beforeCreate: function() {
        console.log('beforeCreate')
    }
}
```
### created 
```js
export default {
    data: function() {return {}},
    props: {},
    computed: {},
    watch: {},
    methods: {},
    created: function() {
        console.log('created')
    }
}
```
### beforeMount 
```js
export default {
    data: function() {return {}},
    props: {},
    computed: {},
    watch: {},
    methods: {},
    beforeMount: function() {
        console.log('beforeMount')
    }
}
```
### mounted 
```js
export default {
    data: function() {return {}},
    props: {},
    computed: {},
    watch: {},
    methods: {},
    mounted: function() {
        console.log('mounted')
    }
}
```
### beforeUpdate 
```js
export default {
    data: function() {return {}},
    props: {},
    computed: {},
    watch: {},
    methods: {},
    beforeUpdate: function() {
        console.log('beforeUpdate')
    }
}
```
### updated 
```js
export default {
    data: function() {return {}},
    props: {},
    computed: {},
    watch: {},
    methods: {},
    updated: function() {
        console.log('updated')
    }
}
```
### activated 
```js
export default {
    data: function() {return {}},
    props: {},
    computed: {},
    watch: {},
    methods: {},
    activated: function() {
        console.log('activated')
    }
}
```
### deactivated 
```js
export default {
    data: function() {return {}},
    props: {},
    computed: {},
    watch: {},
    methods: {},
    deactivated: function() {
        console.log('deactivated')
    }
}
```
### beforeDestroy 
```js
export default {
    data: function() {return {}},
    props: {},
    computed: {},
    watch: {},
    methods: {},
    beforeDestroy: function() {
        console.log('beforeDestroy')
    }
}
```
### destroyed 
```js
export default {
    data: function() {return {}},
    props: {},
    computed: {},
    watch: {},
    methods: {},
    destroyed: function() {
        console.log('destroyed')
    }
}
```
### errorCaptured 
```js
export default {
    data: function() {return {}},
    props: {},
    computed: {},
    watch: {},
    methods: {},
    errorCaptured: function() {
        console.log('errorCaptured')
    }
}
```
### beforeRouteEnter 
```js
export default {
    data: function() {return {}},
    props: {},
    computed: {},
    watch: {},
    methods: {},
    beforeRouteEnter: function(to, from, next) {
        console.log('beforeRouteEnter')
    }
}
```
### beforeRouteUpdate 
```js
export default {
    data: function() {return {}},
    props: {},
    computed: {},
    watch: {},
    methods: {},
    beforeRouteUpdate: function(to, from, next) {
        console.log('beforeRouteUpdate')
    }
}
```
### beforeRouteLeave 
```js
export default {
    data: function() {return {}},
    props: {},
    computed: {},
    watch: {},
    methods: {},
    beforeRouteLeave: function(to, from, next) {
        console.log('beforeRouteLeave')
    }
}
```
 
## 配置项-DOM
### el 
```js
const vm = new Vue({
    el: '#app', // 指定当前组件的挂载点 这里是连接到index.html的id为app的div上 
})
vm.$mount('#root')  // 不常用
```
### template 
```js
export default {
    template: '<div>template</div>',
    data: function() {return {}},
    props: {},
    computed: {},
    watch: {},
    methods: {},
}
```
### render 
```js
// 既然是纯函数 那可以是.js文件 也可以是.vue文件的<script>但不能有<template> 
export default {
  name: 'xxxx',
  functional: true,  
  render(h, context) { 
    return h('div', { 
      // 对应模板中的 `v-bind:class`
      'class': {
        foo: true,
        bar: false
      },
      // 对应模板中的 `v-bind:style`
      style: {
        color: 'red',
        fontSize: '14px'
      },
      // 普通的 HTML attribute
      attrs: {
        id: 'foo'
      },
      // 组件 prop
      props: {
        myProp: 'bar'
      },
      // DOM property
      domProps: {
        innerHTML: 'baz'
      },
      // 对应模板中的 `v-on:`
      // 事件监听器在 `on` 内，
      // 但不再支持如 `v-on:keyup.enter` 这样的修饰器。
      // 需要在处理函数中手动检查 keyCode。
      on: {
        click: this.clickHandler
      },
      // 仅用于组件，用于监听原生事件，而不是组件内部使用
      // `vm.$emit` 触发的事件。
      nativeOn: {
        click: this.nativeClickHandler
      },
      // 自定义指令。注意，你无法对 `binding` 中的 `oldValue`
      // 赋值，因为 Vue 已经自动为你进行了同步。
      directives: [
        {
          name: 'my-custom-directive',
          value: '2',
          expression: '1 + 1',
          arg: 'foo',
          modifiers: {
            bar: true
          }
        }
      ],
      // 作用域插槽的格式为
      // { name: props => VNode | Array<VNode> }
      scopedSlots: {
        default: props => createElement('span', props.text)
      },
      // 如果组件是其它组件的子组件，需为插槽指定名称
      slot: 'name-of-slot',
      // 其它特殊顶层 property
      key: 'myKey',
      ref: 'myRef',
      // 如果你在渲染函数中给多个元素都应用了相同的 ref 名，
      // 那么 `$refs.myRef` 会变成一个数组。
      refInFor: true
    }, context.children)  
  },
}

```

```js
  //  https://pythonjishu.com/ascanwfyheqxebt/
  //  在vue中使用export default导出的class类方式
  //  export default class SelfTestingList extends Vue {}

  
export default {
    name: 'SelfTestingList',
    functional: true,
    render(createElement, context) {
      // 通常把createElement简写成h 意思为 hyperscript
      console.log(createElement, context)
      const h = createElement('div', 'hello world')

      // createElement('标签名', {标签的属性}, ['标签的内容'])
      // createElement('标签名', {标签的属性}, 节点)

      // 第一个参数：{String | Object | Function}
      // 必选项。一个 HTML 标签字符串 | 组件选项对象组件实例对象 | resolve 了上述任何一种的一个 async 函数

      // 第二个参数：{Object}
      // 可选项。第一个参数DOM标签的行内属性 一个与模板中属性对应的数据对象
      // 例如：{ 'class': 'class-name', style: { color: 'red', fontSize: '14px' } }

      // 第三个参数：{String | Array}
      // 可选项。标签中的内容 也就是 第一个参数DOM标签的子节点
      // 可以传 一个或多个 因为一个标签可以有多个子节点 也可以一个都没有
      // 例如：['some text', createElement('h1', 'a title')]
      // 例如：'some text' 文本字符串也是节点  节点: 标签节点、文本节点、注释节点 都属于节点

      // 能达到手写h函数就6b了
      return h
    },
  } 
  //  用了render函数 就不能写<template>模板了  
  // 用收到的h函数实现模板的功能
  
  1 v-if v-for
  {
    render: function (createElement) {
    if (this.items.length) {
      return createElement('ul', this.items.map(function (item) {
        return createElement('li', item.name)
      }))
    } else {
      return createElement('p', 'No items found.')
    }
  }
  }
  2 v-model
  {
    props: ['value'],
    render: function (createElement) {
      var self = this
      return createElement('input', {
        domProps: {
          value: self.value
        },
        on: {
          input: function (event) {
            self.$emit('input', event.target.value)
          }
        }
      })
    }
  }
  3 插槽 <slot></slot>
  {
    render: function (createElement) {
      // `<div><slot></slot></div>`
      return createElement('div', this.$slots.default)
    }
  }
```
### renderError 
```js
export default {
    renderError: function(h, err) {
        return h('div', {}, err.stack)
    },
    data: function() {return {}},
    props: {},
    computed: {},
    watch: {},
    methods: {},
}
```
 
## 配置项-资源
### directives 
```js
export default {
    directives: {},
    data: function() {return {}},
    props: {},
    computed: {},
    watch: {},
    methods: {},
}
```
### filters 
```js
export default {
    filters: {},
    data: function() {return {}},
    props: {},
    computed: {},
    watch: {},
    methods: {},
}
```
### components 
```js
export default {
    components: {},
    data: function() {return {}},
    props: {},
    computed: {},
    watch: {},
    methods: {},
}
```
 
## 配置项-组合
### parent 
```js
export default {
    parent: {},
    data: function() {return {}},
    props: {},
    computed: {},
    watch: {},
    methods: {},
}
```
### mixins 
```js

import { mapGetters, mapActions } from 'vuex'
// mixins 导出一个函数返回一个对象 是为了接收参数
export default function createMixin (key) {
  return {
    computed: {
      ...mapGetters(key, [
        'isCollapse'
      ])
    },
    methods: {
      ...mapActions(key, [
        'toggleCollapse'
      ])
    },
    created () {
      this.getEmployeeList()
    }
  }
}
// mixins 导出 一个对象  
export default {
  computed: {
    ...mapGetters('department', [
      'isCollapse'
    ])
  },
  methods: {
    ...mapActions('department', [
      'toggleCollapse'
    ])
  },
  created () {
    this.getEmployeeList()
  }
}
import mixin from '@/mixin/employee'
export default {
  mixins: [ mixin ],
  mixins: [ mixin('key') ],
  // mixin中 就算引入created 这里同样可以写created
  computed: {
    aa() {
      return 123
    }
  },
  created () {
    console.log(this.aa)
  }
} 
// 对于template中 重复的结构 可以封装组件
// 对于script中 重复的逻辑 可以mixin引入
// 对于 style中 重复的样式 则可以用 less 或 scss 中的方法来踢去公共部分
```
### extends 
```js
export default {
    extends: {},
    data: function() {return {}},
    props: {},
    computed: {},
    watch: {},
    methods: {},
}
```
### provide / inject 
```js
export default {
    provide: function() {
        return {
            msg: 'provide'
        }
    },
    inject: ['msg'],
    data: function() {return {}},
    props: {},
    computed: {},
    watch: {},
    methods: {},
}
```
 
## 配置项-其它
### name 
```js
export default {
    // 1 给组件起名字 一般和文件名一致 这里将覆盖其他地方取的组件名
    // 2 做缓存用 配合 keep-alive 组件使用
    // 3 通过 name 注册组件
    name: 'HelloWorld',
    data: function() {return {}},
    props: {},
    computed: {},
    watch: {},
    methods: {},
}
```
### delimiters 
```js
export default {
    delimiters: ['${', '}'],
    data: function() {return {}},
    props: {},
    computed: {},
    watch: {},
    methods: {},
}
```
### functional 
```js
export default {
    functional: true,
    data: function() {return {}},
    props: {},
    computed: {},
    watch: {},
    methods: {},
}
```
### model 
```js
export default {
    model: {
        prop: 'checked',
        event: 'change'
    },
    data: function() {return {}},
    props: {},
    computed: {},
    watch: {},
    methods: {},
}
```
### inheritAttrs 
```js
export default {
    inheritAttrs: false,
    data: function() {return {}},
    props: {},
    computed: {},
    watch: {},
    methods: {},
}
```
### comments 
```js
export default {
  comments: true,
  data: function() {return {}},
  props: {},
  computed: {},
  watch: {},
  methods: {},
}
```

  

 

## Vue类的实例对象vm 
## VueComponent类的实例对象vc
```js
对于 new Vue() 或 new VueComponent() 的实例对象 vc 或 vm 
拥有的属性和方法都是一样的 


// 在类的内部通过this拿到实例对象

大部分只需要了解 常用的有
$set
$delete
$refs

```
## 组件实例对象 => 属性
### vm.$props
```js
vm.$props
```
### vm.$el
```js
vm.$el 
```
### vm.$options
```js
// 17. 通过 this.$options 拿到当前组件的配置项 this.$options.name 拿到当前组件的名称
vm.$options
```  
### vm.$root
```js
// 拿到根组件
vm.$root
```
### vm.$children
```js
vm.$children
```
### vm.$slots
```js
// 拿到当前组件的插槽内容
vm.$slots
``` 
### vm.$scopedSlots
```js
// 拿到当前组件的作用域插槽内容
vm.$scopedSlots
```
### vm.$refs
```js
// 配合 ref="xxx" 使用 拿到dom对象或子组件实例对象
vm.$refs
```
### vm.$isServer
```js
vm.$isServer
```
### vm.$attrs
```js
// 拿到父组件传递过来的属性
vm.$attrs
```
### vm.$listeners
```js
// 拿到父组件传递过来的事件
vm.$listeners
```
## 组件实例对象 => 方法-数据
### vm.$watch()
```js 
// 监听数据变化
vm.$watch('firstName', {
    immediate: true,
    handler(newValue, oldValue) {
    // 注意这里一定要写箭头函数 就向外找 找到vm 作为自己的this
    setTimeout(() => {
      this.fullName = newValue + '-' + this.lastName;
    }, 3000)
  }
})
```
### vm.$set
```js
// 添加响应式属性
vm.$set(todo,'isEdit',true)
// 给todo对象添加 isEdit属性 值为true 并且是响应式的
vm.$set(this, 'msg', 'hello world')
```
### vm.$delete
```js
// 删除响应式属性
vm.$delete(todo,'isEdit')
```
## 组件实例对象 => 方法-事件
### $on
```js
vm.$on('test-msg', function () {
    console.log('test')
})
```
### $once
```js
vm.$once('test-msg', function () {
    console.log('test')
})
```
### $off
```js
vm.$off('test-msg', function () {
    console.log('test')
})
```
### $emit
```js
vm.$emit('test-msg')
看$on 绑定的是异步还是同步 
uniapp中实验 await uni.$emit('refresh') 是有效果的
```
### $event
```js
vm.$event
```
## 组件实例对象 => 方法-生命周期
### $mount
```js
vm.$mount('#root')
```
### $forceUpdate
```js
vm.$forceUpdate()
```
### $nextTick
```js
vm.$nextTick()
```
### $destroy
```js
vm.$destroy()
```

 



## Vue类的静态属性和静态方法
```js 
// 共享
// 提升到类层面的 全局共享方法属性
```

## 静态属性
```js


```

## 静态方法
### extend
```js
// es5 方式 实现 所有对象共享 function : Vue.prototype.extend = function() {}
// es6 方式 实现 所有对象共享 class : 

// 函数式组件 hooks
// 类组件 class 
Vue.prototype.extend = function() {
    // 1. 拿到父类
    const Super = this
    // 2. 创建子类
    const Sub = function VueComponent(options) {
        this._init(options)
    }
    // 3. 子类继承父类
    Sub.prototype = Object.create(Super.prototype)
    Sub.prototype.constructor = Sub
    // 4. 子类添加静态方法
    Sub.extend = Super.extend
    // 5. 子类添加静态属性
    Sub.options = Super.options
    // 6. 子类添加实例方法
    Sub.prototype._init = function(options) {
        // 1. 拿到父类
        const Super = this.constructor
        // 2. 拿到父类的配置项
        const SuperOptions = Super.options
        // 3. 拿到子类的配置项
        const SubOptions = options || {}
        // 4. 合并配置项
        this.$options = mergeOptions(SuperOptions, SubOptions)
        // 5. 初始化生命周期
        initLifecycle(this)
        // 6. 初始化事件中心
        initEvents(this)
        // 7. 初始化渲染
        initRender(this)
        // 8. 调用 beforeCreate 钩子函数
        callHook(this, 'beforeCreate')
        // 9. 初始化状态
        initState(this)
        // 10. 调用 created 钩子函数
        callHook(this, 'created')
        // 11. 调用 $mount 方法
        if (this.$options.el) {
            this.$mount(this.$options.el)
        }
    }
    // 7. 返回子类
    return Sub
}
``` 


### use
```js  
// Vue.use(VueRouter) // 通过use方法 安装插件
Vue.prototype.use = function(plugin) {
    // 1. 拿到参数
    const args = toArray(arguments, 1)
    // 2. 把this(Vue)添加到参数数组的第一项
    args.unshift(this)
    // 3. 调用插件的install方法
    plugin.install.apply(plugin, args)
}
 
Vue这个对象可支持 外部的插件 比如 map高德地图 等  插件像是对外开放的接口

vue-router 是一个插件  用来实现路由功能的
store 是一个插件  用来实现状态管理的


Vue.use() 用来安装插件的  会调用插件的install方法
```

```js 
// 属性 方法
Vue.extend
Vue.nextTick
Vue.set
Vue.delete
Vue.directive
Vue.filter
Vue.component
Vue.use
Vue.mixin
Vue.compile
Vue.observable
Vue.version
Vue.config



```


## 模板指令
```js
// 指令 就是 html的标签属性
// 元素html5属性   <div id="app" class="hello" ></div>
// vue指令        <div v-xxx="xxx"></div>、
// element指令    v-loading 全局指令 <el-button type="primary" @click="open">打开 Dialog</el-button>
// 自定义指令     v-focus、
// 动态指令    :[xxx]="xxx" @:[xxx]="xxx" 等等
```

### 插值语法 `{{ }}`
```vue 
<template>
  <div>{{ msg }} {{ '可以是js表达式 不能是语句' }} </div>
</template> 
<script>
常见表达式：用于 计算的一个式子 可以产生一个值的式子
{{ '123' }} 
{{ 1 + 3 }} 
{{ () => '123' }} 
{{ func() }} 
{{ function () { return '123' } }}
{{ true ? '123' : '456' }}
常见语句： 语句内部通常包含一个或多个表达式
{{ '赋值语句 ' var a = 1 }}  
{{ 'if语句 ' if (ok) { return message } }}
{{ 'for语句 ' for (var i = 0; i < 10; i++) { console.log(i)}}}   
</script> 
```
### v-bind: | : 
> 单向数据绑定 从数据到视图
```js

// 传参 参数名是id 参数值是 string类型的hello
<div id="hello"></div>
// 传参 参数名是id 参数值是this上的id变量 this.id
<div v-bind:id="id"></div>
<div :id="id"></div> 
// 传递的参数名 是一个变量
<div :[id]="id"></div> 

 

   
 我突然发现一个问题    v-bind也可以传入函数，那么v-on有锤子用  emit 也没用    ？？？？

  暂时理解 v-bind传入函数 先不用管  用的时候再说
 
 
> 注意：v-bind 和 v-model 的底层原理是 MVVM
~~~vue
<template> 
    <!-- 完整语法 -->
    <a v-bind:href="url">...</a>

    <!-- 缩写 -->
    <a :href="url">...</a>

    <!-- 动态参数的缩写 (2.6.0+) -->
    <a :[key]="url"> ... </a>
</template>
~~~


> 给组件实例对象 传递属性 传递参数 组件内部用props接收 props相当于函数的形参 形参也可以是函数哟
 

## v-bind的修饰符   

  <my-div :haha.prop="xxx" />
  // .prop - 作为一个 DOM property 绑定而不是作为 attribute 绑定。(差别在哪里？)
  
  <my-div :haha.camel="xxx" />
  // .camel - (2.1.0+) 将 kebab-case attribute 名转换为 camelCase。(从 2.1.0 开始支持)


        <my-div :haha.sync="xxx" /> 
 
        .sync (2.3.0+) 语法糖，会扩展成一个更新父组件绑定值的 v-on 侦听器。

        也就是说  :haha.sync="xxx"  >>> 相当于 >>>   :haha="xxx" @update:haha="xxx = $event"

        组件内部 同样是 props接收v-bind this.$emit('update:xxx') 触发事件 和v-model类似

        
        v-bind="object"    >>> 相当于 >>>  v-bind:属性名="对象.属性名"  
    
        给v-bind传一个对象 对象的所有键值对都会被解析成这样 

        v-bind.sync="object"  给v-bind传一个对象  并且给这个对象的每一个属性都加上.sync修饰符 

        注意 传递对象 这个对象不支持字面量 v-bind="{a:1,b:2}"  这样写是不行的

 

```


### v-on: | @
```js
// 传参 参数名是event 参数值是this上的事件函数
<div v-on:event="event1"></div>
<div @event="event1"></div> 
// 传递的参数名 是一个变量
<div @[event]="id"></div> 

// 方法名不用() 这函数默认收到一个事件对象
// 方法名后面加() 事件函数就不会收到事件对象 且收到的值由小括号决定 不传参不要用() 传参就要用()
<div @click="test"></div>
<div @click="test($event, 'xx')"></div>

// 原生js
const btn = document.getElementById('btn')
btn.onclick = function (e) {
    console.log('默认收到一个事件对象',e)
}
btn.addEventListener('click', function (e) {
    console.log('默认收到一个事件对象',e)
})


        <button @click="test">test</button> 
        <button @click.native="test"></button>
        <button @click.native="test()"></button>

          
<!-- 
    v-on="{}"   v-on支持传递对象(不能是字面量对象) 就是批量绑定事件
  -->
<my-div v-on="obj" />
相当于
<my-div @key="obj.key" @key="obj.key" /> 


  <!--  这里的函数名后加上()  子组件内部回传给父组件的值 都将丢失  由这个小括号()重新定义函数接收到什么值  -->
  <div @click="函数名($event)"></div>   <!--  this.$event 就是事件对象 可以从这里传递下去  -->


> 事件修饰符 
@click.native="" // 原生click事件
// 事件修饰符
@click.stop 阻止冒泡
@click.prevent 阻止默认行为
@click.self 只有自己才触发
@click.once 只触发一次
@click.capture 捕获阶段触发

@click.passive 事件处理函数不会调用 
event.preventDefault()。如果滚动事件的处理函数里面有 event.preventDefault()，则会出现滚动不流畅的情况。

// 事件修饰符 可以连写 有没有顺序去看官方文档
@click.stop.prevent="函数名"  // 阻止冒泡和默认事件 

> 按键修饰符
> 注意 只有当 聚焦到 绑定事件的dom上时 按键才会触发 
// 按键修饰符
// 按下回车键触发
@keyup.enter="函数名"
// # 按下空格键触发
@keyup.space="函数名"
// # 按下上下左右键触发
@keyup.up="函数名"
@keyup.down="函数名"
@keyup.left="函数名"
@keyup.right="函数名"
// # 按下删除键触发
@keyup.delete="函数名"
// # 按下esc键触发
@keyup.esc="函数名"
// # 按下tab键触发
@keyup.tab="函数名"
// # 按下ctrl键触发
@keyup.ctrl="函数名"
// # 按下alt键触发
@keyup.alt="函数名"
// # 按下shift键触发
@keyup.shift="函数名"
// # 按下meta键触发
@keyup.meta="函数名"



.stop - 调用 event.stopPropagation()。
.prevent - 调用 event.preventDefault()。
.capture - 添加事件侦听器时使用 capture 模式。
.self - 只当事件是从侦听器绑定的元素本身触发时才触发回调。
.{keyCode | keyAlias} - 只当事件是从特定键触发时才触发回调。
.native - 监听组件根元素的原生事件。
.once - 只触发一次回调。
.left - (2.2.0) 只当点击鼠标左键时触发。
.right - (2.2.0) 只当点击鼠标右键时触发。
.middle - (2.2.0) 只当点击鼠标中键时触发。
.passive - (2.3.0) 以 { passive: true } 模式添加侦听器
 


> 通过event事件对象的api实现某些功能 
function clickHandler(e) {
  // 手动阻止默认行为
  e.preventDefault()
  // 手动阻止冒泡
  e.stopPropagation()
  // 自己判断按键
  if (event.keyCode !== 13) return 
  // 输出按键编码值
  console.log(e.keyCode)
  // 输出按键名称
  console.log(e.key)
  // 输出是否按住了ctrl键
  console.log(e.ctrlKey)
  // 输出是否按住了shift键
  console.log(e.shiftKey)
  // 输出是否按住了alt键
  console.log(e.altKey)
  // 输出是否按住了meta键
  console.log(e.metaKey)

  if (e.key === 'Enter') {
    console.log('enter')
  }
} 
 


 
export default {
  mounted() {
    window.addEventListener('keydown', this.handleEvent)
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.handleEvent) // 在页面销毁的时候记得解除
  },
  methods: {
    // 撤回
    revocation(e) {
      console.log('撤回')
    },
    handleEvent(e) {
      // window 的 撤回  ctrl + z 反撤回 ctrl + y
      if (navigator.userAgent.includes('Window') && e.ctrlKey && e.key == 'z' ) {
        this.revocation()
      }
      // mac 的 撤回 command + z  反撤回 command + shift + z
      if (navigator.userAgent.includes('Mac') && e.metaKey && e.key == 'z') {
        this.revocation()
      }
    }
  }
} 


> 组件实例对象的api是绑定事件的功能 对应指令 v-on:事件名="" 
// 拿到组件实例 调用$on()函数 绑定事件
this.$on('自定事件名', (e) => {
  console.log(e)
}) 

this.$off()  // 解绑 组件实例对象上的 所有事件
this.$off('事件名')  // 解绑 组件实例对象上的 某个事件
this.$off(['事件名1', '事件名2'])  // 解绑 组件实例对象上的 多个事件

// 一般只有 事件总线 需要$off()函数解绑 其他情况 组件销毁了 事件自动没有了 
``` 

### v-model 
> 双向数据绑定 从视图到数据 v-bind 从数据到视图 v-on    v-bind + v-on = v-model
> v2只能传一个v-model 多个用 v-bind + .sync
```js
<el-input :value="value" @input="value = $event" /> 

如果input事件仅仅只是修改value值 那么可以简写为
<el-input v-model="value" />
如果input事件除了修改value值 还有其他操作 那么就不能简写了
只能写全 并且在事件函数内部手动修改value值 然后做其他操作
 

<my-test :a.sync="value1" :b.sync="value2" /> 
  
  文本输入框 -- value
  单选框 -- checked  传v-model的变量  因为单选框没有value属性 只有checked 所以需要手动传value值   
  多选框 -- checked  传v-model的变量  因为多选框没有value属性 只有checked 所以需要手动传value值   因为是多选框 所以初始值给[]
  下拉框 -- value 
  文本域 -- value
  自定义组件 -- value 

export default { 
  // model的value和input 这是默认的 不写也是这样
  // 当一个组件的model配置项是这样 我们传递的v-model才相当于 
  // 传递了 :value="" @input="" 
  // 如果我们修改为 model: { prop: 'checked', event: 'change' }
  // 那么传递的v-model 就相当于 传递了 :checked="" @change=""
  model: { prop: 'value', event: 'input' }, 

  
}
  v-model的修饰符
// > v-model.lazy=""  把input事件改成change事件 
// > v-model.number=""    把用户输入的值转为 数值类型 
// > v-model.trim=""  把用户输入的值去掉前后空格

 vue3的v-model 
<my-test v-model="value" /> 
相当于
<my-test :modelValue="value" @update:modelValue="value = $event" />

<my-test v-model:abc="value" /> 
相当于
<my-test :abc="value" @update:abc="value = $event" />


 vue3相当于 内部少了 model 这个配置项   v3的 v-model 类似于 v2的 .sync 

```
### v-for 循环dom结构
```js 
v-for='(item,index) in arr' :key='id'

可遍历数组/对象/字符串/数字
:key 属性一般都取唯一标识的id 用来vue后台进行虚拟dom的diff算法
当数据发生变化时 新旧虚拟DOM进行对比

v-for  只要不报错 给不给key无所谓 
v-for=" (item, index) in arr " :key="item.id" 
// 下标 0 开始的 是数字  key 是字符串
v-for=" (val, key, index) in obj " :key="index" 
v-for="item in 10" :key="item"
```

### v-if  v-else-if v-else   v-show
```javascript
v-show='布尔值或表达式最终得到布尔'    条件渲染(动态控制display是否隐藏)
v-if='布尔值或表达式最终得到布尔'     条件渲染(动态控制节点是否存在) 可用< template >包裹  使用
v-else      条件渲染(动态控制节点是否存在)
v-else-if

// v-if 和 v-show 的应用场景
v-if 与 v-show 都能控制dom元素在页面的显示
v-if 相比 v-show 开销更大的（直接操作dom节点增加与删除）

用户操作导致经常切换 用 v-show   因为用户可能会频繁操作   (template 标签不能用v-show)
初始化渲染DOM时候 用 v-if/v-else 因为不需要频繁切换

v-show 底层是display:none 是直接从dom树中移除 所以默认 不能带动画 但可以用 vue提供的transition标签 实现动画

当v-if 和 v-show 都不能带动画时 可以用height 或 width 
根据top定位 就是从上往下滑动
根据bottom定位 就是从下往上滑动

``` 

### v-slot 
```vue
v-slot 用于接收函数形参

v-slot:xxx="params"
v-slot:插槽名="函数形参"
            v-slot  // 用来插槽 接收形参  一般用在模板

```
### v-html v-text
```vue
            v-html="msg"  // 用来替换标签中的内容  会将标签中的内容当做html代码解析 
            v-text="msg"  // 用来替换标签中的内容 
            
v-text=''     v-text的取值 会替换掉标签体中所有内容 (不会解析标签 当文本字符串使用) {{}}
v-html=''     v-html的取值 会替换掉标签体中所有内容  (会解析标签) {{}} 不要在用户提交的内容上使用v-html

v-html 可以解析结构  解析的结构是 后端服务器提供的 因为我们信任后端服务器 不能是用户提供 我们不信任用户 可能导致攻击 

```
 
### v-clock v-once v-pre （不重要）
```js
v-cloak指令没有值，Vue实例创建完毕并接管容器后 会删除v-cloak属性
使用css属性选择器 [v-cloak]{display:none} 解决网速慢时 页面展示{{xxx}}的问题

v-once指令:没有值
1.v-once所在节点在初次动态渲染后，就视为静态内容了。
2.以后数据的改变不会引起v-once所在结构的更新，可以用于优化性能。
 v-once  // 用来保证标签中的内容只渲染一次  一般用在模板中


v-pre指令:没有值
1.加了v-pre的标签 vue不会解析
2.可利用它跳过:那些没有使用指令语法、没有使用插值语法的节点，会加快编译。
v-pre  // 用来跳过当前标签的编译过程  一般用在模板中
```
### v-loading
```js
element-ui的内置指令
```

### key
### ref 
> 当你不得不获取dom时 用ref  原生js用给标签打id 或 class 来获取dom   但vue里面一般给标签打一个ref属性 来获取DOM
```vue
给标签 打一个ref='xx'标识  类似原生id class   用 this.$refs.xx获取
<template>
  <div>
    <!--
          一般给普通标签打ref 来获取DOM
    -->
    <div ref="adc">
      <span ref="aa">123</span>
    </div>
    <!--
          一般给子组件打ref 拿到子组件实例  常用于 父组件调用子组件方法
    -->
    <my-list ref="list" />
  </div>
</template>

<script>
import MyList from './MyList.vue'
export default {
  components: {
    MyList
  },
  mounted() {
    console.log(this.$refs) 
    console.log(this.$refs.list.list)   // [1, 2, 3, 4]
  }
}
</script>
```



### is
### slot
### slot-scope
### scope


### class
```vue 
<template>
  <div>
    <div 
      :class="{
        active: isActive == xxx ? 'true' : 'false',
        time: true,
      }"
    >
      {{ 123 }}
    </div>
    <div 
         :class="{
        'arrow-btn': true,
        [leftRight] ? 'move-left' : 'move-right'
      }" 
    >
      {{ 123 }}
    </div>
    

        <!-- class的字符串写法 适用于: 样式类名不确定 经常改 要动态获取 -->
        <h2 class='atguigu' :class='myStyle'>{{title}}</h2>

        
        字符串写法      样式类名确定 布尔值决定用不用  :class='{classB:hasB,classC:hasC}'
        三目表达式写法  样式类名确定 
        对象写法   样式类名不确定   :class='类名' 
        数组写法
        绑定style 对象写法

        <!-- class的对象写法 适用于: 类名确定 但不确定用不用   对象里面的key都是字符串 classB是字符串 完整写就是 'classB' 字符串不需要解析-->
        <h2 class='atguigu' :class='{classB:hasB,classC:hasC}'>{{title}}</h2>

        <!-- class的三元表达式写法 适用于: 类名确定 但不确定用不用-->
        <h2 class='atguigu' :class=" hasB? 'classB' : '' ">{{title}}</h2>

        <!-- class的数组写法 适用于: 同时应用于多个class-->
        <h2 class='atguigu' :class="[a,b,c]">{{title}}</h2>

        <!-- 绑定style -->
        <h2 class='atguigu' :class="[a,b,c]" :style="{fontSize:size+'px'}">{{title}}</h2>


 

  </div>
</template>

<script>
  export default {
    name: 'App',
    data() {
      return {
        title: '过年拿红包',
        myStyle: 'classA',
        hasB: true,   // 是否使用样式
        hasC: true,    // 是否使用样式
        a: 'classA',
        b: 'classB',
        c: 'classC',
        size: '40'
      }
    }
  }
</script>

<style scoped>
    .atguigu {
        border: 1px solid black;

    }

    .classA {
        background-color: skyblue;
    }

    .classB {
        color: red;

    }

    .classC {
        text-shadow: 2px 2px 3px yellow;
    }
</style>


### style

### tabindex

### 支持所有的原生标签属性
```js
// 例如
```

### 封装指令
> 全局
```js 
  自定义指令
> 应用场景: 有些情况你需要对DOM进行底层操作 这时就会用到自定义指令
> 对于一个原生标签 你期待传一个属性(指令) 去对这标签的DOM进行底层操作 这时就会用到自定义指令

// 注册一个全局自定义指令 `v-input-focus`  自动获取焦点
Vue.directive('input-focus', {
  inserted(el) {
    el.focus()
  }
})

//自定义一个全局指令 Vue.directive()方法 (本页所有的vue实例管理的root 都可以用)
Vue.directive('input-focus', function (element, binding,c,d) {
  // upper-text 是自定义的指令名字
  // element元素
  // binding 是个对象里面是相关数据
  // 有四个参数 可以打印出来看看
  // 指令就是对dom元素的操作
  element.innerText += binding.value.toUpperCase()
})

//自定义一个局部指令 在 Vue传入的配置项里面  传入 directives: {} 配置项
directives: {
  // lower:function(element,binding){
  //     element.innerText = binding.value.toLowerCase()
  // },
  'lower-text'(element, binding) {
  element.innerText = binding.value.toLowerCase()
  }
}
  //lower-text函数何时会被调用?
  //1.指令与元素成功绑定时(一上来）。
  //2.指令所在的模板被重新解析时


> 使用自定义指令:


v-加上自定义的指令名字   v-是vue默认加上的    v-upper-text    v-lower-text
  
```
> 局部
```vue
```








### vue中拿DOM
```js 
// 1 首先通过 e.target 拿到当前被点击的dom
// 2 通过 打ref 拿到dom
// 3 document.querySelector('.item:last-child') 通过原生选择器拿到dom 
// 4 通过 this 拿到当前组件的实例 
```





## 组件  
> 组件 也就是原生的 html标签
```js
// 原生标签: <div> <span> <input> <button> 等等
// vue提供的组件: <transition> <keep-alive> <router-link> 等等
// element组件: <el-button> <el-input> <el-table> 等等
// 自定义组件: <my-component> <my-button> <my-input> 等等
// 自己封装组件一般都是2个单词 避免和原生标签冲突 
```

### Vue官方提供组件 
```vue
<template></template>
<script></script>
<style></style>
<component></component>
<transition></transition>
<transition-group></transition-group>
<keep-alive></keep-alive>
<slot></slot>
 

```
### element 组件
```vue
```
### 组件间通信
> 父子间通信
```js
  // 通过v-bind:给子组件传递参数
  <my-div :age="18"></my-div> 
 // 子组件内部 用 props配置项 接收 模版中和watch可以拿到每次更新的值 

  // 通过v-on给子组件传递 事件函数 参数名是 onclick
  <my-div @onclick="func"></my-div>
 // 子组件实例对象 vm.$on('onclick', this.func)  一般不通过dom实例对象绑定 而是直接在模版中 @click=""
 // 子组件中 用this.$emit('事件参数名', '实参1')


  // 通过 插槽 给子组件传 一段dom结构 传递插槽 本质就是传递一个回调函数
  <my-div>
    <template v-slot:default="scope">我是dom结构,我收到的参数{{scope}}</template>
    <template v-slot:hello="scope">我是dom结构,我收到的参数{{scope}}</template>
  </my-div>
  // 子组件用 <slot name="default" :params="p"></slot> 接收

  // 通过ref拿到子组件实例对象 可以实现父组件调用子组件的方法

```

### 使用组件 
```js
// 修改组件样式
// 1. 首先看组件有没有提供 属性或方法 修改样式
// 2. 可以直接追加一个 class 类名
// 3. 可以直接找到他的类名 通过v-deep穿透  :deep() 不能嵌套 :deep()
// 4. 如果是公共样式 直接找他的公共样式文件 找 或 element-ui-reset.css重置样式
// 5. 页面多个地方 用到重复样式  添加在公共样式里面
 

// 动态class 动态style


```
- 非单文件组件
  了解

- 单文件组件
  一个.vue文件就是一个单文件组件 一个.vue文件里面包含3部分 template script style

### 官方的组件(内置组件)
```vue
<template> 
<div>
  <router-view />
  <keep-alive />
  <component :is="currentView" /> 
  <transition />
  <transition-group />
  <slot />
  <transition name="fade" mode="out-in" /> 
  <template />  
  <keep-alive />  
</div> 
</template> 
<!-- 
暂时理解 
vue中的div span input 都是vue的内置组件 他们不是原生dom 而是vue的虚拟dom

在vue的template中 写的 div span 最终都会转为原生的真实dom

 -->

``` 
```vue
<template>
    <div>
        <h1>{{msg}}</h1>
        <button @click="test">test</button>
    </div>
</template>
```
 


>  :deep(.xxx) {}
> ::v-deep(已废弃)  :deep 不能嵌套 :deep
```vue
  <style lang="less" scoped>
    @import url('@/assets/styles/common.less');
    ::v-deep .van-icon-arrow-left {
      color: #999;
    }

    .push ::v-deep .el-table th.el-table__cell > .cell {
      font-weight: bold;
    }

  :deep(.xxxxx) {
    color: #999;
  }

  // deep 只能向下 不能向上 
  // 所以使用deep 首先确定该盒子放在哪里 有可能是body的亲儿子 直接 放在body下面的
  // 此时就可以在 公共样式中 body .deep(.xxxxx) { color: #999; }

  // 从上向下 改下层或里层样式  用 ::v-deep
  // 从下向上 改上层或外层样式  用 覆盖 的方式



  //  <div class="dialog">
  //     <el-dialog :before-close="() => (dialogVisible = false)" :title="title" :visible.sync="dialogVisible" width="30%">
  //       <span>驱蚊器问问去</span>
  //       <span slot="footer" class="dialog-footer">
  //         <el-button type="primary" @click="dialogVisible = false">保 存</el-button>
  //         <el-button @click="dialogVisible = false">取 消</el-button>
  //       </span>
  //     </el-dialog>
  //   </div>

  // 由于 弹窗是放在 body下面的 修改dialog的样式 可以这样 
  // .dialog ::v-deep .el-dialog__footer,
  // .dialog ::v-deep .el-message-box__footer {
  //   border-top: 0px solid red !important;
  // }


  </style>


```





>  vue的 过渡动画 和 帧动画
```vue 
    <!-- 
      对于 v-if 和 v-show 展示的元素 
      可用 transition 组件包裹 
      实现 过渡动画或帧动画 
    -->

    <!-- 

      (1) 把 v-if或v-show 的目标元素
          包裹 <transition name="取名xxx"></transition>标签 
      (2) 固定格式选择器 xxx为tarnsition组件的name的取名

        进入(显示): enter
          进入起始点  .xxx-enter {}  可用transfrom
          进入过程中  .xxx-enter-active {}  可用transfrom和animation
          进入结束点  .xxx-enter-to {}  可用transfrom
        离开(隐藏): leave
          离开起始点  .xxx-leave {}  可用transfrom
          离开过程中  .xxx-leave-active {}  可用transfrom和animation
          离开结束点  .xxx-leave-to {}  可用transfrom


        @keyframes ani {
          0% {
            transform: scale(0);
          }
          100% {
            transform: scale(1);
          }
        }

    -->
```
>  过渡动画 transition使用例子
```vue
<template>
  <div>
    <button @click="isShow = !isShow">切换</button>
    <transition name="abc">
      <img v-show="isShow" class='picture' src="https://s3.ax1x.com/2020/12/13/reCaqg.jpg" alt="">
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShow: true
    }
  }
}
</script>

<style>
.picture {
  width: 100px;
}
.abc-leave {
  opacity: 1;
  transform: scale(1) rotate(0deg);
}

.abc-leave-active {
  transition: 1s all linear;
}

.abc-leave-to {
  opacity: 0;
  transform: scale(0.2) rotate(180deg);
}


.abc-enter {
  opacity: 0;
  transform: scale(0.2) rotate(180deg);
}

.abc-enter-active {
  transition: 1s all linear;
}

.abc-enter-to {
  opacity: 1;
  transform: scale(1) rotate(0deg);
}
</style>
```
>  帧动画 transition使用例子
```vue

<template>
  <div>
    <button @click="isShow = !isShow">切换</button>
    <transition name="abc">
      <img v-show="isShow" class='picture' src="https://s3.ax1x.com/2020/12/13/reCaqg.jpg" alt="">
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShow: true
    }
  }
}
</script>

<style>
  .picture {
    width: 100px;
  }

  .abc-enter-active {
    animation: ani 1s;
  }

  .abc-leave-active {
    animation: ani 1s reverse;
  }

  @keyframes ani {
    0% {
      transform: scale(0);
    }

    50% {
      transform: scale(1.3);
    }

    100% {
      transform: scale(1);
    }
  }
</style>
```




> 过渡原生实现
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<style>
    .picture {
      width: 100px;
      transition: 1s all linear;
    }

    .come {
      opacity: 1;
      transform: scale(1) rotate(0deg);
    }

    .leave {
      opacity: 0;
      transform: scale(0.2) rotate(180deg);
    }
</style>


<body> 
    <button id="btn">切换</button><br>
    <img class="picture" src="https://s3.ax1x.com/2020/12/13/reCaqg.jpg" alt="">
</body>
<script>
    const btn = document.getElementById('btn');
    const img = document.querySelector('.picture')
    let isShow = true;
    btn.onclick = () => {
        if (isShow) {
            img.className = 'picture leave'

        } else {
            img.className = 'picture come'
        }
        isShow = !isShow;
    }
</script>
</html>

```

### 内置组件
```vue
component
transition
transition-group
keep-alive
slot

```
### 自己封装 组件实例对象
```vue
封装组件

可以参考饿了么团队是怎么封装组件的 或者其他一些知名团队的组件封装方式

npm账号 aquila19 
Wy364109@@


```

## 动态组件
> component 组件  动态组件本质就是把组件当成一个变量去使用
```vue
<!-- 

应用场景有很多 比如同一个dom位置 需要根据条件展示不同的组件
比如弹窗内容 弹窗是同一个 但是内容不同 内容就用动态组件 

动态组件： 运用场景 当多个组件需要切换展示在同一组件中时 用 `<compoent :is="组件名"></compoent>` 传is为组件名 组件名是变量 可以动态
如下所示 Patients Students ReadTeacher 等组件 需要展示在 conponent组件   
类似于 router-view 多个子组件需要根据条件展示在 父组件的router-view的地方


动态组件 把组件当成一个变量去使用
动态路由 把路由 路径 当成一个变量去使用
动态属性 把属性名 :[xx]="xx" 当成一个变量去使用




-->
 
<template>
    <div>
    <!--        传is  是   Patients 或者 Patients 或 Teacher       -->
        <component :is="roletype2component[this.$route.query.roletype]" />
    </div>
</template>

<script>
    // 如果this.$route.query.roletype === '标准化病人'   
    import Patients from './Patients.vue'
    import Students from './UserList/Students.vue'
    import ReadTeacher from './UserList/ReadTeacher.vue' 

    const roletype2component = {
        标准化病人: 'Patients',
        系统管理员: 'Patients',
        教员: 'Teacher', 
    }
    export default {
        components: {
            Patients,
            Students,
            ReadTeacher, 
        },
        data() {
            return {
                 
            }
        }
    }
</script>
``` 

## MVVM

> MVVM是一种软件架构模式
```js
vm做的事情 就是 把model层和view层 保持同步 

model层不可以直接和view层通信
他们之间必须 通过 viewmodel 通信

整个过程有几个重点
1 view 封装组件对象
2 model 处理数据
3 vm的api 用来操作数据

const data = {
  name: '张三',
  age: 19, 
}
Object.defineProperty(data, 'address', {
  value: '北京',
  enumerable: true, // 属性是否可以被枚举 查
  configurable: true, // 属性是否可以被删除 删
  writable: true, // 属性是否可以被修改 改

  // getter 读取这个属性时 会触发get函数
  get() {
    return '北京'
  },
  // setter 修改这个属性时 会触发set函数 val是修改的新值
  set(val) {
    console.log('set')
    console.log(val)
  }
})

数据代理 通过 对象A 代理 对象B  操作对象B的属性  就是操作对象A的属性

const vm = new Vue({
  el: '#app',
  // data里面的数据 会自动挂载到vm实例对象上 vm.name vm.age
  data: {
    name: '张三',
    age: 19, 
  }
})
// data中定义的数据为什么会挂在到vm实例对象上 ? 为了方便使用 vue用Object.defineProperty()方法 重写了data中的数据

const data = Object.keys(vm.data)
data.forEach(key => {
  Object.defineProperty(vm, key, {
    get() {
      return vm.data[key]
    },
    set(val) {
      vm.data[key] = val
    }
  })
}) 

外面定义的data 
function Vue(options) {
  // 把options.data 处理加工一下 我们只处理了 data里面的引用地址 所以data的引用地址是没变的 相当于浅拷贝
  // 为什么要处理data里面的引用地址 因为我们要监听data里面的数据的修改  加工一下 实现了数据劫持 修改了data里面的数据  页面就会更新

  // this.name = 'xx' 调用了set函数 重新解析了模版 重新生成了虚拟DOM 新旧虚拟DOM进行对比 对比发现不一致 就更新页面 对比发现一致 就不更新页面
  const data = options.data 
  // 
  this._data = data // 把处理之后的data挂在到this._data上
}

数据代理

vue做了数据代理 可以让我们直接通过this.name this.age 拿到data中的数据 
vue也可以不做数据代理 直接通过this._data.name this._data.age 拿到data中的数据 这样比较麻烦而已

this.name 的底层 是 this._data.name
this.age 的底层 是 this._data.age

数据代理使用 Object.defineProperty()方法 实现的 
访问this.name 时 触发get函数 return this._data.name
修改this.name 时 触发set函数 this._data.name = val

数据劫持 （我们修改this.name就是修改this._data.name 他们是同一个引用地址 开始说了）
为什么把 this._data.name = val  改为 this._data.name = val + '123' 时 会触发页面更新
换句话说 为什么修改this._data.name 时 会触发页面更新

const obs = new Observer(data)
this._data = obs 

function Observer(obj) {
  const keys = Object.keys(obj)
  keys.forEach(key => {
    Object.defineProperty(this, key, {
      get() {
        return obj[key]
      },
      set(v) {
        // Object.defineProperty的set就是数据劫持
        obj[key] = v
      }
    })
  })
} 

注意：对于数组数据的修改 并不是这样实现的 而是把 js的原生数组方法 且会影响原数组的方法 重写了一遍
比如 影响原数组的方法只有7个 有：push pop shift unshift splice reverse sort 这些方法实现本身功能之后 再去触发页面更新 
这就实现了 数组数据的修改 也会触发页面更新 map filter等方法不会影响原数组 所以就没有重写
当在vue中使用push方法时候 会沿着原型链找 先找到vue提供的push 所以使用的是vue提供的push方法 而不是js原生的push方法



为什么把定义在data中的数据修改了 页面会更新
定义在data中的数据 就是 实例对象 vm._data 同时也是 实例对象 vm 的属性 （定义在data中的数据 === vm._data.name === vm.name）

我们把数据修改了 确确实实把内存中的那个数据修改了 页面没更新是因为 vue没有监听到数据的修改 同理页面更新了 也是因为vue监听到了数据的修改
换句话说 vue负责监听内存中的数据的修改 一旦监听到了数据的修改 就会触发页面更新
vue始终期待把内存中的数据的最新值 和 页面上一致 如果程序员通过其他手段 让vue监听不到数据的修改 那么页面就不会更新 




维基百科： https://zh.wikipedia.org/wiki/MVVM
MVVM是Model-View-ViewModel的简写。它本质上就是MVC的改进版。

data中定义的所有数据 都会挂在到vm实例对象上


// model层 主要体现在 数据处理上
// view层 主要体现 封装组件 使用组件 
// viewModel层 主要体现在 对vue的api的使用上










// 总结需要处理的数据   
// 在api中定义好 new map() 用来存储数据
// 1男 2女 3未知 类似的数据

// 在api接口中 先处理组件需要的数据  找一下 于在api中处理数据的demo



 
                // Model 实现
                // 首先我们明确期望：
                
                // Model 是统一结构的
                
                // Model 是可以被复用或继承的
                
                // Model 当中可以预处理好所有数据逻辑，开发者可以直接使用数据而无需关注处理过程
                
                // Model 应该有清晰的成功失败判定逻辑
                
                // Model 应该提供安全的获取数据的逻辑
                
                // 我们先贴出 Model 的代码设计：
                import Axios from '../libs/Axios'
                export default class Model {
                  /**
                   * 初始化配置操作
                   */
                  constructor(options) {
                    this.resetResult()
                    this.domain = 'https://app.zhuanzhuan.com'
                    this.defaultType = 'GET'
                    this.options = {}
                    if (options) this.config(options)
                  }
                  /**
                   * 数据获取方法
                   */
                  async fetch(options) {
                    return new Promise(resolve => {
                      Axios[this.options.type](
                        this.options.url,
                        options
                      )
                      .then(res => {
                        this.resetResult()
                 
                        let result = res && res.data
                        this.result.state = this.isSuccess(result) ? 'success' : 'fail'
                        if (this.result.state == 'success') {
                          this.result.data = this.handleData(result)
                          resolve(this)
                        } else {
                          this.result.error = this.handleError(result)
                          resolve(this)
                        }
                      })
                      .catch(res => {
                        this.resetResult()
                        this.result.error = {
                          errorCode: -9999,
                          errorMsg: '网络错误'
                        }
                        resolve(this)
                      })
                    })
                  }
                  /**
                   * 配置方法
                   */
                  config(options) {
                    this.options = Object.assign(
                      { type: this.defaultType },
                      this.options,
                      options
                    )
                    if (this.options.type) this.options.type = this.options.type.toLowerCase()
                 
                    return this
                  }
                  /**
                   * 判断成功失败逻辑
                   */
                  isSuccess(result) {
                    return parseInt(result.respCode) === 0 && result.respData
                  }
                  /**
                   * 数据处理逻辑
                   */
                  handleData(result) {
                    return result.respData
                  }
                  /**
                   * 错误处理逻辑
                   */
                  handleError(result) {
                    return {
                      errorCode: result.respCode,
                      errorMsg:
                        result.errorMsg || 
                        result.errMsg || 
                        (result.respData
                          ? result.respData.errorMsg || result.respData.errMsg
                          : '')
                    }
                  }
                  /**
                   * 重置请求结果
                   */
                  resetResult() {
                    this.result = {
                      state: null,
                      data: null,
                      error: null
                    }
                  }
                }






                // ├── project
                // │   ├──src
                // │   │   └── View  //模板层
                // │   │   └── Model //数据层
                // │   │   │   └── Model.js  //基类
                // │   │   │   └── apiPath1 //接口路径
                // │   │   │   │   └── GetGoodsDetail.js  //商品详情接口 model 的定义

      
                // 接口路径是我们定义的接口分类划分依据，我司不同部门提供的接口通过 apiPath 进行划分，因此我们也以此作为分类
                // GetGoodsDetail.js 




                import Model from '../Model.js'
                class GetGoodsDetail extends Model {
                    constructor(){
                      super()
                      this.config({
                        url : '/apiPath1/getGoodsDetail',
                        type: 'get'
                      })
                    }
                    handleData(result){
                        let data = result.respData
                        //从接口中提取头图
                        data.headPic = data.pics.split('|')[0]
                        //将价格由分转换成元
                        data.nowPrice = data.nowPrice/100
                        //是否包邮
                        data.isFreePostage = data.goodsTag && data.goodsTag.freePostage
                        //将处理好的数据返回
                        return data
                    }
                    isSuccess(result){
                        return parseInt(result.respCode) === 0 
                                && result.respData 
                                //特殊逻辑：认为商品状态正常的请求才算成功
                                && result.respData.goodsState == 0
                    }
                }


                // 在 MVVM 或者 MVC 模式当中，M 都是定义为 Model 层，也就是数据层，
                //理论上应该把所有跟数据相关的操作都抽取到这一层，本文将讲述在现行 Vue、React、AngularJS 等框架下，
                //如何抽取 Model 层，包括：

                // API 请求方式的统一封装
                // 接口的复用
                // Model 实现
                // 安全提取数据
                // 统一的 Model 返回格式
                // 统一错误提示
                // 接口监控方案
                // Mock 数据管理
                // 更简单使用 Model：提供 CLI 支持
                // 接口缓存方案
                // 多接口聚合 Model
                // 聚合 Model 的可视化
                // Model 对接 GraphQL
                // Model 结合 WebSQL 实现前端数据管理 


                /**
                 * API 请求方式的统一封装：
                        在前端开发中，API 请求是获取数据的关键步骤。
                        为了方便管理和统一，我们可以创建一个专门的模块来封装常用的请求方式，
                        例如使用 axios 进行 HTTP 请求。
                 *  
                 * 
                 * 
                 * 
                 */ 
                  // 在 MVVM 或者 MVC 模式中，Model 层是负责处理数据和业务逻辑的核心部分。
                  //然而，具体的实现方式可能会根据使用的框架和开发语言的不同而有所差异。
                  //以下是在 Vue、React、AngularJS 等框架下如何抽取 Model 层的具体方案： 


// action 
// 接口的复用：在 Model 层中，应该尽量避免重复的代码，通过创建通用的函数和组件来实现接口的复用。
// 例如，可以创建一个通用的 HTTP 请求函数，该函数可以接收不同的参数并返回相应的数据。

// Model 实现：Model 是对数据和业务逻辑的抽象，
//它应该包含所有的数据操作和数据处理逻辑。在前端开发中，通常会使用数据库来存储数据，因此 Model 也应该包含与数据库交互的逻辑。

// 安全提取数据：在提取数据时，应该确保数据的完整性和安全性。例如，在提取用户数据时，应该先验证用户的身份，然后才能获取相应的数据。

// 统一的 Model 返回格式：为了方便处理和统一管理，Model 的返回格式应该统一。例如，所有的返回值都应该是一个 JSON 对象，包含状态码、状态信息和数据等字段。

// 统一错误提示：在处理错误时，应该有一个统一的错误处理机制。例如，所有的错误都应该被捕获并抛出统一的错误信息。

// 接口监控方案：为了确保系统的稳定性和可靠性，应该有一个接口监控方案来监控接口的响应时间和错误率等指标。

// Mock 数据管理：在开发过程中，Mock 数据是测试和开发的关键步骤。Model 层应该提供一种方便的方式来生成和管理 Mock 数据。

// 更简单使用 Model：提供 CLI 支持：为了方便开发者使用 Model，可以提供一个 CLI（命令行界面）工具来生成 Model 和相关代码。

// 接口缓存方案：为了提高系统的性能和响应速度，应该有一个接口缓存方案来缓存常用的数据。

// 多接口聚合 Model：有时候需要多个接口才能获取到完整的数据，这时就需要将多个接口的数据进行聚合。Model 层应该提供一种方便的方式来聚合多个接口的数据。

// 聚合 Model 的可视化：为了方便理解和使用聚合 Model，可以提供一个可视化工具来展示聚合 Model 的结构和数据流。

// Model 对接 GraphQL：GraphQL 是一种新兴的 API 查询语言，它可以提供更加灵活和强大的查询能力。Model 层应该提供一种方便的方式来对接 GraphQL。

// Model 结合 WebSQL 实现前端数据管理：WebSQL 是一种在浏览器中存储结构化数据的数据库标准，它提供了方便的数据操作接口。Model 层可以结合 WebSQL 来实现前端数据管理。

// 以上就是如何在 Vue、React、AngularJS 等框架下抽取 Model 层的具体方案。
///这些方案涵盖了 API 请求、接口复用、Model 实现、安全提取数据、统一的 Model 返回格式、统一错误提示、接口监控方案、Mock 数据管理、
//CLI 支持、接口缓存方案、多接口聚合 Model、聚合 Model 的可视化、Model 对接 GraphQL 和 Model 结合 WebSQL 等方面的内容。

```


### VueComponent 类
```js

Vue.extend()方法 用来创建组件构造函数 返回一个 VueComponent构造函数 或者说 VueComponent类
VueComponent构造函数 或者说 VueComponent类
const vc = new VueComponent({
  template: '<div>{{name}} {{age}}</div>',
  data: {
    name: '张三',
    age: 19
  }
})

console.log(vc, '所谓的组件 就是一个构造函数 或者说 是一个类 VueComponent类是 Vue类的子类')
new Vue({
  el: '#app',
  components: {
    'my-component': vc
  }
})

当在模版中使用 <my-component></my-component> 时 vue就会把 const vc = new VueComponent({})
传入的配置项 就是 组件里面默认导出的配置项 export default {}  
<my-component></my-component> // new 了第一次 得到新的一个实例对象
<my-component></my-component> // new 了第二次 得到新的一个实例对象 这就是同一个 VueComponent类 new了两次 得到两个实例对象 实现复用

Vue.extend()方法 每次调用都会返回一个新的 VueComponent类 也就是说 Vue.extend()方法 每次调用都会返回一个新的组件构造函数
Vue类只有一个
VueComponent类是 Vue类的子类 有多个

Vue类 出来的 实例对象 叫做 Vue实例对象 也叫vm 
VueComponent类 出来的 实例对象 叫做 VueComponent实例对象 也叫vc

区别是 vm有el属性 vc没有el属性 vm的data可以是对象 或 函数返回一个对象 vc的data只能是函数返回一个对象

const VueComponent = Vue.extend({
  template: '<div>{{name}} {{age}}</div>',
  data: {
    name: '张三',
    age: 19
  }
})
console.log(VueComponent.prototype.__proto__ === Vue.prototype) // true 

所有的构造函数或者说类 都有 property属性 指向他本身
所有的实例对象都有 __proto__属性 指向他的构造函数的prototype   prototype本身也是一个对象 也有__proto__属性 指向他的构造函数的prototype

Object.prototype.__proto__ === null // true
Function.prototype.__proto__ === Object.prototype // true
Function.__proto__ === Function.prototype // true
vc根据原型链可以访问vm的所有属性和方法
```

### vue-cli
```js
// npm install -g @vue/cli
// 下载了一个vue-cli的脚手架工具 就得到一个 vue命令 就类似于 下载了一个git工具 就得到一个 git命令
vue --version
vue create vue-demo
cd vue-demo
npm run serve
npm run build



```
### vue.config.js
```js
// vue.config.js导出方式是 node的模块导出方式 因为导出是给webpack使用的 而webpack是node写的
https://cli.vuejs.org/zh/config/#vue-config-js
```


### render函数
```js
import Vue from 'vue'
import App from './App.vue'

new Vue({
  el: '#app',
  // render:(h) => h(App)
  template: '<App></App>',
  components: { App },
})

缺少vue库里面的模版解析器的vue + render函数 （缺少模版解析器的vue 意味着 template配置项 没人接收处理 那就不能用template 只能用render函数处理） 
拥有模版解析器的vue + template配置项和components配置项

vue-template-compiler这个库是模版解析器 解析 template标签的

关于不同版本的Vue:
1.vue.js'vue.runtime.xxx.js的区别:
(1).vue.js是完整版的Vue，包含:核心功能+模板解析器。
(2).vue.runtime.xxx.js是运行版的Vue，只包含:核心功能;没有模板解析器。
2.因为vue.runtime.xxx.js没有模板解析器，所以不能使用template配置项，需要使用render函数接收到的createElement随数去指定具体内容。

```

## 插件
> 插件本质就是一个对象 里面有一个install方法
```js
// import plugin from './plugin' Vue.use(plugin)
// 这个对象将在new Vue(）之前 Vue.use()调用
export default {
  // vue会把Vue实例对象传入install方法
  install(Vue, options) {
    console.log('install', Vue, options)

    Vue.filter('myFilter', function (val) {
      return val.slice(0, 4)
    })

    Vue.directive('fbind', {
      bind(el, binding) {
        el.value = binding.value
      },
      inserted(el, binding) {
        el.focus()
      },
      update(el, binding) {
        el.value = binding.value
      }
    })

    Vue.mixin({
      data() {
        return {
          x: 100, // 只要这个插件被 Vue.use() 了 所有的组件都会有这个x属性
          y: 200
        }
      },
    })

    Vue.prototype.$myName = '张三'
    Vue.prototype.$myAge = 19

    // vue-router vuex都是插件

  }
}


const obj = {}
// 这个对象将在new Vue(）之前 Vue.use()调用
obj.install = function(Vue, options) {
  console.log('install', Vue, options)
}
```
```

