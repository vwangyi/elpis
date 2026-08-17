<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { routes } from '@/router/index.ts';
import { computed } from 'vue';

const route = useRoute();
const router = useRouter();

const data = computed(() => {
  const list = routes.find(route => route.path === '/');
  if (list) {
    return list.children || [];
  }
  return [];
});

function handleClickMenu(menu) {
  router.push(menu.path);
}
</script>
<template>
  <div class="sider-bar">
    <div
      v-for="item in data"
      :key="item.name"
      :class="{
        'sider-item': true,
        active: item.name === route.name
      }"
      @click="handleClickMenu(item)"
    >
      {{ item.meta.title }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sider-bar {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background-color: #fff;
  border: 1px solid rgba(5, 5, 5, 0.06);
}

.sider-item {
  width: 100%;
  height: 56px;
  line-height: 56px;
  color: #000;
  padding: 0 20px;
  cursor: pointer;
}

.sider-item.active {
  color: #1677ff;
  background-color: rgba(236, 245, 255, 1);
}

.sider-item:hover {
  background-color: rgba(236, 245, 255, 0.7);
}
</style>
