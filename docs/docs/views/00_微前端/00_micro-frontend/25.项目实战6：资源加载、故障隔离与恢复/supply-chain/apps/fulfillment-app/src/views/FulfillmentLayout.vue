<script setup lang="ts">
import { ThemeToggle } from '@supply-chain/ui-vue'
import {
  AlertTriangle,
  Boxes,
  ClipboardList,
  FileCheck2,
  LayoutDashboard,
  PackageSearch,
  Truck,
} from 'lucide-vue-next'
import { onBeforeUnmount, onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

import { useFulfillment } from '../use-fulfillment'
import { getPlatformBridge } from '../platform-bridge'

const navigation = [
  { to: '/', label: '履约概览', icon: LayoutDashboard },
  { to: '/orders', label: '订单任务', icon: PackageSearch },
  { to: '/shipments', label: '运输跟踪', icon: Truck },
  { to: '/plans/new', label: '履约方案填报', icon: ClipboardList },
  { to: '/exceptions', label: '异常协同', icon: AlertTriangle },
  { to: '/verifications', label: '履约核实', icon: FileCheck2 },
]

const isMicroApp = Boolean(window.__POWERED_BY_QIANKUN__)
const { loadData } = useFulfillment()
let unsubscribeVerificationCreated: (() => void) | null = null
onMounted(() => {
  void loadData()
  unsubscribeVerificationCreated = getPlatformBridge().subscribe(
    'settlement.verification-created',
    () => void loadData(true),
  )
})
onBeforeUnmount(() => unsubscribeVerificationCreated?.())
</script>

<template>
  <div
    class="min-h-screen bg-background text-foreground"
    :class="{ 'lg:grid lg:grid-cols-[248px_1fr]': !isMicroApp }"
  >
    <aside
      v-if="!isMicroApp"
      class="border-b border-border bg-card lg:min-h-screen lg:border-b-0 lg:border-r"
    >
      <div class="flex h-16 items-center gap-3 border-b border-border px-5">
        <span class="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
          <Boxes :size="19" />
        </span>
        <div>
          <p class="font-semibold">履约中心</p>
          <p class="text-xs text-muted-foreground">供应链运营平台</p>
        </div>
      </div>
      <nav class="flex gap-1 overflow-x-auto p-3 lg:block lg:space-y-1">
        <RouterLink
          v-for="item in navigation"
          :key="item.to"
          :to="item.to"
          class="flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
          :class="{
            'bg-primary !text-white hover:bg-primary hover:!text-white':
              $route.path === item.to || (item.to !== '/' && $route.path.startsWith(`${item.to}/`)),
          }"
        >
          <component :is="item.icon" :size="17" />{{ item.label }}
        </RouterLink>
      </nav>
    </aside>
    <div class="min-w-0">
      <header
        v-if="!isMicroApp"
        class="flex h-16 items-center justify-between border-b border-border bg-card px-5 lg:px-8"
      >
        <div>
          <p class="text-xs text-muted-foreground">供应链运营</p>
          <p class="text-sm font-medium">订单交付全流程管理</p>
        </div>
        <ThemeToggle />
      </header>

      <div v-else class="border-b border-border bg-card px-4 lg:px-8">
        <div class="flex min-h-16 items-center gap-5 overflow-x-auto">
          <div class="hidden shrink-0 border-r border-border pr-5 md:block">
            <p class="text-xs text-muted-foreground">履约中心</p>
            <p class="text-sm font-medium">订单交付全流程管理</p>
          </div>
          <nav class="flex min-w-max flex-1 items-center gap-1 py-2">
            <RouterLink
              v-for="item in navigation"
              :key="item.to"
              :to="item.to"
              class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
              :class="{
                'bg-primary/10 !text-primary':
                  $route.path === item.to ||
                  (item.to !== '/' && $route.path.startsWith(`${item.to}/`)),
              }"
            >
              <component :is="item.icon" :size="16" />{{ item.label }}
            </RouterLink>
          </nav>
          <ThemeToggle class="ml-auto shrink-0" />
        </div>
      </div>

      <RouterView v-slot="{ Component }">
        <KeepAlive include="FulfillmentPlanFormView">
          <component :is="Component" />
        </KeepAlive>
      </RouterView>
    </div>
  </div>
</template>
