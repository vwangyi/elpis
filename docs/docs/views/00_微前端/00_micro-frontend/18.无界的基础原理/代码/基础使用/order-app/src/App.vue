<script setup>
import { ref } from "vue";
import { RouterLink, RouterView } from "vue-router";
import { hostContext, operationNotice } from "./micro-bridge.js";

const handoverNote = ref("");
</script>

<template>
  <section class="order-app">
    <header class="order-header">
      <div>
        <span class="order-entry-note">订单履约</span>
        <h2>订单履约看板</h2>
        <p>今日重点关注库存占用、异常派单和跨仓调拨进度。</p>
      </div>
      <dl class="operator-card">
        <div><dt>负责人</dt><dd>{{ hostContext.name }}</dd></div>
        <div><dt>当前仓库</dt><dd>{{ hostContext.warehouse }}</dd></div>
      </dl>
    </header>

    <p class="operation-notice" role="status">
      <strong>运营通知</strong>
      {{ operationNotice.content }}
    </p>

    <label class="handover-field">
      交接备注
      <input v-model="handoverNote" placeholder="记录本班次需要继续跟进的事项" />
    </label>

    <nav class="sub-nav" aria-label="订单中心页面">
      <RouterLink to="/list">订单列表</RouterLink>
      <RouterLink to="/exceptions">异常处理</RouterLink>
    </nav>

    <RouterView />
  </section>
</template>
