<script setup lang="ts">
import { Badge, Card } from '@supply-chain/ui-vue'
import { MapPin, PackageCheck, Truck } from 'lucide-vue-next'

import { statusMeta } from '../domain'
import { useFulfillment } from '../use-fulfillment'
import PageHeader from './PageHeader.vue'

const { shipments, loading, loadData } = useFulfillment()
</script>

<template>
  <main class="p-5 lg:p-8">
    <PageHeader
      title="运输跟踪"
      description="查看待发运、在途与签收任务的运输状态"
      :loading="loading"
      @refresh="loadData(true)"
    />
    <section class="grid gap-4 xl:grid-cols-2">
      <Card v-for="item in shipments" :key="item.id" class="p-5"
        ><div class="flex items-start justify-between">
          <div>
            <RouterLink
              :to="`/orders/${item.id}`"
              class="font-semibold text-primary hover:underline"
              >{{ item.salesOrder.orderNo }}</RouterLink
            >
            <p class="mt-1 text-sm text-muted-foreground">{{ item.salesOrder.customerName }}</p>
          </div>
          <Badge :variant="statusMeta[item.status]?.variant ?? 'secondary'">{{
            statusMeta[item.status]?.text
          }}</Badge>
        </div>
        <div class="mt-5 grid gap-4 rounded-lg bg-muted/60 p-4 sm:grid-cols-3">
          <div>
            <p class="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin :size="14" />发运仓库
            </p>
            <p class="mt-1 text-sm font-medium">{{ item.warehouse }}</p>
          </div>
          <div>
            <p class="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Truck :size="14" />承运信息
            </p>
            <p class="mt-1 text-sm font-medium">{{ item.carrier ?? '待分配' }}</p>
          </div>
          <div>
            <p class="flex items-center gap-1.5 text-xs text-muted-foreground">
              <PackageCheck :size="14" />运单号
            </p>
            <p class="mt-1 text-sm font-medium">{{ item.trackingNo ?? '待生成' }}</p>
          </div>
        </div>
        <div class="mt-4 flex items-center gap-3">
          <div class="h-2 flex-1 rounded-full bg-muted">
            <div
              class="h-2 rounded-full bg-emerald-500"
              :style="{
                width: `${item.totalQuantity ? (item.receivedQuantity / item.totalQuantity) * 100 : 0}%`,
              }"
            />
          </div>
          <span class="text-xs text-muted-foreground"
            >签收 {{ item.receivedQuantity }}/{{ item.totalQuantity }}</span
          >
        </div></Card
      >
    </section>
  </main>
</template>
