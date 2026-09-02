<script setup>
import { reportToHost } from "../micro-bridge.js";

function report() {
  reportToHost("订单中心已确认 4 个高优先级异常");
}
</script>

<template>
  <div class="route-panel">
    <article class="order-card wide">
      <span>高优先级异常</span>
      <strong>4</strong>
      <p>需要运营负责人在 30 分钟内确认处理方案。</p>
    </article>
    <article class="order-card wide">
      <span>待补充地址</span>
      <strong>9</strong>
      <p>客户信息不完整，暂缓进入出库排程。</p>
    </article>
  </div>

  <table class="order-table">
    <thead>
      <tr>
        <th>异常编号</th>
        <th>问题类型</th>
        <th>责任组</th>
        <th>状态</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>EX-250728-006</td>
        <td>库存占用冲突</td>
        <td>华东仓</td>
        <td><span class="order-status">协调中</span></td>
      </tr>
      <tr>
        <td>EX-250728-012</td>
        <td>客户地址缺失</td>
        <td>客服组</td>
        <td><span class="order-status">待补充</span></td>
      </tr>
    </tbody>
  </table>

  <button class="report-button" type="button" @click="report">向主应用回传处理结果</button>
</template>
