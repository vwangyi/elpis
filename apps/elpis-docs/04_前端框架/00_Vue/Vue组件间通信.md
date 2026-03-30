

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









### vue中拿DOM
```js 
// 1 首先通过 e.target 拿到当前被点击的dom
// 2 通过 打ref 拿到dom
// 3 document.querySelector('.item:last-child') 通过原生选择器拿到dom 
// 4 通过 this 拿到当前组件的实例 
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
 


 
 

###  内置组件
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