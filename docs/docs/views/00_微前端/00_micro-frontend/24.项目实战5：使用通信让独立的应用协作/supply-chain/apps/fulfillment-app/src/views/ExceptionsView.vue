<script setup lang="ts">
import { Badge, Button, Card } from '@supply-chain/ui-vue'
import { AlertTriangle, CheckCircle2, Clock3, UserRound } from 'lucide-vue-next'

import { formatTime } from '../domain'
import { useFulfillment } from '../use-fulfillment'
import PageHeader from './PageHeader.vue'

const { exceptions, loading, errorMessage, updatingExceptionId, loadData, updateExceptionStatus } =
  useFulfillment()

const exceptionStatusMeta = {
  open: { text: '待处理', variant: 'danger' as const, action: '开始处理', next: 'processing' },
  processing: { text: '处理中', variant: 'warning' as const, action: '关闭异常', next: 'resolved' },
  resolved: { text: '已解决', variant: 'success' as const, action: '', next: '' },
}
</script>

<template>
  <main class="p-5 lg:p-8">
    <PageHeader
      title="异常协同"
      description="跟踪异常责任人、处理时限和关闭状态"
      :loading="loading"
      @refresh="loadData(true)"
    />
    <Card v-if="errorMessage" class="mb-6 border-rose-200 p-4 text-sm text-rose-600">{{
      errorMessage
    }}</Card>
    <section class="grid gap-4 xl:grid-cols-3">
      <Card v-for="item in exceptions" :key="item.id" class="p-5"
        ><div class="flex justify-between">
          <div class="flex items-center gap-2">
            <Badge
              :variant="
                exceptionStatusMeta[item.status as keyof typeof exceptionStatusMeta]?.variant
              "
            >
              {{ item.exceptionType }}
            </Badge>
            <span class="text-xs text-muted-foreground">{{
              exceptionStatusMeta[item.status as keyof typeof exceptionStatusMeta]?.text
            }}</span>
          </div>
          <RouterLink
            v-if="item.fulfillment"
            :to="`/orders/${item.fulfillment.id}`"
            class="text-xs text-primary hover:underline"
            >{{ item.fulfillment.salesOrder.orderNo }}</RouterLink
          >
        </div>
        <div class="mt-4 flex gap-3">
          <component
            :is="item.status === 'resolved' ? CheckCircle2 : AlertTriangle"
            :class="item.status === 'resolved' ? 'text-emerald-600' : 'text-rose-600'"
            :size="20"
          />
          <p class="text-sm leading-6">{{ item.description }}</p>
        </div>
        <div class="mt-5 space-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
          <p class="flex items-center gap-2"><UserRound :size="14" />负责人：{{ item.owner }}</p>
          <p class="flex items-center gap-2">
            <Clock3 :size="14" />处理时限：{{ formatTime(item.deadlineAt) }}
          </p>
        </div>
        <Button
          v-if="item.status !== 'resolved'"
          class="mt-4 w-full"
          size="sm"
          :variant="item.status === 'open' ? 'outline' : 'default'"
          :disabled="updatingExceptionId === item.id"
          @click="
            updateExceptionStatus(
              item.id,
              exceptionStatusMeta[item.status as keyof typeof exceptionStatusMeta].next,
            )
          "
        >
          {{
            updatingExceptionId === item.id
              ? '处理中'
              : exceptionStatusMeta[item.status as keyof typeof exceptionStatusMeta].action
          }}
        </Button></Card
      >
    </section>
  </main>
</template>
