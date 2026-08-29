<script setup>
import { computed, inject, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const isDialogOpen = ref(false);
const hostNavigation = inject("hostNavigation", null);

const navItems = [
  { to: "/orders/list", label: "订单列表" },
  { to: "/orders/detail/2048", label: "订单详情" },
  { to: "/orders/refund/1024", label: "退款处理" },
];

const dialogConfig = computed(() => {
  if (route.path === "/orders/detail/2048") {
    return {
      actionLabel: "修改订单备注",
      title: "修改订单备注",
      fields: ["订单备注", "跟进人", "同步客户通知"],
    };
  }

  if (route.path === "/orders/refund/1024") {
    return {
      actionLabel: "审核退款申请",
      title: "审核退款申请",
      fields: ["审核意见", "责任归属", "是否同步财务"],
    };
  }

  return {
    actionLabel: "新建订单",
    title: "新建订单",
    fields: ["客户姓名", "商品数量", "配送方式"],
  };
});

function openDialog() {
  isDialogOpen.value = true;
}

function closeDialog() {
  isDialogOpen.value = false;
}

function notifyHostNavigation(path) {
  // [路由处理1:] 嵌入态点击子应用内部路由时，通知主应用同步更新地址栏。
  if (hostNavigation?.isEmbedded) {
    hostNavigation.navigate?.(path);
  }
}
</script>

<template>
  <section class="module-shell">
    <header class="module-header">
      <div>
        <span class="module-badge">订单系统</span>
        <h1>订单管理</h1>
      </div>
      <div class="header-actions">
        <button class="dialog-trigger" type="button" @click="openDialog">
          {{ dialogConfig.actionLabel }}
        </button>
      </div>
    </header>

    <nav class="module-tabs">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="tab-link"
        @click="notifyHostNavigation(item.to)"
      >
        {{ item.label }}
      </RouterLink>
    </nav>

    <main class="module-content">
      <RouterView />
    </main>

    <Teleport to="body">
      <div v-if="isDialogOpen" class="dialog-mask" @click.self="closeDialog">
        <section
          class="dialog-panel"
          role="dialog"
          aria-modal="true"
          :aria-label="dialogConfig.title"
        >
          <div class="dialog-head">
            <div>
              <span class="dialog-badge">订单操作</span>
              <h2>{{ dialogConfig.title }}</h2>
            </div>
            <button class="dialog-close" type="button" @click="closeDialog">
              关闭
            </button>
          </div>

          <div class="dialog-form">
            <label
              v-for="field in dialogConfig.fields"
              :key="field"
              class="dialog-field"
            >
              <span>{{ field }}</span>
              <input :placeholder="`请输入${field}`" />
            </label>
          </div>

          <div class="dialog-footer">
            <button class="dialog-secondary" type="button" @click="closeDialog">
              取消
            </button>
            <button class="dialog-primary" type="button" @click="closeDialog">
              确认提交
            </button>
          </div>
        </section>
      </div>
    </Teleport>
  </section>
</template>
