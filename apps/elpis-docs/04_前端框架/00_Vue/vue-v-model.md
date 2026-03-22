
# v-model

- 是否可以传 v-model 取决于 组件封装者有没有提供 v-model 功能
- 原生 input 虽然不支持 v-model 但支持 value 属性和 input 事件

```vue
<script setup>
const a = ref(0);

</script>

<template> 
  <组件 v-model:xxx="a" / >
</template>

```



```vue
<script setup>

// 组件内部

const props = defineProps({
   xxx: {
     type: Number,
     default: 0
   }
})
const emit = defineEmits([
  "update:xxx",
])
</script>
```


```js
model: { prop: 'input', event: 'change' }

defineModel({
  prop: 'input',
  event: 'change' 
})
```