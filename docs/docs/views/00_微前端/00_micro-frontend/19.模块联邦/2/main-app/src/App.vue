<script setup>
import { computed, ref } from "vue";
import RemoteOrderOverview from "./components/RemoteOrderOverview.vue";
import RemoteSettlementOverview from "./components/RemoteSettlementOverview.vue";

const warehouse = ref("华东仓");
const operator = ref("林乔");
const refreshVersion = ref(0);
const currentView = ref("overview");
const activityMessage = ref("今日运营任务已更新");

const todayLabel = computed(() =>
  new Intl.DateTimeFormat("zh-CN", {
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(new Date()),
);

function handleOrderAction(payload) {
  activityMessage.value = `${payload.orderNo} 已交给 ${operator.value} 跟进`;
}

function handleSettlementAction(payload) {
  activityMessage.value = `财务任务“${payload.task}”已进入处理队列`;
}

function refreshRemoteModules() {
  refreshVersion.value += 1;
  activityMessage.value = "订单与财务视图已刷新";
}

const pageTitle = computed(() => {
  if (currentView.value === "order") return "订单履约概览";
  if (currentView.value === "finance") return "财务结算概览";
  return "跨应用经营概览";
});

const pageDescription = computed(() => {
  if (currentView.value === "order") return "集中查看订单审核、库存占用与履约异常。";
  if (currentView.value === "finance") return "集中查看回款确认、开票任务与结算风险。";
  return "实时观察订单履约和财务结算的关键经营指标。";
});
</script>

<template>
  <div class="page-shell">
    <aside class="sidebar">
      <div class="brand-block">
        <span>Retail Console</span>
        <h1>运营工作台</h1>
        <p>集团零售运营中心</p>
      </div>

      <nav class="module-nav" aria-label="业务视图">
        <button
          type="button"
          :class="{ active: currentView === 'overview' }"
          @click="currentView = 'overview'"
        >
          <strong>经营总览</strong>
          <span>订单与财务关键指标</span>
        </button>
        <button
          type="button"
          :class="{ active: currentView === 'order' }"
          @click="currentView = 'order'"
        >
          <strong>订单履约</strong>
          <span>审核、库存与异常任务</span>
        </button>
        <button
          type="button"
          :class="{ active: currentView === 'finance' }"
          @click="currentView = 'finance'"
        >
          <strong>财务结算</strong>
          <span>回款、开票与结算任务</span>
        </button>
      </nav>

      <section class="account-panel">
        <span class="panel-label">运行时参数</span>
        <label for="operator">当前负责人</label>
        <input id="operator" v-model="operator" />
        <label for="warehouse">履约仓库</label>
        <select id="warehouse" v-model="warehouse">
          <option>华东仓</option>
          <option>华南仓</option>
          <option>西南仓</option>
        </select>
        <button type="button" @click="refreshRemoteModules">刷新数据视图</button>
      </section>
    </aside>

    <main class="workspace">
      <header class="workspace-header">
        <div>
          <span class="eyebrow">{{ todayLabel }} · 集团运营中心</span>
          <h2>{{ pageTitle }}</h2>
          <p>{{ pageDescription }}</p>
        </div>
        <div class="runtime-badge">
          <span>业务动态</span>
          <strong>{{ activityMessage }}</strong>
        </div>
      </header>

      <section
        class="federation-grid"
        :class="{ 'single-view': currentView !== 'overview' }"
      >
        <article v-if="currentView !== 'finance'" class="federation-slot">
          <header class="slot-heading">
            <div>
              <span>订单中心</span>
              <h3>订单履约概览</h3>
            </div>
            <span class="status-tag">实时</span>
          </header>
          <RemoteOrderOverview
            :key="`order-${refreshVersion}`"
            :warehouse="warehouse"
            :operator="operator"
            @follow-order="handleOrderAction"
          />
        </article>

        <article v-if="currentView !== 'order'" class="federation-slot">
          <header class="slot-heading">
            <div>
              <span>财务中心</span>
              <h3>财务结算概览</h3>
            </div>
            <span class="status-tag">实时</span>
          </header>
          <RemoteSettlementOverview
            :key="`finance-${refreshVersion}`"
            :operator="operator"
            currency="CNY"
            @open-task="handleSettlementAction"
          />
        </article>
      </section>

    </main>
  </div>
</template>
