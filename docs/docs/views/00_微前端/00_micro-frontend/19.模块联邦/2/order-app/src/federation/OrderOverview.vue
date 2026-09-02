<script setup>
defineProps({
  warehouse: { type: String, required: true },
  operator: { type: String, required: true },
});

const emit = defineEmits(["follow-order"]);

const orders = [
  { orderNo: "SO-250728-018", customer: "南京云杉商贸", status: "库存冲突", level: "high" },
  { orderNo: "SO-250728-024", customer: "成都星河门店", status: "跨仓确认", level: "medium" },
  { orderNo: "SO-250728-031", customer: "杭州南岸优选", status: "等待出库", level: "normal" },
];
</script>

<template>
  <section class="remote-order-overview">
    <div class="remote-order-kpis">
      <article><span>待审核订单</span><strong>128</strong><small>较昨日 -16</small></article>
      <article><span>异常派单</span><strong>12</strong><small>{{ warehouse }}占 7 单</small></article>
      <article><span>库存占用</span><strong>86%</strong><small>核心 SKU 稳定</small></article>
    </div>

    <div class="remote-order-context">
      <span>当前负责人</span>
      <strong>{{ operator }} · {{ warehouse }}</strong>
    </div>

    <ul class="remote-order-list">
      <li v-for="order in orders" :key="order.orderNo">
        <div><strong>{{ order.orderNo }}</strong><small>{{ order.customer }}</small></div>
        <span :class="`level-${order.level}`">{{ order.status }}</span>
        <button type="button" @click="emit('follow-order', order)">跟进</button>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.remote-order-overview { color: #253449; }
.remote-order-kpis { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.remote-order-kpis article { padding: 13px; border: 1px solid #dce5ed; border-radius: 10px; background: #f8fbfd; }
.remote-order-kpis span, .remote-order-kpis small { display: block; color: #718196; font-size: 10px; }
.remote-order-kpis strong { display: block; margin: 6px 0 3px; color: #173e5d; font-size: 24px; }
.remote-order-context { display: flex; justify-content: space-between; margin: 15px 0 9px; padding: 10px 12px; border-radius: 8px; color: #42627b; background: #eaf4fa; font-size: 12px; }
.remote-order-list { display: grid; gap: 9px; padding: 0; margin: 0; list-style: none; }
.remote-order-list li { display: grid; grid-template-columns: minmax(0, 1fr) auto auto; align-items: center; gap: 10px; padding: 11px 12px; border: 1px solid #e2e8ee; border-radius: 9px; }
.remote-order-list div { display: grid; gap: 3px; min-width: 0; }
.remote-order-list small { overflow: hidden; color: #738395; font-size: 10px; text-overflow: ellipsis; white-space: nowrap; }
.remote-order-list > li > span { padding: 4px 7px; border-radius: 999px; font-size: 10px; }
.level-high { color: #a72c2c; background: #fee9e9; }
.level-medium { color: #98630e; background: #fff1cf; }
.level-normal { color: #256349; background: #e0f5e9; }
.remote-order-list button { padding: 6px 9px; border: 0; border-radius: 6px; color: #fff; background: #315d85; cursor: pointer; }
</style>
