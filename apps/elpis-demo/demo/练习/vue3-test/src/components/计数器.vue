<script setup>
// vue2
// count在data中
// onAdd在methods中
import { ref } from 'vue'

const count = ref(1)

const onAdd = () => {
  count.value++
}
</script>

<template>
  {{ count }}
  <button @click="onAdd">+1</button>
</template>
