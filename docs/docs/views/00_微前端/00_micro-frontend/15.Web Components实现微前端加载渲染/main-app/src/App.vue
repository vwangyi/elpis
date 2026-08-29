<script setup>
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const apps = {
  order: {
    name: "order",
    label: "订单中心",
    url: "http://localhost:5174/",
    baseurl: "/micro/order",
    defaultPath: "/micro/order/list",
    summary: "订单履约、异常派单和库存占用集中处理。",
  },
  finance: {
    name: "finance",
    label: "财务中心",
    url: "http://localhost:5175/",
    baseurl: "/micro/finance",
    defaultPath: "/micro/finance/settlement",
    summary: "收款确认、发票处理和结算风险集中处理。",
  },
};

const serviceEvents = ref(["订单中心已接入", "财务中心等待切换"]);

const currentAppName = computed(() => {
  return route.name === "finance" ? "finance" : "order";
});

const currentApp = computed(() => apps[currentAppName.value]);

function switchApp(appName) {
  router.push(apps[appName].defaultPath);
}

function recordEvent(label, event) {
  const name = event.detail?.name || currentApp.value.name;
  const text = `${apps[name]?.label || name}：${label}`;
  serviceEvents.value = [text, ...serviceEvents.value].slice(0, 4);
}
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
          v-for="item in apps"
          :key="item.name"
          type="button"
          :class="{ active: currentAppName === item.name }"
          @click="switchApp(item.name)"
        >
          <strong>{{ item.label }}</strong>
          <span>{{ item.summary }}</span>
        </button>
      </nav>

      <section class="status-panel">
        <span class="panel-label">服务动态</span>
        <ul>
          <li v-for="event in serviceEvents" :key="event">{{ event }}</li>
        </ul>
      </section>
    </aside>

    <main class="workspace">
      <header class="workspace-header">
        <div>
          <span class="panel-label">当前子系统</span>
          <h2>{{ currentApp.label }}</h2>
        </div>
        <p>{{ currentApp.summary }}</p>
      </header>

      <section class="micro-stage">
        <micro-app
          :key="currentApp.name"
          :name="currentApp.name"
          :url="currentApp.url"
          :baseurl="currentApp.baseurl"
          @created="recordEvent('开始加载', $event)"
          @beforemount="recordEvent('资源就绪', $event)"
          @mounted="recordEvent('渲染完成', $event)"
          @unmount="recordEvent('已卸载', $event)"
          @error="recordEvent('加载失败', $event)"
        ></micro-app>
      </section>
    </main>
  </div>
</template>
