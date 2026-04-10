<script setup>
import MyButton from './按钮组件.vue';
import { ref } from 'vue';

const loading = ref(false);

function onClick(e) {
  console.log(e);
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 1000);
}
</script>

<template>
  <my-button :loading="loading" loading-text="加载中..." @click="onClick">
    我是按钮
  </my-button>
</template>
