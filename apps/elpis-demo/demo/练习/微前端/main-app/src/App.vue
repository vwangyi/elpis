<script setup>
import { ref, onMounted } from 'vue'
import { registerMicroApps, start } from 'qiankun'

const msg = ref('Hello World')

onMounted(() => {
  registerMicroApps([
    {
      name: 'react app', // app name registered
      entry: '//localhost:3000',
      container: '#container',
      activeRule: '/',
      props: {
        msg: msg.value,
      },
    },
  ])

  start()
})
</script>

<template>
  <header>主应用</header>
  <main id="container"></main>
</template>

<style>
header {
  height: 50px;
  line-height: 50px;
  text-align: center;
  background-color: #eee;
}
main {
  height: calc(100vh - 50px);
}
</style>
