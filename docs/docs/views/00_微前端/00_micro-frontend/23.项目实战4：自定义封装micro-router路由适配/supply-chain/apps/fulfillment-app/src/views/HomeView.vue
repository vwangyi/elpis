<script setup lang="ts">
import { Card, ChartContainer, type ChartConfig } from '@supply-chain/ui-vue'
import { VisDonut, VisSingleContainer } from '@unovis/vue'
import { AlertTriangle, Clock3, FileCheck2, PackageCheck, Truck } from 'lucide-vue-next'
import { computed } from 'vue'

import { useFulfillment } from '../use-fulfillment'
import PageHeader from './PageHeader.vue'

const { summary, exceptions, verifications, loading, errorMessage, loadData } = useFulfillment()
const pendingExceptions = computed(() =>
  exceptions.value.filter((item) => item.status !== 'resolved'),
)
const pendingVerifications = computed(() =>
  verifications.value.filter((item) => item.status !== 'resolved'),
)
const chartConfig: ChartConfig = {
  pending_review: { label: '待审核', color: 'hsl(var(--chart-3))' },
  ready_to_ship: { label: '待发运', color: 'hsl(var(--chart-4))' },
  in_transit: { label: '运输中', color: 'hsl(var(--chart-1))' },
  partially_received: { label: '部分签收', color: 'hsl(var(--chart-5))' },
  completed: { label: '已完成', color: 'hsl(var(--chart-2))' },
  exception: { label: '异常', color: 'hsl(var(--danger))' },
}
const chartData = computed(() =>
  (summary.value?.statusDistribution ?? []).map((item) => ({
    ...item,
    label: chartConfig[item.status]?.label ?? item.status,
    color: chartConfig[item.status]?.color ?? 'hsl(var(--muted-foreground))',
  })),
)

function donutValue(item: { count: number }) {
  return item.count
}

function donutColor(item: { color: string }) {
  return item.color
}
</script>

<template>
  <main class="p-5 lg:p-8">
    <PageHeader
      title="履约概览"
      description="订单审核、发运、签收、异常与履约核实的实时运行状态"
      :loading="loading"
      @refresh="loadData(true)"
    />
    <Card v-if="errorMessage" class="mb-6 border-rose-200 p-4 text-sm text-rose-600">{{
      errorMessage
    }}</Card>
    <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <Card
        v-for="item in [
          {
            label: '待审核订单',
            value: summary?.pendingReview ?? 0,
            icon: Clock3,
            color: 'text-amber-500',
          },
          {
            label: '已发运任务',
            value: summary?.shippedCount ?? 0,
            icon: Truck,
            color: 'text-blue-600',
          },
          {
            label: '已有签收',
            value: summary?.receivedCount ?? 0,
            icon: PackageCheck,
            color: 'text-emerald-600',
          },
          {
            label: '未关闭异常',
            value: summary?.openExceptions ?? 0,
            icon: AlertTriangle,
            color: 'text-rose-600',
          },
          {
            label: '待履约核实',
            value: summary?.pendingVerifications ?? 0,
            icon: FileCheck2,
            color: 'text-violet-600',
          },
        ]"
        :key="item.label"
        class="p-5"
      >
        <component :is="item.icon" :class="item.color" :size="21" />
        <p class="mt-4 text-sm text-muted-foreground">{{ item.label }}</p>
        <p class="mt-1 text-3xl font-semibold">{{ loading ? '—' : item.value }}</p>
      </Card>
    </section>
    <section class="mt-6 grid gap-6 xl:grid-cols-[1.1fr_1fr]">
      <Card class="p-6">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 class="font-semibold">履约状态结构</h2>
            <p class="mt-1 text-sm text-muted-foreground">订单在各履约环节的实时分布</p>
          </div>
          <RouterLink
            to="/verifications"
            class="flex items-center gap-2 rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 text-sm text-violet-700 dark:border-violet-900 dark:bg-violet-950/40 dark:text-violet-300"
          >
            <FileCheck2 :size="16" />待履约核实 {{ summary?.pendingVerifications ?? 0 }}
          </RouterLink>
        </div>
        <ChartContainer :config="chartConfig" class="mt-3 h-72">
          <VisSingleContainer :data="chartData" class="h-56"
            ><VisDonut :value="donutValue" :color="donutColor" :arc-width="28"
          /></VisSingleContainer>
          <div class="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
            <span v-for="item in chartData" :key="item.status" class="flex items-center gap-1.5"
              ><span class="size-2.5 rounded-sm" :style="{ backgroundColor: item.color }" />{{
                item.label
              }}
              {{ item.count }}</span
            >
          </div>
        </ChartContainer>
        <p class="mt-3 text-xs text-muted-foreground">
          履约核实是财务发起的协同待办，同一订单仍保持原履约状态，因此不重复计入环形图。
        </p>
      </Card>
      <Card class="p-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="font-semibold">履约协同待办</h2>
            <p class="mt-1 text-sm text-muted-foreground">跟进异常与财务退回的核实任务</p>
          </div>
          <RouterLink to="/verifications" class="text-sm text-primary">查看核实任务</RouterLink>
        </div>
        <div class="mt-5 space-y-3">
          <div
            v-for="item in pendingVerifications.slice(0, 2)"
            :key="item.id"
            class="rounded-lg border border-violet-200 p-4 dark:border-violet-900"
          >
            <div class="flex items-center justify-between gap-3">
              <span class="text-sm font-medium">履约核实</span>
              <span class="text-xs text-muted-foreground">{{ item.salesOrder.orderNo }}</span>
            </div>
            <p class="mt-2 text-sm text-muted-foreground">{{ item.differenceReason }}</p>
            <p class="mt-3 text-xs">
              负责人：{{ item.owner }} ·
              <span class="text-violet-600">{{
                item.status === 'pending' ? '待核实' : '核实中'
              }}</span>
            </p>
          </div>
          <div
            v-for="item in pendingExceptions.slice(0, pendingVerifications.length ? 2 : 4)"
            :key="item.id"
            class="rounded-lg border border-border p-4"
          >
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">{{ item.exceptionType }}</span
              ><span class="text-xs text-muted-foreground">{{
                item.fulfillment?.salesOrder.orderNo
              }}</span>
            </div>
            <p class="mt-2 text-sm text-muted-foreground">{{ item.description }}</p>
            <p class="mt-3 text-xs">
              负责人：{{ item.owner }} ·
              <span :class="item.status === 'resolved' ? 'text-emerald-600' : 'text-rose-600'">{{
                item.status === 'resolved' ? '已关闭' : '处理中'
              }}</span>
            </p>
          </div>
          <p
            v-if="!pendingVerifications.length && !pendingExceptions.length"
            class="py-8 text-center text-sm text-muted-foreground"
          >
            当前没有待处理的履约协同任务。
          </p>
        </div>
      </Card>
    </section>
  </main>
</template>
