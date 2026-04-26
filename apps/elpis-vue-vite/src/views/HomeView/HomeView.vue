<script setup lang="ts">
import { nextTick, ref, useTemplateRef } from 'vue';
import SubComp from './SubComp.vue';
const list = ref<number[]>([1]);
const SubCompRef = useTemplateRef('SubCompRef');
setTimeout(() => {
  list.value = [1, 2, 3];
  console.log(list.value); // [1, 2, 3]
  console.log(SubCompRef.value?.getList()); // [1]
  nextTick(() => console.log(SubCompRef.value?.getList())); // [1, 2, 3]
}, 5000);
</script>
<template>
  <div>
    <SubComp ref="SubCompRef" :list="list" />
  </div>
</template>
