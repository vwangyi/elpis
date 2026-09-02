<script setup>
import { ref } from "vue";
import { RouterLink, RouterView } from "vue-router";
import { appState, globalContext, hostContext } from "./micro-bridge.js";

const shiftNote = ref("");
const runtimeOwner = window.runtimeOwner;
</script>

<template>
  <section class="order-app">
    <header>
      <span class="order-entry-note">HTML Entry 外链样式</span>
      <h2 class="child-shared-title">订单履约看板</h2>
      <p>今日重点关注库存占用、异常派单和跨仓调拨进度。</p>
    </header>

    <dl class="runtime-panel shared-scope-card">
      <div><dt>构建工具</dt><dd>Webpack</dd></div>
      <div><dt>路由</dt><dd>history</dd></div>
      <div><dt>window.runtimeOwner</dt><dd>{{ runtimeOwner }}</dd></div>
      <div><dt>应用状态</dt><dd>{{ appState.value }}</dd></div>
      <div><dt>定向仓库</dt><dd>{{ hostContext.warehouse }}</dd></div>
      <div><dt>全局主题</dt><dd>{{ globalContext.theme }}</dd></div>
    </dl>

    <label class="keep-alive-field">
      保活测试值
      <input v-model="shiftNote" placeholder="输入后切换到财务中心再返回" />
    </label>

    <nav class="sub-nav" aria-label="订单中心页面">
      <RouterLink to="/list">订单列表</RouterLink>
      <RouterLink to="/exceptions">异常处理</RouterLink>
    </nav>

    <RouterView />
  </section>
</template>
