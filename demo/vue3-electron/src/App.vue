<template>
  <ControlBtns />
  <!-- 使用动态名称去切换过渡的方向 -->
  <router-view v-slot="{ Component }">
    <transition :name="transitionName">
      <component :is="Component"></component>
    </transition>
  </router-view>
</template>

<script setup>
import ControlBtns from './components/ControlBtns.vue';
import { useMusicStore } from './store';
import { computed } from 'vue';
const musicStore = useMusicStore();

const transitionName = computed(() => {
  return musicStore.navigationDirection === 'forward' ? 'slide' : 'slide-back';
});
</script>

<style scoped></style>
