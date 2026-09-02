<script setup>
import { computed } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";
import { getMicroApps } from "./micro-apps";

const route = useRoute();
const microApps = getMicroApps();

const menuItems = [microApps.order, microApps.finance].filter(Boolean);

const currentApp = computed(() => {
  if(route.path.startsWith("/finance") && microApps.finance) {
    return microApps.finance;
  }
  return microApps.order;
});
</script>

<template>
  <div class="page-shell">
    <aside class="sidebar">
      <div class="menu-list">
        <RouterLink
          v-for="item in menuItems"
          :key="item.name"
          class="menu-button"
          :class="{ active: currentApp.name === item.name }"
          :to="item.defaultPath"
        >
          <strong>{{ item.label }}</strong>
        </RouterLink>
      </div>
    </aside>

    <main class="workspace">
      <RouterView />
    </main>
  </div>
</template>