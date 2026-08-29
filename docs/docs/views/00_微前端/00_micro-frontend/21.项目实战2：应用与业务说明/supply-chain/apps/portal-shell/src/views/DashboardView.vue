<script setup lang="ts">
import {
  Button,
  Card,
  ChartContainer,
  ChartCrosshair,
  ThemeToggle,
  type ChartConfig,
} from '@supply-chain/ui-vue'
import { VisAxis, VisDonut, VisLine, VisSingleContainer, VisXYContainer } from '@unovis/vue'
import { Activity, AlertTriangle, Boxes, CircleDollarSign, LogOut, Route } from 'lucide-vue-next'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { clearSession, type AuthUser } from '../services/auth'
import { apiClient } from '../services/api'

interface Overview {
  kpis: {
    orderCount: number
    fulfillmentRate: number
    openExceptions: number
    pendingSettlementAmount: number
  }
  orderTrend: { date: string; count: number; amount: number }[]
  fulfillmentDistribution: { status: string; count: number }[]
  risks: { type: string; count: number; level: string }[]
}

const statusText: Record<string, string> = {
  pending_review: '待审核',
  ready_to_ship: '待发运',
  in_transit: '运输中',
  partially_received: '部分签收',
  completed: '已完成',
  exception: '异常',
}

const chartColors = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
]

const orderChartConfig = {
  count: { label: '订单数', color: 'hsl(var(--chart-1))' },
} satisfies ChartConfig

const router = useRouter()
const user = JSON.parse(localStorage.getItem('supply-chain-user') ?? '{}') as Partial<AuthUser>
const overview = ref<Overview | null>(null)
const loading = ref(true)
const errorMessage = ref('')

const money = computed(() =>
  new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    maximumFractionDigits: 0,
  }).format(overview.value?.kpis.pendingSettlementAmount ?? 0),
)

const fulfillmentChartData = computed(() =>
  (overview.value?.fulfillmentDistribution ?? [])
    .filter((item) => item.count > 0)
    .map((item, index) => ({
      ...item,
      label: statusText[item.status] ?? item.status,
      color: chartColors[index % chartColors.length],
    })),
)

function trendX(item: Overview['orderTrend'][number]) {
  return new Date(item.date)
}

function trendY(item: Overview['orderTrend'][number]) {
  return item.count
}

function formatTrendDate(value: number | Date) {
  return new Date(value).toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })
}

function donutValue(item: (typeof fulfillmentChartData.value)[number]) {
  return item.count
}

function donutColor(item: (typeof fulfillmentChartData.value)[number]) {
  return item.color
}

async function loadOverview() {
  loading.value = true
  errorMessage.value = ''
  try {
    overview.value = await apiClient<Overview>('dashboard/overview')
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '经营数据加载失败'
  } finally {
    loading.value = false
  }
}

async function logout() {
  clearSession()
  await router.push('/login')
}

onMounted(() => {
  void loadOverview()
})
</script>

<template>
  <div class="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
    <aside class="bg-slate-950 p-6 text-slate-100">
      <div class="mb-10 flex items-center gap-3 text-lg font-semibold">
        <span class="grid size-10 place-items-center rounded-xl bg-blue-600"
          ><Boxes :size="20"
        /></span>
        <span>供应链协同平台</span>
      </div>
      <nav class="space-y-2 text-sm">
        <div class="rounded-lg bg-white/10 px-3 py-2.5">集团运营驾驶舱</div>
        <div class="px-3 py-2.5 text-slate-400">统一待办中心</div>
        <div class="px-3 py-2.5 text-slate-400">全局业务追踪</div>
        <div class="px-3 py-2.5 text-slate-400">风险预警中心</div>
      </nav>
    </aside>
    <main class="p-6 lg:p-10">
      <header class="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p class="text-sm text-slate-500">集团运营中心 / 总览</p>
          <h1 class="mt-1 text-3xl font-bold tracking-tight">供应链履约与业财协同</h1>
          <p class="mt-2 text-slate-500">实时观察订单、履约、结算和经营风险。</p>
        </div>
        <div class="flex items-center gap-3">
          <ThemeToggle />
          <div class="text-right">
            <p class="text-sm font-medium">{{ user.displayName ?? '平台用户' }}</p>
            <p class="text-xs text-slate-500">{{ user.organization?.name ?? '集团运营中心' }}</p>
          </div>
          <Button variant="outline" size="sm" @click="logout"
            ><LogOut class="mr-2" :size="15" />退出</Button
          >
        </div>
      </header>

      <Card v-if="errorMessage" class="mb-6 border-rose-200 p-4 text-rose-600">
        {{ errorMessage }}
        <Button class="ml-3" size="sm" variant="outline" @click="loadOverview">重新加载</Button>
      </Card>

      <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card class="p-5">
          <Activity class="text-blue-600" :size="22" />
          <p class="mt-4 text-sm text-slate-500">订单总量</p>
          <p class="mt-1 text-3xl font-semibold">{{ loading ? '—' : overview?.kpis.orderCount }}</p>
        </Card>
        <Card class="p-5">
          <Route class="text-emerald-600" :size="22" />
          <p class="mt-4 text-sm text-slate-500">履约完成率</p>
          <p class="mt-1 text-3xl font-semibold">
            {{ loading ? '—' : `${overview?.kpis.fulfillmentRate}%` }}
          </p>
        </Card>
        <Card class="p-5">
          <AlertTriangle class="text-rose-600" :size="22" />
          <p class="mt-4 text-sm text-slate-500">未关闭异常</p>
          <p class="mt-1 text-3xl font-semibold">
            {{ loading ? '—' : overview?.kpis.openExceptions }}
          </p>
        </Card>
        <Card class="p-5">
          <CircleDollarSign class="text-violet-600" :size="22" />
          <p class="mt-4 text-sm text-slate-500">待结算金额</p>
          <p class="mt-1 text-2xl font-semibold">{{ loading ? '—' : money }}</p>
        </Card>
      </section>

      <section class="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card class="p-6">
          <h2 class="font-semibold">订单趋势</h2>
          <p class="mt-1 text-sm text-slate-500">按订单日期统计新增销售订单</p>
          <ChartContainer :config="orderChartConfig" class="mt-3 h-72">
            <VisXYContainer :data="overview?.orderTrend ?? []">
              <VisLine :x="trendX" :y="trendY" :color="orderChartConfig.count.color" />
              <VisAxis type="x" :x="trendX" :tick-format="formatTrendDate" :grid-line="false" />
              <VisAxis type="y" :tick-line="false" :domain-line="false" />
              <ChartCrosshair
                :colors="[orderChartConfig.count.color]"
                index="date"
                :items="[{ name: 'count', label: '订单数' }]"
              />
            </VisXYContainer>
          </ChartContainer>
        </Card>
        <Card class="p-6">
          <h2 class="font-semibold">履约状态分布</h2>
          <p class="mt-1 text-sm text-slate-500">展示订单在履约链路中的当前位置</p>
          <ChartContainer :config="{}" class="mt-3 h-72">
            <VisSingleContainer :data="fulfillmentChartData" class="h-56">
              <VisDonut :value="donutValue" :color="donutColor" :arc-width="28" />
            </VisSingleContainer>
            <div class="flex flex-wrap justify-center gap-x-4 gap-y-2">
              <span
                v-for="item in fulfillmentChartData"
                :key="item.status"
                class="flex items-center gap-1.5 text-xs text-muted-foreground"
              >
                <span class="size-2.5 rounded-sm" :style="{ backgroundColor: item.color }"></span>
                {{ item.label }} {{ item.count }}
              </span>
            </div>
          </ChartContainer>
        </Card>
      </section>

      <Card class="mt-6 p-6">
        <h2 class="font-semibold">风险预警</h2>
        <div class="mt-4 grid gap-3 md:grid-cols-3">
          <div
            v-for="risk in overview?.risks"
            :key="risk.type"
            class="flex items-center justify-between rounded-xl border border-slate-200 p-4 dark:border-slate-800"
          >
            <span class="text-sm">{{ risk.type }}</span>
            <strong
              :class="
                risk.level === 'high'
                  ? 'text-rose-600'
                  : risk.level === 'medium'
                    ? 'text-amber-600'
                    : 'text-blue-600'
              "
              >{{ risk.count }}</strong
            >
          </div>
        </div>
      </Card>
    </main>
  </div>
</template>
