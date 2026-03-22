
# nextTick

nextTick就是 当我们修改数据，内存中的数据是同步修改，但页面上DOM是异步渲染的。nextTick可以确保在DOM更新之后执行，操作的是最新的DOM。

```vue
nextTick  和 生命周期的更新阶段类似 
<script setup> 
// 底层实现 支持Promise就用Promise实现 不支持就用setTimeout 等其他方式
// nextTick 就是 当我们修改数据，内存中的数据是同步修改的，
// 但 页面上DOM是异步渲染的 nextTick 可以确保在 DOM更新之后执行，操作的是最新的 DOM。
import { ref, nextTick, onMounted } from 'vue';
import xixi from './xixi.vue'; 
const data = ref(123);
const inpRef = ref(null);

onMounted(async () => {
    data.value = 456; 
    console.log('inpRef.value', inpRef.value.value); // 123
    await nextTick();
    console.log('inpRef.value', inpRef.value.value); // 456 
})


</script>

<template>
    <input ref="inpRef" type="text" v-model="data" />
    <!-- <router-view />  -->
</template>
```

```vue 
<script setup>
import { ref, nextTick } from 'vue'

// 响应式数据
const count = ref(0)
const items = ref([])
const resultWithout = ref(0)
const resultWith = ref(0)

// 不使用 nextTick 的更新方法
const updateWithoutNextTick = () => {
  count.value++
  items.value.push(`项目: ${count.value}`)
  
  // 直接尝试获取更新后的DOM元素数量
  const liElements = document.querySelectorAll('li')
  resultWithout.value = liElements.length
  console.log('不使用 nextTick 获取的数量:', liElements.length)
}

// 使用 nextTick 的更新方法
const updateWithNextTick = async () => {
    count.value++
    items.value.push(`项目: ${count.value}`) 
    // 等待DOM更新完成
    await nextTick() // nextTick底层是 Promise.resolve().then() 用异步方法都能拿到最新值 requestAnimation setTimeout 等等 但微任务更快
    const liElements = document.querySelectorAll('li')
    resultWith.value = liElements.length
    console.log('使用 setTimeout 获取的数量:', liElements.length)
  
}
</script>

<template>
  <div class="container">
    <h1>Vue 3 nextTick 示例</h1>
    
    <div class="demo-box">
      <p>当前计数: {{ count }}</p>
      <p>列表项数: {{ items.length }}</p>
      <ul>
        <li v-for="(item, index) in items" :key="index">
          {{ item }}
        </li>
      </ul>
    </div>

    <div class="controls">
      <button @click="updateWithoutNextTick">不使用 nextTick</button>
      <button @click="updateWithNextTick">使用 nextTick</button>
    </div>

    <div class="results">
      <p>不使用 nextTick 获取的列表长度: {{ resultWithout }}</p>
      <p>使用 nextTick 获取的列表长度: {{ resultWith }}</p>
    </div>
  </div>
</template>
```