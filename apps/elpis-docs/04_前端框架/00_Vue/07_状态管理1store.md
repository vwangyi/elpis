# store 
- 状态管理: https://cn.vuejs.org/guide/scaling-up/state-management.html#state-management
 

## 方案1 pinia / vuex
- 大型项目 通用解决方案  pinia / vuex
 

## 方案2
- 小项目 单独建一个文件 用 reactive 就行  
- 项目太小 数据太少 没必要引入pinia vuex等库

> store.js
```js  
import { reactive } from 'vue'

export const store = reactive({
  count: 0
})
```
> ComponentA.vue 
```vue
<script setup>
import { store } from './store.js'
</script>

<template>From A: {{ store.count }}</template>
```
> ComponentB.vue
```vue
<script setup>
import { store } from './store.js'
</script>

<template>From B: {{ store.count }}</template>
```











## 数据层 DO（Data Object）
- 数据层，和数据库表一一对应，无业务逻辑，纯数据载体
- ✅ 与数据库表结构完全对应
- ✅ 包含所有字段（包括逻辑删除、创建时间等）
- ✅ 只有 getter/setter，无业务逻辑
- ❌ 不暴露给前端


## 业务层 BO（Business Object）
- 业务层，封装业务逻辑，可组合多个数据层
- ✅ 聚合多个数据层DO 的数据
- ✅ 包含业务逻辑和方法
- ✅ 领域驱动设计（DDD）中的实体
- ✅ 内部使用，不直接暴露
 
## 传输层 DTO（Data Transfer Object）
- 传输层，前后端数据传输
- ✅ 用于接口参数和返回值
- ✅ 可能包含多个 数据层/业务层 BO/DO 的聚合数据
- ✅ 字段根据需要裁剪（可能比数据层DO少 比如 没有password）
- ✅ 包含数据验证注解
- ✅ 字段名更友好，可能重命名


 ## 视图层（View Object）
- 视图层，前端展示数据，与UI强相关
- ✅ 专为前端展示优化
- ✅ 包含格式化后的数据
- ✅ 可能包含UI状态字段
- ✅ 字段名符合前端约定
- ✅ 可能有嵌套结构
- vo不建议复用 每个页面都有自己的vo，即使

 


## 321
- 数据层 ⇄ 业务层 ⇄ 传输层 ⇄ 视图层
```js 
前端常做：

把 传输层数据 处理成 视图层数据 进行渲染。
把 视图层数据 处理成 传输层数据 发给后端。

这两件事都在 store中 完成 或增加BFF层统一处理

store存储的是 视图层数据的数据结构
方法则是 操作视图层数据的方法

 
 
```
