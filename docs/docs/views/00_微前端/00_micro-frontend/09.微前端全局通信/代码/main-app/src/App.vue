<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";
import { hostGlobalState, updatePendingCount } from "./global-state";
import { getLastVisitedPath, getMicroApps } from "./micro-apps";

const route = useRoute();
const microApps = getMicroApps();
const latestOrderNotice = ref("暂无订单提醒");

// name 是 qiankun 注册名，例如 order-app；appKey 是课程里用来记录最近路径的业务键。
const menuItems = [
  { ...microApps.order, appKey: "order" },
  { ...microApps.finance, appKey: "finance" },
].filter(Boolean);

// 主应用用当前 URL 判断哪个子系统处于前台，再决定显示哪个容器。
const currentAppKey = computed(() => {
  if (route.path.startsWith("/finance") && microApps.finance) {
    return "finance";
  }
  return "order";
});

// 菜单不再固定跳默认页，而是跳每个子系统上次停留的子路由。
function getMenuPath(appName) {
  return getLastVisitedPath(appName);
}

function resetPendingCount() {
  updatePendingCount(3, "main-app");
}

function handleOrderNotice(event) {
  const { message, orderId } = event.detail || {};
  latestOrderNotice.value = orderId ? `${message}：${orderId}` : message;
}

onMounted(() => {
  window.addEventListener("order:notice", handleOrderNotice);
});

onBeforeUnmount(() => {
  window.removeEventListener("order:notice", handleOrderNotice);
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
          :class="{ active: currentAppKey === item.appKey }"
          :to="getMenuPath(item.appKey)"
        >
          <strong>{{ item.label }}</strong>
        </RouterLink>
      </div>

      <section class="sidebar-card global-state-card">
        <span class="eyebrow">全局状态</span>
        <h2>待处理事项 {{ hostGlobalState.pendingCount }} 条</h2>
        <p>最近更新：{{ hostGlobalState.lastUpdatedBy }}</p>
        <button
          class="state-reset-button"
          type="button"
          @click="resetPendingCount"
        >
          重置为 3 条
        </button>
      </section>

      <section class="sidebar-card event-card">
        <span class="eyebrow">自定义事件</span>
        <h2>订单提醒</h2>
        <p>{{ latestOrderNotice }}</p>
      </section>
    </aside>

    <main class="workspace">
      <!-- 订单工作区用 loadMicroApp 手动保活，容器必须常驻；切走时只隐藏，不销毁 DOM。 -->
      <div v-show="currentAppKey === 'order'" id="order-viewport"></div>
      <RouterView v-show="currentAppKey !== 'order'" />
    </main>
  </div>
</template>
