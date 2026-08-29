<script setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import WujieVue from "wujie-vue3";
import { clearAssetsCache } from "wujie";
import {
  delayNextAppFetch,
  fetchMicroResource,
  microApps,
  operatorContext,
} from "./micro-apps.js";

const { bus, destroyApp } = WujieVue;
const route = useRoute();
const router = useRouter();
const retrying = ref(false);
const appFailures = reactive({});
const activityMessage = ref("今日运营任务已更新");
const serviceEvents = ref([]);
const noticeSequence = ref(0);
const loadingApps = reactive({ order: true, finance: true });
const slowLoadingApps = reactive({ order: false, finance: false });
const appUrls = reactive({
  order: microApps.order.url,
  finance: microApps.finance.url,
});
const appKeys = reactive({ order: 0, finance: 0 });
let eventSequence = 0;

const currentAppName = computed(() =>
  route.name === "finance" ? "finance" : "order",
);
const currentApp = computed(() => microApps[currentAppName.value]);
const currentFailure = computed(() => appFailures[currentAppName.value]);
const currentAppLoading = computed(
  () =>
    loadingApps[currentAppName.value] ||
    slowLoadingApps[currentAppName.value],
);

function switchApp(appName) {
  if (appName === currentAppName.value) return;

  const search = window.location.search;
  router.push(`${microApps[appName].route}${search}`);
}

function changeWarehouse(event) {
  operatorContext.warehouse = event.target.value;
  activityMessage.value = `当前履约仓已切换为${operatorContext.warehouse}`;
  bus.$emit("host:warehouse-changed", operatorContext.warehouse);
  recordTimeline("system", "communication", "主应用 → 订单应用");
}

function publishOperationNotice() {
  const notice = {
    id: ++noticeSequence.value,
    content: `请关注${operatorContext.warehouse}今日待处理任务`,
  };
  bus.$emit("host:operation-notice", notice);
  activityMessage.value = `已向各子系统发布：${notice.content}`;
  recordTimeline("system", "communication", "主应用 → 子应用");
}

function receiveExceptionReview(result) {
  activityMessage.value = `${result.operator}已确认 ${result.count} 个高优先级异常`;
  recordTimeline("order", "communication", "子应用 → 主应用");
}

function handleLoadError(appName, url, error) {
  loadingApps[appName] = false;
  retrying.value = false;
  appFailures[appName] = {
    url,
    message: error?.message || "子系统资源加载失败",
  };
  recordTimeline(appName, "error", "loadError");
}

function clearFailure(appName) {
  delete appFailures[appName];
}

function recordTimeline(appName, kind, label) {
  const now = new Date();
  serviceEvents.value = [
    ...serviceEvents.value,
    {
      id: ++eventSequence,
      sequence: eventSequence,
      appName,
      appLabel: microApps[appName]?.label || "主应用",
      kind,
      label,
      time: now.toLocaleTimeString("zh-CN", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    },
  ].slice(-16);
}

function recordLifecycle(appName, lifecycle) {
  if (["beforeLoad", "beforeMount"].includes(lifecycle)) {
    loadingApps[appName] = true;
  }
  if (["afterMount", "activated"].includes(lifecycle)) {
    loadingApps[appName] = false;
    retrying.value = false;
    clearFailure(appName);
  }
  recordTimeline(appName, "lifecycle", lifecycle);
}

async function rebuildApp(appName, { delay = false, retry = false } = {}) {
  clearFailure(appName);
  loadingApps[appName] = true;
  retrying.value = retry;

  if (delay) delayNextAppFetch(appName);
  clearAssetsCache(new URL(microApps[appName].url).origin);
  await destroyApp(appName);
  appUrls[appName] = microApps[appName].url;
  appKeys[appName] += 1;
  await nextTick();
}

function reloadCurrentApp() {
  recordTimeline(currentAppName.value, "retry", "重新加载");
  return rebuildApp(currentAppName.value);
}

async function simulateSlowLoading() {
  const appName = currentAppName.value;
  slowLoadingApps[appName] = true;
  recordTimeline(appName, "control", "模拟慢加载");

  try {
    await Promise.all([
      rebuildApp(appName, { delay: true }),
      new Promise((resolve) => window.setTimeout(resolve, 1500)),
    ]);
  } finally {
    slowLoadingApps[appName] = false;
  }
}

async function simulateLoadFailure() {
  const appName = currentAppName.value;
  clearFailure(appName);
  loadingApps[appName] = true;
  recordTimeline(appName, "control", "模拟加载失败");
  await destroyApp(appName);
  appUrls[appName] = "http://localhost:5999/";
  appKeys[appName] += 1;
  await nextTick();
}

function retryCurrentApp() {
  recordTimeline(currentAppName.value, "retry", "失败后重试");
  return rebuildApp(currentAppName.value, { retry: true });
}

onMounted(() => {
  bus.$on("order:exception-reviewed", receiveExceptionReview);
});

onBeforeUnmount(() => {
  bus.$off("order:exception-reviewed", receiveExceptionReview);
});
</script>

<template>
  <div class="page-shell">
    <aside class="sidebar">
      <div class="brand-block">
        <span>Retail Console</span>
        <h1>运营工作台</h1>
      </div>

      <nav class="module-nav" aria-label="业务子系统">
        <button
          v-for="item in microApps"
          :key="item.name"
          type="button"
          :class="{ active: currentAppName === item.name }"
          @click="switchApp(item.name)"
        >
          <strong>{{ item.label }}</strong>
          <span>{{ item.summary }}</span>
        </button>
      </nav>

      <section class="control-panel">
        <span class="panel-label">测试控制</span>
        <button type="button" @click="publishOperationNotice">发布全局运营通知</button>
        <button type="button" @click="reloadCurrentApp">重新加载当前应用</button>
        <button type="button" @click="simulateSlowLoading">模拟当前应用慢加载</button>
        <button type="button" @click="simulateLoadFailure">模拟当前应用加载失败</button>
      </section>

      <section class="account-panel">
        <span class="panel-label">当前账号</span>
        <strong>{{ operatorContext.name }}</strong>
        <small>{{ operatorContext.role }}</small>

        <label for="warehouse">履约仓库</label>
        <select
          id="warehouse"
          :value="operatorContext.warehouse"
          @change="changeWarehouse"
        >
          <option>华东仓</option>
          <option>华南仓</option>
          <option>西南仓</option>
        </select>
      </section>

      <section class="status-panel">
        <div class="timeline-heading">
          <div>
            <span class="panel-label">生命周期</span>
            <small>按触发顺序，最新事件在下方</small>
          </div>
          <button type="button" @click="serviceEvents = []">清空</button>
        </div>
        <ul class="timeline-list">
          <li
            v-for="event in serviceEvents"
            :key="event.id"
            :class="[`timeline-${event.kind}`, `timeline-${event.appName}`]"
          >
            <span class="timeline-meta">
              <b>#{{ event.sequence }}</b>
              <time>{{ event.time }}</time>
            </span>
            <strong>{{ event.appLabel }}</strong>
            <code>{{ event.label }}</code>
          </li>
        </ul>
      </section>
    </aside>

    <main class="workspace">
      <header class="workspace-header">
        <div>
          <span class="panel-label">当前子系统</span>
          <h2>{{ currentApp.label }}</h2>
          <p>{{ currentApp.summary }}</p>
        </div>
        <div class="activity-message" role="status">
          <span>业务动态</span>
          <strong>{{ activityMessage }}</strong>
        </div>
      </header>

      <section class="micro-stage">
        <section v-if="currentFailure" class="app-fallback" role="alert">
          <span>服务暂时不可用</span>
          <h3>{{ currentApp.label }}无法打开</h3>
          <p>运营工作台仍可继续使用，你可以重新加载或先进入其他子系统。</p>
          <small>{{ currentFailure.message }}</small>
          <div>
            <button type="button" :disabled="retrying" @click="retryCurrentApp">
              {{ retrying ? "正在重新加载…" : "重新加载" }}
            </button>
            <button
              type="button"
              class="secondary-button"
              @click="switchApp(currentAppName === 'order' ? 'finance' : 'order')"
            >
              进入其他子系统
            </button>
          </div>
        </section>

        <section
          v-if="currentAppLoading && !currentFailure"
          class="app-loading"
          role="status"
          aria-live="polite"
        >
          <span class="loading-spinner" aria-hidden="true"></span>
          <div>
            <span>应用加载中</span>
            <h3>正在打开{{ currentApp.label }}</h3>
            <p>正在准备子应用资源和运行环境，请稍候。</p>
          </div>
        </section>

        <WujieVue
          v-if="currentAppName === 'order'"
          v-show="!currentFailure"
          :key="`order-${appKeys.order}`"
          width="100%"
          height="100%"
          name="order"
          :url="appUrls.order"
          :alive="microApps.order.alive"
          :sync="true"
          :props="operatorContext"
          :fetch="fetchMicroResource"
          :before-load="() => recordLifecycle('order', 'beforeLoad')"
          :before-mount="() => recordLifecycle('order', 'beforeMount')"
          :after-mount="() => recordLifecycle('order', 'afterMount')"
          :before-unmount="() => recordLifecycle('order', 'beforeUnmount')"
          :after-unmount="() => recordLifecycle('order', 'afterUnmount')"
          :load-error="(url, error) => handleLoadError('order', url, error)"
          :activated="() => recordLifecycle('order', 'activated')"
          :deactivated="() => recordLifecycle('order', 'deactivated')"
        />

        <WujieVue
          v-if="currentAppName === 'finance'"
          v-show="!currentFailure"
          :key="`finance-${appKeys.finance}`"
          width="100%"
          height="100%"
          name="finance"
          :url="appUrls.finance"
          :alive="microApps.finance.alive"
          :sync="true"
          :props="operatorContext"
          :fetch="fetchMicroResource"
          :before-load="() => recordLifecycle('finance', 'beforeLoad')"
          :before-mount="() => recordLifecycle('finance', 'beforeMount')"
          :after-mount="() => recordLifecycle('finance', 'afterMount')"
          :before-unmount="() => recordLifecycle('finance', 'beforeUnmount')"
          :after-unmount="() => recordLifecycle('finance', 'afterUnmount')"
          :load-error="(url, error) => handleLoadError('finance', url, error)"
          :activated="() => recordLifecycle('finance', 'activated')"
          :deactivated="() => recordLifecycle('finance', 'deactivated')"
        />
      </section>
    </main>
  </div>
</template>
