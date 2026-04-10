<script setup>
import { ref } from 'vue';

const inp = ref('');
</script>

<template>
  {{ inp }}
  <input v-model="inp" type="text" />
</template>
