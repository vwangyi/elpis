<script setup>
import { ref } from 'vue';
var arr = ref(['张三', '李四', '王五']);
function onDel(i) {
  arr.value.splice(i, 1);
}
</script>

<template>
  <ul>
    <li v-for="(item, i) of arr">
      {{ item }}
      <button @click="onDel(i)">删除</button>
    </li>
  </ul>
</template>

<style></style>
