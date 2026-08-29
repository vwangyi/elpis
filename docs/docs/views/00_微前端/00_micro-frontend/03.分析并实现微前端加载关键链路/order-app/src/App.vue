<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isDialogOpen = ref(false)

const navItems = [
  { to: '/orders/list', label: '订单列表' },
  { to: '/orders/detail/2048', label: '订单详情' },
  { to: '/orders/refund/1024', label: '退款处理' },
]

const dialogConfig = computed(() => {
  if (route.path === '/orders/detail/2048') {
    return {
      actionLabel: '修改订单备注',
      title: '修改订单备注',
      description: '给订单 O-2048 补充售后说明、配送备注和客服跟进信息。',
      fields: ['订单备注', '跟进人', '同步客户通知'],
    }
  }

  if (route.path === '/orders/refund/1024') {
    return {
      actionLabel: '审核退款申请',
      title: '审核退款申请',
      description: '确认退款原因、责任归属和回写节点，再提交到财务系统继续处理。',
      fields: ['审核意见', '责任归属', '是否同步财务'],
    }
  }

  return {
    actionLabel: '新建订单',
    title: '新建订单',
    description: '录入下单信息、商品明细和配送要求，生成新的订单草稿。',
    fields: ['客户姓名', '商品数量', '配送方式'],
  }
})

function openDialog() {
  isDialogOpen.value = true
}

function closeDialog() {
  isDialogOpen.value = false
}
</script>

<template>
  <section class="module-shell">
    <header class="module-header">
      <div>
        <span class="module-badge">订单系统</span>
        <h1>订单管理</h1>
        <p>负责订单查询、详情查看和售后处理。</p>
      </div>
      <div class="header-actions">
        <button class="dialog-trigger" type="button" @click="openDialog">
          {{ dialogConfig.actionLabel }}
        </button>
        <div class="module-status">当前页面：{{ route.meta.title }}</div>
      </div>
    </header>

    <nav class="module-tabs">
      <RouterLink v-for="item in navItems" :key="item.to" :to="item.to" class="tab-link">
        {{ item.label }}
      </RouterLink>
    </nav>

    <main class="module-content">
      <RouterView />
    </main>

    <Teleport to="body">
      <div v-if="isDialogOpen" class="dialog-mask" @click.self="closeDialog">
        <section class="dialog-panel" role="dialog" aria-modal="true" :aria-label="dialogConfig.title">
          <div class="dialog-head">
            <div>
              <span class="dialog-badge">订单操作</span>
              <h2>{{ dialogConfig.title }}</h2>
              <p>{{ dialogConfig.description }}</p>
            </div>
            <button class="dialog-close" type="button" @click="closeDialog">关闭</button>
          </div>

          <div class="dialog-form">
            <label v-for="field in dialogConfig.fields" :key="field" class="dialog-field">
              <span>{{ field }}</span>
              <input :placeholder="`请输入${field}`" />
            </label>
          </div>

          <div class="dialog-footer">
            <button class="dialog-secondary" type="button" @click="closeDialog">取消</button>
            <button class="dialog-primary" type="button" @click="closeDialog">确认提交</button>
          </div>
        </section>
      </div>
    </Teleport>
  </section>
</template>