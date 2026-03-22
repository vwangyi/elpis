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

