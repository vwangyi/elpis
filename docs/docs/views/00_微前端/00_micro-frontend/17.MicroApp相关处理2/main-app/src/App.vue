<script setup>
import microApp from "@micro-zoe/micro-app";
import { computed, nextTick, onBeforeUnmount, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  clearMicroAppFailure,
  delayNextMicroAppFetch,
  microAppFailures,
  reportMicroAppFailure,
} from "./micro-app-fallback.js";

const route = useRoute();
const router = useRouter();
const runtimeOwner = window.runtimeOwner;

const apps = {
  order: {
    name: "order",
    label: "订单中心",
    stack: "Vue · Webpack · history",
    url: "http://localhost:5174/",
    baseroute: "/micro/order",
    defaultPath: "/micro/order/list",
  },
  finance: {
    name: "finance",
    label: "财务中心",
    stack: "React · Vite · hash · iframe",
    url: "http://localhost:5175/",
    baseroute: "/micro/finance",
    defaultPath: "/micro/finance#/settlement",
  },
};

const lastAppPaths = Object.fromEntries(
  Object.entries(apps).map(([name, config]) => [
    name,
    config.defaultPath,
  ]),
);

function getBrowserFullPath() {
  return (
    window.location.pathname +
    window.location.search +
    window.location.hash
  );
}

let eventSequence = 0;
const serviceEvents = ref([]);
const orderMessage = ref("尚未收到订单中心消息");
const hostStyleInvasion = ref(false);
const orderData = ref({
  operator: "林老师",
  warehouse: "华东仓",
  permission: "approve",
});
const globalData = ref({
  theme: "light",
  riskMode: false,
  user: "运营管理员",
});
const appUrls = ref({
  order: apps.order.url,
  finance: apps.finance.url,
});
const retryingApps = ref({});
const appElementsVisible = ref({ order: true, finance: true });
const loadingApps = ref({ order: true, finance: true });

const currentAppName = computed(() =>
  route.name === "finance" ? "finance" : "order",
);
const currentApp = computed(() => apps[currentAppName.value]);
const currentFailure = computed(
  () => microAppFailures[currentAppName.value] || null,
);
const currentAppRetrying = computed(
  () => Boolean(retryingApps.value[currentAppName.value]),
);
const currentAppLoading = computed(
  () => Boolean(loadingApps.value[currentAppName.value]),
);

function switchApp(appName) {
  const leavingAppName = currentAppName.value;

  if (appName === leavingAppName) return;
  if (!apps[appName]) return;

  // native 模式下，以浏览器真实地址为准
  lastAppPaths[leavingAppName] = getBrowserFullPath();

  loadingApps.value = { ...loadingApps.value, [appName]: true };
  recordTimeline({
    kind: "switch",
    label: `${currentApp.value.label} → ${apps[appName].label}`,
  });
  
  // 第一次进入使用 defaultPath，之后恢复最后一次地址
  router.push(
    lastAppPaths[appName] || apps[appName].defaultPath,
  );
}

function recordTimeline({ appName = "system", kind = "lifecycle", label }) {
  const now = new Date();
  serviceEvents.value = [
    ...serviceEvents.value,
    {
      id: ++eventSequence,
      sequence: eventSequence,
      time: now.toLocaleTimeString("zh-CN", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      appName,
      appLabel: apps[appName]?.label || "主应用",
      kind,
      label,
    },
  ].slice(-10);
}

function recordEvent(label, event) {
  const name = event.detail?.name || currentApp.value.name;
  if (["created", "beforemount", "beforeshow"].includes(label)) {
    loadingApps.value = { ...loadingApps.value, [name]: true };
  }
  if (label === "mounted" || label === "aftershow") {
    clearMicroAppFailure(name);
    loadingApps.value = { ...loadingApps.value, [name]: false };
    retryingApps.value = { ...retryingApps.value, [name]: false };
  }
  recordTimeline({ appName: name, label });
}

function handleAppError(event) {
  const failure = reportMicroAppFailure(event);
  loadingApps.value = {
    ...loadingApps.value,
    [failure.appName]: false,
  };
  retryingApps.value = {
    ...retryingApps.value,
    [failure.appName]: false,
  };
  recordTimeline({
    appName: failure.appName,
    kind: "error",
    label: `加载失败：${failure.message}`,
  });
}

function simulateLoadFailure() {
  const name = currentAppName.value;
  clearMicroAppFailure(name);
  loadingApps.value = { ...loadingApps.value, [name]: true };
  appUrls.value = {
    ...appUrls.value,
    [name]: "http://localhost:5999/",
  };
  recordTimeline({
    appName: name,
    kind: "error",
    label: "模拟错误：切换到不可用入口",
  });
}

async function restartApp(name, timelineLabel) {
  clearMicroAppFailure(name);
  loadingApps.value = { ...loadingApps.value, [name]: true };
  retryingApps.value = { ...retryingApps.value, [name]: true };
  recordTimeline({ appName: name, kind: "retry", label: timelineLabel });

  try {
    // 预加载失败的应用没有渲染容器，microApp.reload 无法处理。
    // 先让 Vue 移除元素，再销毁失败缓存，避免 MicroApp 直接删 DOM 后
    // Vue 的虚拟 DOM 仍误以为旧元素存在。
    appElementsVisible.value = {
      ...appElementsVisible.value,
      [name]: false,
    };
    await nextTick();
    if (microApp.getAllApps().includes(name)) {
      await microApp.unmountApp(name, { destroy: true });
    }
    appUrls.value = { ...appUrls.value, [name]: apps[name].url };
    appElementsVisible.value = {
      ...appElementsVisible.value,
      [name]: true,
    };
  } catch (error) {
    handleAppError({ detail: { name, error } });
  }
}

function retryCurrentApp() {
  return restartApp(currentAppName.value, "重新加载子应用");
}

function simulateSlowLoading() {
  const name = currentAppName.value;
  delayNextMicroAppFetch(name);
  return restartApp(name, "模拟慢加载：延迟下一次入口请求");
}

recordTimeline({ kind: "prefetch", label: "财务中心进入预加载队列" });

function sendOrderData() {
  orderData.value = {
    ...orderData.value,
    warehouse: orderData.value.warehouse === "华东仓" ? "华南仓" : "华东仓",
  };
  microApp.setData("order", orderData.value);
  recordTimeline({
    kind: "data",
    label: `向订单中心发送仓库：${orderData.value.warehouse}`,
  });
}

function receiveOrderData(event) {
  const data = event.detail?.data || {};
  orderMessage.value = data.message || JSON.stringify(data);
}

function publishGlobalData() {
  globalData.value = {
    ...globalData.value,
    theme: globalData.value.theme === "light" ? "dark" : "light",
    riskMode: !globalData.value.riskMode,
  };
  microApp.setGlobalData(globalData.value);
}

function receiveGlobalData(data) {
  globalData.value = { ...globalData.value, ...data };
}

microApp.setGlobalData(globalData.value);
microApp.addGlobalDataListener(receiveGlobalData, true);

onBeforeUnmount(() => {
  microApp.removeGlobalDataListener(receiveGlobalData);
});
</script>

<template>
  <div class="page-shell" :class="{ 'host-style-invasion': hostStyleInvasion }">
    <aside class="sidebar">
      <div class="brand-block">
        <span>MicroApp Lab</span>
        <h1>运营工作台</h1>
      </div>

      <nav class="module-nav" aria-label="业务子系统">
        <button
          v-for="item in apps"
          :key="item.name"
          type="button"
          :class="{ active: currentAppName === item.name }"
          @click="switchApp(item.name)"
        >
          <strong>{{ item.label }}</strong>
          <span>{{ item.stack }}</span>
        </button>
      </nav>

      <section class="control-panel">
        <span class="panel-label">演示控制</span>
        <button type="button" @click="sendOrderData">切换订单仓库</button>
        <button type="button" @click="publishGlobalData">切换全局主题与风控</button>
        <button type="button" @click="simulateSlowLoading">模拟当前应用慢加载</button>
        <button type="button" @click="simulateLoadFailure">模拟当前应用加载失败</button>
        <label>
          <input v-model="hostStyleInvasion" type="checkbox" />
          主应用样式穿透子应用
        </label>
      </section>

      <section class="status-panel">
        <div class="timeline-heading">
          <div>
            <span class="panel-label">运行时间线</span>
            <small>按触发顺序 · 最新在下</small>
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
            <template v-if="event.kind === 'switch'">
              <strong class="timeline-switch-label">切换</strong>
              <span>{{ event.label }}</span>
            </template>
            <template v-else>
              <strong>{{ event.appLabel }}</strong>
              <code>{{ event.label }}</code>
            </template>
          </li>
        </ul>
      </section>
    </aside>

    <main class="workspace">
      <header class="workspace-header shared-scope-card">
        <div>
          <span class="panel-label">当前子系统</span>
          <h2>{{ currentApp.label }}</h2>
          <p>{{ currentApp.stack }}</p>
        </div>
        <dl class="observation-grid">
          <div><dt>主应用 window</dt><dd>{{ runtimeOwner }}</dd></div>
          <div><dt>全局主题</dt><dd>{{ globalData.theme }}</dd></div>
          <div><dt>风控模式</dt><dd>{{ globalData.riskMode ? "开启" : "关闭" }}</dd></div>
          <div><dt>订单回传</dt><dd>{{ orderMessage }}</dd></div>
        </dl>
      </header>

      <section class="micro-stage">
        <section v-if="currentFailure" class="micro-fallback" role="alert">
          <span class="fallback-eyebrow">主应用工程兜底</span>
          <h3>{{ currentApp.label }}暂时无法打开</h3>
          <p>主应用仍然可用。你可以重试，或者先进入其他子系统。</p>
          <code>{{ currentFailure.message }}</code>
          <div class="fallback-actions">
            <button
              type="button"
              :disabled="currentAppRetrying"
              @click="retryCurrentApp"
            >
              {{ currentAppRetrying ? "正在重试…" : "重新加载" }}
            </button>
            <button
              type="button"
              class="fallback-secondary"
              @click="switchApp(currentAppName === 'order' ? 'finance' : 'order')"
            >
              进入其他子系统
            </button>
          </div>
        </section>

        <section
          v-else-if="currentAppLoading"
          class="micro-loading"
          role="status"
          aria-live="polite"
        >
          <span class="loading-spinner" aria-hidden="true"></span>
          <div>
            <span class="loading-eyebrow">主应用加载兜底</span>
            <h3>正在打开{{ currentApp.label }}</h3>
            <p>正在准备子应用资源和运行环境，请稍候。</p>
          </div>
        </section>

        <micro-app
          v-if="currentAppName === 'order' && appElementsVisible.order"
          name="order"
          :url="appUrls.order"
          baseroute="/micro/order"
          router-mode="native"
          keep-alive
          :data="orderData"
          @created="recordEvent('created', $event)"
          @beforemount="recordEvent('beforemount', $event)"
          @mounted="recordEvent('mounted', $event)"
          @afterhidden="recordEvent('afterhidden', $event)"
          @beforeshow="recordEvent('beforeshow', $event)"
          @aftershow="recordEvent('aftershow', $event)"
          @datachange="receiveOrderData"
          @error="handleAppError"
        ></micro-app>

        <micro-app
          v-if="currentAppName === 'finance' && appElementsVisible.finance"
          name="finance"
          :url="appUrls.finance"
          baseroute="/micro/finance"
          router-mode="native"
          iframe
          @created="recordEvent('created', $event)"
          @beforemount="recordEvent('beforemount', $event)"
          @mounted="recordEvent('mounted', $event)"
          @unmount="recordEvent('unmount', $event)"
          @error="handleAppError"
        ></micro-app>
      </section>
    </main>
  </div>
</template>
