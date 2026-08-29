<script setup>
import { computed } from "vue";
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

const currentAppName = computed(() => {
  return route.name === "finance" ? "finance" : "order";
});

const currentApp = computed(() => apps[currentAppName.value]);

function switchApp(appName) {
  router.push(apps[appName].defaultPath);
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
    </aside>

    <main class="workspace">
      <header class="workspace-header">
        <div>
          <span class="panel-label">微前端运营工作台</span>
          <h2>{{ currentApp.label }}</h2>
        </div>
        <p>{{ currentApp.summary }}</p>
      </header>

      <section class="micro-stage">
        <mini-wujie
          :key="currentApp.name"
          :name="currentApp.name"
          :url="currentApp.url"
          :baseurl="currentApp.baseurl"
          :default-path="currentApp.defaultPath"
        ></mini-wujie>
      </section>
    </main>
  </div>
</template>
