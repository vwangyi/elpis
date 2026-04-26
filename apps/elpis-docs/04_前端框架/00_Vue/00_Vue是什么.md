# Vue
- https://cn.vuejs.org/ 
- https://github.com/vuejs/



- 响应式数据
- 单向数据流: 父组件 传递 props数据  子组件自动更新视图
- v-bind和props ： props用 计算属性 监听 template中 可以自动响应  $attrs 
- v-on和emit  js调用 const emit = defineEmits([]);  template中调用 $emit('事件名', '传参')


- useTemplateRef 和 ref 和 defineExpose  vm.expose = {};

- nextTick

- 插槽 传 `<template #default="scopted"> 接收 <slot> 和 $slot`

- 生命周期钩子 父子钩子 执行顺序  onMounted执行 表示所有子组件的onMouted都已经执行  可以多个onMounted 按顺序执行

- 路由跳转传参

- 动态组件 component 

- provide/inject

- 写完个性化桌面功能 总结vue技术


## 是什么
- Vue是构建用户界面的渐进式框架，它的核心思想是 数据响应式和组件化。 


- 数据响应式是什么

- 组件化是什么

- 如何理解渐进式
    * 渐进式是指 随着项目逐渐复杂，Vue 可以引入 路由 状态管理等插件，实现轻量到复杂的开发体验。
 