<script setup lang="ts">
import { Badge, Button, Card } from '@supply-chain/ui-vue'
import { computed, ref } from 'vue'

import { formatTime, money } from '../domain'
import { useFulfillment } from '../use-fulfillment'
import PageHeader from './PageHeader.vue'

const {
  verifications,
  loading,
  errorMessage,
  updatingVerificationId,
  loadData,
  updateVerification,
} = useFulfillment()
const deliveryAmounts = ref<Record<string, string>>({})
const resolutions = ref<Record<string, string>>({})
const sortedVerifications = computed(() => [
  ...verifications.value.filter((item) => item.status !== 'resolved'),
  ...verifications.value.filter((item) => item.status === 'resolved'),
])
const statusMeta = {
  pending: { text: '待核实', variant: 'danger' as const },
  processing: { text: '核实中', variant: 'warning' as const },
  resolved: { text: '已完成', variant: 'success' as const },
}

function finish(id: string) {
  void updateVerification(id, 'resolved', {
    verifiedDeliveryAmount: Number(deliveryAmounts.value[id]),
    resolution: resolutions.value[id] ?? '',
  })
}
</script>

<template>
  <main class="p-5 lg:p-8">
    <PageHeader
      title="履约核实"
      description="处理结算中心退回的交付金额与签收差异"
      :loading="loading"
      @refresh="loadData(true)"
    />
    <Card v-if="errorMessage" class="mb-6 border-rose-200 p-4 text-sm text-rose-600">
      {{ errorMessage }}
    </Card>
    <section class="grid gap-4 xl:grid-cols-2">
      <Card v-for="task in sortedVerifications" :key="task.id" class="p-5">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <RouterLink
              :to="`/orders/${task.fulfillment.id}`"
              class="font-semibold text-primary hover:underline"
            >
              {{ task.salesOrder.orderNo }}
            </RouterLink>
            <p class="mt-1 text-sm text-muted-foreground">
              {{ task.salesOrder.customerName }} · {{ task.settlementBatch.batchNo }}
            </p>
          </div>
          <Badge :variant="statusMeta[task.status].variant">
            {{ statusMeta[task.status].text }}
          </Badge>
        </div>

        <div class="mt-5 grid gap-3 rounded-lg bg-muted/60 p-4 text-sm sm:grid-cols-2">
          <div>
            <p class="text-muted-foreground">财务发现差异</p>
            <p class="mt-1 font-medium text-rose-600">{{ money(task.differenceAmount) }}</p>
          </div>
          <div>
            <p class="text-muted-foreground">负责人</p>
            <p class="mt-1 font-medium">{{ task.owner }}</p>
          </div>
          <div class="sm:col-span-2">
            <p class="text-muted-foreground">退回原因</p>
            <p class="mt-1">{{ task.differenceReason }}</p>
          </div>
        </div>

        <Button
          v-if="task.status === 'pending'"
          class="mt-4 w-full"
          size="sm"
          :disabled="updatingVerificationId === task.id"
          @click="updateVerification(task.id, 'processing')"
        >
          {{ updatingVerificationId === task.id ? '处理中' : '开始核实' }}
        </Button>

        <div v-else-if="task.status === 'processing'" class="mt-4 space-y-3">
          <label class="block text-sm">
            <span class="text-muted-foreground">核实后的实际交付金额</span>
            <input
              v-model="deliveryAmounts[task.id]"
              type="number"
              min="0"
              step="0.01"
              class="mt-1 h-10 w-full rounded-lg border border-border bg-background px-3 outline-none"
              :placeholder="task.salesOrder.amount"
            />
          </label>
          <label class="block text-sm">
            <span class="text-muted-foreground">核实结论</span>
            <textarea
              v-model="resolutions[task.id]"
              rows="3"
              class="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 outline-none"
              placeholder="例如：已核对签收凭证，确认短少金额及责任归属"
            />
          </label>
          <Button
            class="w-full"
            size="sm"
            :disabled="
              updatingVerificationId === task.id ||
              deliveryAmounts[task.id] === undefined ||
              deliveryAmounts[task.id] === '' ||
              !resolutions[task.id]?.trim()
            "
            @click="finish(task.id)"
          >
            {{ updatingVerificationId === task.id ? '提交中' : '完成核实' }}
          </Button>
        </div>

        <div v-else class="mt-4 rounded-lg border border-emerald-200 p-4 text-sm">
          <p class="font-medium text-emerald-700">核实结果：{{ task.resolution }}</p>
          <p class="mt-2 text-muted-foreground">
            实际交付金额 {{ money(task.verifiedDeliveryAmount ?? 0) }} ·
            {{ task.resolvedAt ? formatTime(task.resolvedAt) : '' }}
          </p>
        </div>
      </Card>
    </section>
    <Card
      v-if="!loading && !sortedVerifications.length"
      class="p-10 text-center text-sm text-muted-foreground"
    >
      暂无待处理的履约核实任务。
    </Card>
  </main>
</template>
