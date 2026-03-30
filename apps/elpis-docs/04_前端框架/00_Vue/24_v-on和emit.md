+ [https://cn.vuejs.org/guide/components/events.html#component-events](https://cn.vuejs.org/guide/components/events.html#component-events)



## 父组件.vue
```vue
<script setup>
function fn(e, value) {
  
} 
</script>

<template>
  <子组件
    @some-event="fn($event, 123)"
    @some-event="fn"
    @some-event="(e) => fn(e, 123)"
    @some-event.once="fn"
  ></子组件>
</template>
```



## 子组件.vue
```vue
<script setup>
const emit = defineEmits(['inFocus', 'submit']) // JS中需要显式接收一下事件 

function buttonClick() {
  emit('submit', '参数1') // 调用 submit事件
}  
  
</script>

<template>
   <!--  模版中 直接调用 父组件传递的事件  -->
   <div @click="$emit('触发的事件名', '参数1')"></div>
</template>


<script>
export default {
  emits: ['inFocus', 'submit'], // JS中需要显式接收一下事件
  setup(props, { emit }) {
    emit('submit', '参数1') // 调用
  }
}
</script>
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