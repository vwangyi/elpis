<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter, type RouteRecordRaw } from 'vue-router';
import { routes } from '@/router/index';
const route = useRoute();
const router = useRouter();
const list = ref([]);

function handleClickBtn(item: RouteRecordRaw) {
  router.push(item.path);
}
</script>

<template>
  <div class="home">
    <a-button
      class="btn"
      v-for="item in routes"
      :key="item.path"
      @click="handleClickBtn(item)"
      type="primary"
      >{{ item.meta.title }}</a-button
    >
  </div>
</template>

<style scoped>
.home {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  > * {
    margin: 4px;
  }
}
</style>
