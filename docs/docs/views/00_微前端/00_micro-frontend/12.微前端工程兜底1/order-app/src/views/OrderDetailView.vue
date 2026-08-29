<script setup>
import { ref } from "vue";

const followUpNote = ref("");
const handlerName = ref("");
</script>

<template>
  <section class="view-grid">
    <article class="view-card view-card-strong">
      <h2>订单号 O-2048</h2>
    </article>

    <article class="view-card">
      <h2>基础信息</h2>
      <ul>
        <li>下单时间：2026-06-24 10:35</li>
        <li>支付状态：已支付</li>
        <li>配送状态：配送中</li>
      </ul>
    </article>

    <article class="view-card">
      <h2>关联操作</h2>
      <ul>
        <li>打印面单</li>
        <li>修改收货备注</li>
        <li>进入售后流程</li>
      </ul>
    </article>

    <article class="view-card order-form-card">
      <h2>履约备注</h2>
      <label class="order-field">
        <span>跟进人</span>
        <input v-model="handlerName" placeholder="请输入跟进人" />
      </label>
      <label class="order-field">
        <span>处理备注</span>
        <textarea
          v-model="followUpNote"
          placeholder="请输入处理备注"
        ></textarea>
      </label>
    </article>
  </section>
</template>
