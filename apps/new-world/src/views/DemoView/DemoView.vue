<script setup>
import { RouterView } from 'vue-router';
import SideBar from './components/SideBar/SideBar.vue';
</script>

<template>
  <div class="home">
    <div class="sidebar">
      <SideBar />
    </div>
    <div class="main">
      <!-- <KeepAlive>
      </KeepAlive> -->
      <RouterView />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home {
  width: 100vw;
  height: 100vh;
  display: flex;
}

.sidebar {
  width: 239px;
  height: 100%;
}

.main {
  width: calc(100vw - 239px);
  height: 100%;
}
</style>
