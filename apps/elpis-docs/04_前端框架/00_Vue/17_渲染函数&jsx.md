# 渲染函数 

## 虚拟dom
- https://cn.vuejs.org/guide/extras/render-function.html#creating-vnodes
- h函数用来创建虚拟DOM

- 虚拟dom 不等于 组件 


> 创建一个虚拟dom
```js
import { h } from 'vue'

// 创建虚拟dom
const vnode = h(
  'div', // type
  { id: 'foo', class: 'bar' }, // props
  [
    /* children */
  ]
)
```


## 模版写法
- 在绝大多数情况下，Vue 推荐使用模板语法来创建应用。然而在某些使用场景下，我们真的需要用到 JavaScript 完全的编程能力。这时渲染函数就派上用场了。

- vue对 template模版写法做了大量优化。没有对jsx进行优化。所以模版性能稍好。

- script setup 写法
```vue 
<script setup>
import { h } from 'vue';
// tempate写法创建 虚拟dom
const vnode = h('button', ['Hello']); // 虚拟dom不是组件的替代品。
</script>

<template>
  <!-- 通过 <component /> -->
  <component :is="vnode">Hi</component> 
  <!-- 或者直接作为元素 -->
  <vnode />
  <!-- tempate中使用虚拟dom -->
  <vnode>Hi</vnode> 
</template>
```

> setup函数写法
```vue
<script>
import { ref, h } from 'vue'

export default {
  props: {
    /* ... */
  },
  setup(props) {
    const count = ref(1) 
    // 返回渲染函数
    return () => h('div', props.msg + count.value)
  }
}
</script>
```


## jsx / tsx 写法
- https://cn.vuejs.org/guide/extras/render-function.html#jsx-tsx

```jsx
// jsx中创建虚拟dom
const vnode = <div>hello</div> 
const vnode = <div id={ dynamicId }>hello, { userName }</div>

```

## 渲染函数h()写法
- https://cn.vuejs.org/guide/extras/render-function.html#render-function-recipes

- h() / createVNode() 差不多： 一般用h函数 



## 函数式组件
- https://cn.vuejs.org/guide/extras/render-function.html#functional-components


