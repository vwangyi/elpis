<script setup lang="ts">
import { ThemeToggle } from '@supply-chain/ui-vue'
import {
  Boxes,
  ChartNoAxesCombined,
  CircleDollarSign,
  LayoutGrid,
  LogOut,
  Truck,
} from 'lucide-vue-next'
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { getSessionUser } from '@supply-chain/auth-session'

import { microAppBadges } from './micro-app-badges'
import { clearMicroAppCache } from './micro-apps'
import { clearMicroAppRoutes, resolveMicroAppRoute } from './micro-router-host'
import { clearSession } from './services/auth'

const route = useRoute()
const router = useRouter()
const showPlatformShell = computed(() => !route.meta.public)
const user = computed(() => (route.fullPath ? getSessionUser() : null))

const platformNavigation = [{ to: '/', label: '运营驾驶舱', icon: ChartNoAxesCombined }]
const businessNavigation = [
  {
    appName: 'fulfillmentApp',
    to: '/fulfillment',
    label: '履约中心',
    icon: Truck,
    badgeKey: 'fulfillment' as const,
  },
  {
    appName: 'settlementApp',
    to: '/settlement',
    label: '结算中心',
    icon: CircleDollarSign,
    badgeKey: 'settlement' as const,
  },
]

const pageTitle = computed(() => {
  if (route.path.startsWith('/fulfillment')) return '履约中心'
  if (route.path.startsWith('/settlement')) return '结算中心'
  return '运营驾驶舱'
})

function isActive(to: string) {
  return to === '/' ? route.path === '/' : route.path === to || route.path.startsWith(`${to}/`)
}

function getMicroAppTarget(appName: string, fallback: string) {
  return resolveMicroAppRoute(appName, fallback)
}

async function logout() {
  clearSession()
  clearMicroAppRoutes()
  await clearMicroAppCache()
  await router.push('/login')
}
</script>

<template>
  <RouterView v-if="!showPlatformShell" />

  <div
    v-else
    class="min-h-screen bg-background text-foreground lg:grid lg:grid-cols-[248px_minmax(0,1fr)]"
  >
    <aside
      class="border-b border-slate-800 bg-slate-950 text-slate-100 lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r"
    >
      <RouterLink to="/" class="flex h-16 items-center gap-3 border-b border-white/10 px-5">
        <span class="grid size-9 place-items-center rounded-lg bg-blue-600">
          <Boxes :size="18" />
        </span>
        <div>
          <p class="font-semibold">供应链协同平台</p>
          <p class="text-xs text-slate-400">集团运营工作台</p>
        </div>
      </RouterLink>

      <div class="flex gap-4 overflow-x-auto p-3 lg:block lg:space-y-7 lg:p-4">
        <nav class="min-w-max space-y-1 lg:min-w-0">
          <p
            class="mb-2 flex items-center gap-2 px-3 text-[11px] font-medium uppercase tracking-wider text-slate-500"
          >
            <LayoutGrid :size="13" />平台工作台
          </p>
          <RouterLink
            v-for="item in platformNavigation"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
            :class="{ 'bg-white/10 !text-white': isActive(item.to) }"
          >
            <component :is="item.icon" :size="17" />
            <span>{{ item.label }}</span>
          </RouterLink>
        </nav>

        <nav class="min-w-max space-y-1 lg:min-w-0">
          <p
            class="mb-2 flex items-center gap-2 px-3 text-[11px] font-medium uppercase tracking-wider text-blue-300/70"
          >
            <Boxes :size="13" />业务应用
          </p>
          <RouterLink
            v-for="item in businessNavigation"
            :key="item.to"
            :to="getMicroAppTarget(item.appName, item.to)"
            class="group flex items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 text-sm text-slate-300 transition hover:border-blue-400/20 hover:bg-blue-500/10 hover:text-white"
            :class="{ 'border-blue-400/30 bg-blue-500/15 !text-white': isActive(item.to) }"
          >
            <span
              class="grid size-7 place-items-center rounded-md bg-blue-500/10 text-blue-300 group-hover:bg-blue-500/20"
            >
              <component :is="item.icon" :size="16" />
            </span>
            <span class="flex-1">{{ item.label }}</span>
            <span
              v-if="microAppBadges[item.badgeKey] > 0"
              class="grid min-w-5 place-items-center rounded-full bg-rose-500 px-1.5 text-[11px] font-semibold leading-5 text-white"
            >
              {{ microAppBadges[item.badgeKey] > 99 ? '99+' : microAppBadges[item.badgeKey] }}
            </span>
          </RouterLink>
        </nav>
      </div>
    </aside>

    <div class="min-w-0">
      <header
        class="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b border-border bg-card/95 px-5 backdrop-blur lg:px-8"
      >
        <div>
          <p class="text-xs text-muted-foreground">集团供应链协同平台</p>
          <p class="text-sm font-semibold">{{ pageTitle }}</p>
        </div>
        <div class="flex items-center gap-3">
          <ThemeToggle />
          <div class="portal-shell-user text-right">
            <p class="text-sm font-medium">{{ user?.displayName ?? '平台用户' }}</p>
            <p class="text-xs text-muted-foreground">
              {{ user?.organization.name ?? '集团运营中心' }}
            </p>
          </div>
          <button
            type="button"
            class="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground"
            @click="logout"
          >
            <LogOut :size="16" /><span class="portal-shell-logout-label">退出</span>
          </button>
        </div>
      </header>

      <RouterView v-if="!route.meta.microApp" />
      <main v-show="route.meta.microApp" class="min-h-[calc(100vh-4rem)]">
        <section id="micro-app-fulfillment" class="min-h-[calc(100vh-4rem)]"></section>
        <section id="micro-app-settlement" class="min-h-[calc(100vh-4rem)]"></section>
      </main>
    </div>
  </div>
</template>
