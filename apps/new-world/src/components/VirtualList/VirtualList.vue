<script setup lang="ts">
import { computed } from 'vue'
defineProps({
  list: Array,
})

const l = computed(() => {
  return new Array(1000000).fill(0).map((item, index) => {
    return {
      id: index,
    }
  })
})
</script>

<template>
  <div class="container">
    <div v-for="item in l" :key="item.id" class="item"></div>
  </div>
</template>

<style scoped>
.container {
  width: 200px;
  height: 700px;
}

.item {
  width: 100%;
  height: 70px;
}
</style>
