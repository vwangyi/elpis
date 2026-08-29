<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { RouterLink, RouterView, useRoute, useRouter } from "vue-router";
import { hostGlobalState, updatePendingCount } from "./global-state";
import {
  dismissMicroAppStatus,
  getLastVisitedPath,
  getMicroApps,
  microAppStatus,
  MICRO_APP_STATUS,
  retryMicroApp,
} from "./micro-apps";

const route = useRoute();
const router = useRouter();
const microApps = getMicroApps();
const latestOrderNotice = ref("暂无订单提醒");

// name 是 qiankun 注册名，例如 order-app；appKey 是主应用内部使用的业务键。
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

const currentAppStatus = computed(() => microAppStatus[currentAppKey.value]);

const isCurrentAppLoading = computed(
  () => currentAppStatus.value?.status === MICRO_APP_STATUS.LOADING,
);

const isCurrentAppUnavailable = computed(
  () =>
    [MICRO_APP_STATUS.ERROR, MICRO_APP_STATUS.TIMEOUT].includes(
      currentAppStatus.value?.status,
    ) && !currentAppStatus.value?.dismissed,
);

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

async function retryCurrentApp() {
  await retryMicroApp(router, currentAppKey.value);
}

async function backToWorkspace() {
  await router.push("/orders/list");
}

function closeCurrentFallback() {
  dismissMicroAppStatus(currentAppKey.value);
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

      <section class="sidebar-card system-card">
        <span class="eyebrow">系统运行</span>
        <h2>服务状态</h2>
        <p>订单：{{ microAppStatus.order.message || "运行中" }}</p>
        <p>财务：{{ microAppStatus.finance.message || "运行中" }}</p>
      </section>
    </aside>

    <main class="workspace">
      <div class="workspace-stage">
        <div v-show="currentAppKey === 'order'" id="order-viewport"></div>
        <RouterView v-show="currentAppKey !== 'order'" />

        <section v-if="isCurrentAppLoading" class="service-mask">
          <div class="service-card service-card-loading">
            <div class="service-card-copy">
              <span class="eyebrow eyebrow-main">连接中</span>
              <h2>{{ currentAppStatus.message }}</h2>
              <p>正在连接业务服务，请稍候。</p>
            </div>
            <div class="service-loader" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </section>

        <section v-if="isCurrentAppUnavailable" class="service-mask">
          <div class="service-card service-card-error">
            <button
              class="service-close-button"
              type="button"
              aria-label="关闭服务提示"
              @click="closeCurrentFallback"
            >
              ×
            </button>
            <span class="eyebrow eyebrow-main">服务不可用</span>
            <h2>{{ currentAppStatus.message }}</h2>
            <p>
              {{ currentAppStatus.detail || "当前业务服务暂时无法响应。" }}
            </p>
            <div class="service-actions">
              <button type="button" @click="retryCurrentApp">重新加载</button>
              <button type="button" class="secondary" @click="backToWorkspace">
                返回订单工作台
              </button>
            </div>
            <small v-if="currentAppStatus.lastFailedAt">
              最近失败时间：{{ currentAppStatus.lastFailedAt }}
            </small>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>
