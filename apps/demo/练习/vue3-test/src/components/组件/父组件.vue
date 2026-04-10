<script setup>
import ChildComponent from './子组件.vue';
import MyInputNumber from './计数输入框.vue';

import { ref } from 'vue';

// function fn() {
//   console.log(999);
// }

const num = ref(1);

function onChange(newNum) {
  num.value = newNum;
}
</script>

<template>
  <!-- 123
  <child-component msg="hello world" @fn="fn" /> -->

  <my-input-number :value="num" @change="onChange" :step="2" />
</template>
