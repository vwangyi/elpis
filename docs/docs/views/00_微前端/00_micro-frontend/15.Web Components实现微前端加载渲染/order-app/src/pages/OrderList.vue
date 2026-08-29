<template>
  <div class="order-grid">
    <article class="order-card">
      <span>待审核订单</span>
      <strong>128</strong>
      <p>比昨日减少 16 单</p>
    </article>
    <article class="order-card">
      <span>异常派单</span>
      <strong>12</strong>
      <p>华东仓占 7 单</p>
    </article>
    <article class="order-card">
      <span>库存占用</span>
      <strong>86%</strong>
      <p>核心 SKU 供应稳定</p>
    </article>
  </div>

  <table class="order-table">
    <thead>
      <tr>
        <th>订单号</th>
        <th>客户</th>
        <th>履约节点</th>
        <th>状态</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>SO-250728-018</td>
        <td>南京云杉商贸</td>
        <td>华东仓复核</td>
        <td><span class="order-status">处理中</span></td>
      </tr>
      <tr>
        <td>SO-250728-024</td>
        <td>成都星河门店</td>
        <td>跨仓调拨</td>
        <td><span class="order-status">待确认</span></td>
      </tr>
      <tr>
        <td>SO-250728-031</td>
        <td>杭州南岸优选</td>
        <td>出库排程</td>
        <td><span class="order-status">已锁库</span></td>
      </tr>
    </tbody>
  </table>
</template>
