<script setup>
import { ref, onMounted } from 'vue';

const el = ref(null);
onMounted(() => {
  console.log(el.value);
});
</script>

<template>
  <div ref="el">123</div>
</template>
