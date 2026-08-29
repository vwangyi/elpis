<script setup lang="ts">
import { Badge, Button, Card } from '@supply-chain/ui-vue'
import { ArrowLeft, Building2, CalendarDays, Package, Truck } from 'lucide-vue-next'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { actionMeta, formatTime, money, statusMeta } from '../domain'
import { useFulfillment } from '../use-fulfillment'

const route = useRoute()
const { orders, loading, errorMessage, updatingId, updateStatus } = useFulfillment()
const order = computed(() => orders.value.find((item) => item.id === route.params.id))
const hasUnresolvedException = computed(() =>
  order.value?.exceptions.some((item) => item.status !== 'resolved'),
)
const actionBlocked = computed(() => {
  if (!order.value || !hasUnresolvedException.value) return false
  const action = actionMeta[order.value.status]
  return action?.status === 'completed' || order.value.status === 'exception'
})
</script>

<template>
  <main class="p-5 lg:p-8">
    <RouterLink
      to="/orders"
      class="mb-5 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      ><ArrowLeft :size="16" />返回订单任务</RouterLink
    >
    <Card v-if="loading" class="p-10 text-center text-sm text-muted-foreground"
      >正在加载订单详情...</Card
    >
    <Card v-else-if="errorMessage" class="border-rose-200 p-6 text-sm text-rose-600">{{
      errorMessage
    }}</Card>
    <template v-else-if="order">
      <header class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div class="flex items-center gap-3">
            <h1 class="text-2xl font-bold">{{ order.salesOrder.orderNo }}</h1>
            <Badge :variant="statusMeta[order.status]?.variant ?? 'secondary'">{{
              statusMeta[order.status]?.text
            }}</Badge>
          </div>
          <p class="mt-2 text-sm text-muted-foreground">
            {{ order.salesOrder.customerName }} · {{ order.salesOrder.businessUnit }}
          </p>
        </div>
        <Button
          v-if="actionMeta[order.status]"
          :disabled="updatingId === order.id || actionBlocked"
          @click="updateStatus(order.id, actionMeta[order.status]!.status)"
          >{{
            updatingId === order.id
              ? '处理中'
              : actionBlocked
                ? '请先关闭异常'
                : actionMeta[order.status]?.text
          }}</Button
        >
      </header>
      <section class="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card
          v-for="item in [
            { label: '订单金额', value: money(order.salesOrder.amount), icon: Building2 },
            { label: '承诺交付', value: order.salesOrder.promisedDate, icon: CalendarDays },
            { label: '履约仓库', value: order.warehouse, icon: Package },
            { label: '承运商', value: order.carrier ?? '待分配', icon: Truck },
          ]"
          :key="item.label"
          class="p-5"
          ><component :is="item.icon" :size="19" class="text-primary" />
          <p class="mt-4 text-sm text-muted-foreground">{{ item.label }}</p>
          <p class="mt-1 font-semibold">{{ item.value }}</p></Card
        >
      </section>
      <section class="mt-6 grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <Card class="p-6"
          ><h2 class="font-semibold">交付进度</h2>
          <div class="mt-6 space-y-5">
            <div
              v-for="item in [
                { label: '订单总量', value: order.totalQuantity },
                { label: '已发运', value: order.shippedQuantity },
                { label: '已签收', value: order.receivedQuantity },
              ]"
              :key="item.label"
            >
              <div class="mb-2 flex justify-between text-sm">
                <span>{{ item.label }}</span
                ><span>{{ item.value }} / {{ order.totalQuantity }}</span>
              </div>
              <div class="h-2 rounded-full bg-muted">
                <div
                  class="h-2 rounded-full bg-primary"
                  :style="{
                    width: `${order.totalQuantity ? (item.value / order.totalQuantity) * 100 : 0}%`,
                  }"
                />
              </div>
            </div>
          </div>
          <div class="mt-6 rounded-lg bg-muted/60 p-4 text-sm">
            <p>运单号：{{ order.trackingNo ?? '尚未生成' }}</p>
            <p class="mt-2">承运商：{{ order.carrier ?? '尚未分配' }}</p>
          </div></Card
        >
        <Card class="p-6"
          ><h2 class="font-semibold">关联异常</h2>
          <div v-if="order.exceptions.length" class="mt-4 space-y-3">
            <div
              v-for="item in order.exceptions"
              :key="item.id"
              class="rounded-lg border border-border p-4"
            >
              <div class="flex justify-between">
                <Badge :variant="item.status === 'resolved' ? 'success' : 'danger'">{{
                  item.exceptionType
                }}</Badge
                ><span class="text-xs text-muted-foreground">{{
                  formatTime(item.deadlineAt)
                }}</span>
              </div>
              <p class="mt-3 text-sm">{{ item.description }}</p>
              <p class="mt-3 text-xs text-muted-foreground">负责人：{{ item.owner }}</p>
            </div>
          </div>
          <p v-else class="mt-4 text-sm text-muted-foreground">当前订单没有履约异常。</p></Card
        >
      </section>
    </template>
    <Card v-else class="p-10 text-center"
      ><p class="font-medium">未找到订单</p>
      <RouterLink to="/orders" class="mt-2 inline-block text-sm text-primary"
        >返回订单列表</RouterLink
      ></Card
    >
  </main>
</template>
