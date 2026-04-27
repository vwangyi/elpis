
# nextTick


## 概念
- nextTick就是 当我们修改数据，内存中的数据是同步修改，但页面上DOM是异步渲染的。nextTick可以确保在DOM更新之后执行，操作的是最新的DOM。

- nextTick  和 生命周期的更新阶段类似 
- 底层实现 支持Promise就用Promise实现 不支持就用setTimeout 等其他方式
- nextTick 就是 当我们修改数据，内存中的数据是同步修改的，
- 但 页面上DOM是异步渲染的 nextTick 可以确保在 DOM更新之后执行，操作的是最新的 DOM。

## 举个例子
```vue 
<!-- 父组件 -->
<script setup lang="ts">
import { nextTick, ref, useTemplateRef } from 'vue';
import SubComp from './SubComp.vue';
const list = ref<number[]>([1]);
const SubCompRef = useTemplateRef('SubCompRef')
setTimeout(() => {
    list.value = [1, 2, 3];
    console.log(list.value); // [1, 2, 3]
    console.log(SubCompRef.value?.getList()) // [1]
    nextTick(() => console.log(SubCompRef.value?.getList())) // [1, 2, 3]
}, 5000)
</script>
<template>
    <div>
        <SubComp ref="SubCompRef" :list="list" />
    </div>
</template>

<!-- 子组件 -->
<script setup lang="ts">
const props = defineProps({
    list: {
        type: Array,
        default: () => []
    }
})
defineExpose({
    getList: () => props.list
})
</script>
<template>
    <div>{{ JSON.stringify(props.list) }}</div>
</template>
```



## 再举例子
```vue
<script setup> 
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
</template>
```

## 再举例子
```vue
<script setup>
async function upwardMovement(item) {
  const currentIndex = list.value.findIndex((it) => it.jsvKey === item.jsvKey);
  const currentItem = list.value.find((it) => it.jsvKey === item.jsvKey);
  const previousIndex = currentIndex - 1;
  if (previousIndex >= 0) {
    list.value.splice(previousIndex, 2, currentItem, list.value[previousIndex]);
    console.log("list.value", list.value);
    await nextTick();
    CardEditRef.value.refreshData();
    CardEditRef.value.cleanFocusStatus();
    await nextTick();
    CardEditRef.value.setFocusByUid(currentItem.uid, true, true);
    focusHub.setFocus(currentItem?.jsvKey);
  }
}

// 等价于 

function upwardMovement(item) {
  const currentIndex = list.value.findIndex((it) => it.jsvKey === item.jsvKey);
  const currentItem = list.value.find((it) => it.jsvKey === item.jsvKey);
  const previousIndex = currentIndex - 1;
  if (previousIndex >= 0) {
    list.value.splice(previousIndex, 2, currentItem, list.value[previousIndex]);
    nextTick(() => { 
        CardEditRef.value.refreshData();
        CardEditRef.value.cleanFocusStatus();
        nextTick(() => { 
            CardEditRef.value.setFocusByUid(currentItem.uid, true, true);
            focusHub.setFocus(currentItem?.jsvKey);
        })
    }); 
  }
}
</script>
```


