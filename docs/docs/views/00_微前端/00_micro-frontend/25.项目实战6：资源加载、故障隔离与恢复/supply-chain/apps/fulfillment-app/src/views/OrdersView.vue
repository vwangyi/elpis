<script setup lang="ts">
import { Badge, Button, Card } from '@supply-chain/ui-vue'
import { CheckCircle2, Search } from 'lucide-vue-next'
import { computed, ref } from 'vue'

import { actionMeta, money, statusMeta, type Fulfillment } from '../domain'
import { useFulfillment } from '../use-fulfillment'
import PageHeader from './PageHeader.vue'

const { orders, loading, updatingId, errorMessage, loadData, updateStatus } = useFulfillment()
const search = ref('')
const status = ref('')
const filtered = computed(() =>
  orders.value.filter((item) => {
    const keyword = search.value.trim().toLowerCase()
    const matches = [item.salesOrder.orderNo, item.salesOrder.customerName].some((value) =>
      value.toLowerCase().includes(keyword),
    )
    return matches && (!status.value || item.status === status.value)
  }),
)
function advance(item: Fulfillment) {
  const action = actionMeta[item.status]
  if (action) void updateStatus(item.id, action.status)
}
function hasUnresolvedException(item: Fulfillment) {
  return item.exceptions.some((exception) => exception.status !== 'resolved')
}
function isActionBlocked(item: Fulfillment) {
  const action = actionMeta[item.status]
  return Boolean(
    action &&
    hasUnresolvedException(item) &&
    (action.status === 'completed' || item.status === 'exception'),
  )
}
</script>

<template>
  <main class="p-5 lg:p-8">
    <PageHeader
      title="订单任务"
      description="审核销售订单并持续推进交付状态"
      :loading="loading"
      @refresh="loadData(true)"
    />
    <Card v-if="errorMessage" class="mb-6 border-rose-200 p-4 text-sm text-rose-600">{{
      errorMessage
    }}</Card>
    <Card class="overflow-hidden">
      <div class="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
        <div>
          <h2 class="font-semibold">履约任务池</h2>
          <p class="mt-1 text-sm text-muted-foreground">共 {{ filtered.length }} 条任务</p>
        </div>
        <div class="flex gap-2">
          <label class="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm"
            ><Search :size="16" /><input
              v-model="search"
              class="w-40 bg-transparent outline-none"
              placeholder="订单或客户"
          /></label>
          <select
            v-model="status"
            class="rounded-lg border border-border bg-background px-3 text-sm"
          >
            <option value="">全部状态</option>
            <option v-for="(meta, value) in statusMeta" :key="value" :value="value">
              {{ meta.text }}
            </option>
          </select>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full min-w-[940px] text-left text-sm">
          <thead class="bg-muted/60 text-muted-foreground">
            <tr>
              <th
                v-for="title in [
                  '销售订单',
                  '客户',
                  '承诺日期',
                  '金额',
                  '签收进度',
                  '状态',
                  '操作',
                ]"
                :key="title"
                class="px-5 py-3 font-medium"
              >
                {{ title }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filtered" :key="item.id" class="border-t border-border">
              <td class="px-5 py-4">
                <RouterLink
                  :to="`/orders/${item.id}`"
                  class="font-medium text-primary hover:underline"
                  >{{ item.salesOrder.orderNo }}</RouterLink
                >
              </td>
              <td class="px-5 py-4">
                <p>{{ item.salesOrder.customerName }}</p>
                <p class="text-xs text-muted-foreground">{{ item.salesOrder.businessUnit }}</p>
              </td>
              <td class="px-5 py-4">{{ item.salesOrder.promisedDate }}</td>
              <td class="px-5 py-4">{{ money(item.salesOrder.amount) }}</td>
              <td class="px-5 py-4">{{ item.receivedQuantity }} / {{ item.totalQuantity }}</td>
              <td class="px-5 py-4">
                <Badge :variant="statusMeta[item.status]?.variant ?? 'secondary'">{{
                  statusMeta[item.status]?.text ?? item.status
                }}</Badge>
              </td>
              <td class="px-5 py-4">
                <Button
                  v-if="actionMeta[item.status]"
                  size="sm"
                  variant="outline"
                  :disabled="updatingId === item.id || isActionBlocked(item)"
                  @click="advance(item)"
                  >{{
                    updatingId === item.id
                      ? '处理中'
                      : isActionBlocked(item)
                        ? '请先关闭异常'
                        : actionMeta[item.status]?.text
                  }}</Button
                ><CheckCircle2 v-else class="text-emerald-600" :size="18" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  </main>
</template>
