<script setup>
import MyInput from './输入框组件.vue';
import { ref, watch } from 'vue';

const inp = ref('');
watch(inp, () => {
  console.log(inp);
});
</script>

<template>
  <span>{{ inp }}</span>
  <my-input v-model:value="inp" />
</template>
