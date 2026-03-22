<script setup>
import { ref, onMounted, onBeforeMount } from 'vue'

console.log('beforeCreate')
const msg = ref('hello world')
console.log('created')
// 组合式API
// composition-api
onBeforeMount(() => {
  console.log(document.querySelector('#abc'))
})
onMounted(() => {
  console.log(document.querySelector('#abc'))
  console.log(2)
})
console.log(1)
</script>

<template>
  {{ msg }}
  <div id="abc">1</div>
</template>
