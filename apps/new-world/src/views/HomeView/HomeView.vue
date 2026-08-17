<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();
function handleClick() {
  router.push('/demo');
}
</script>

<template>
  <div @click="handleClick">demo</div>
</template>
