<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <section class="order-app">
    <header>
      <span class="order-entry-note">HTML Entry 外链样式</span>
      <h2>订单履约看板</h2>
      <p>今日重点关注库存占用、异常派单和跨仓调拨进度。</p>
    </header>

    <nav class="sub-nav" aria-label="订单中心页面">
      <RouterLink to="/list">订单列表</RouterLink>
      <RouterLink to="/exceptions">异常处理</RouterLink>
    </nav>

    <RouterView />
  </section>
</template>
