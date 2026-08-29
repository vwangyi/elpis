<script setup lang="ts">
import { ThemeToggle } from '@supply-chain/ui-vue'
import { Boxes, ChartNoAxesCombined, ShieldCheck, Workflow } from 'lucide-vue-next'
</script>

<template>
  <main class="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
    <section class="hidden bg-slate-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
      <div class="flex items-center gap-3 text-lg font-semibold">
        <span class="grid size-10 place-items-center rounded-xl bg-blue-600"
          ><Boxes :size="20"
        /></span>
        集团供应链协同平台
      </div>
      <div class="max-w-xl">
        <p class="text-sm font-medium uppercase tracking-[0.24em] text-blue-400">
          Supply Chain Control Tower
        </p>
        <h1 class="mt-5 text-4xl font-semibold leading-tight">
          连接订单履约与财务结算，统一掌握集团经营状态
        </h1>
        <div class="mt-10 grid gap-4 sm:grid-cols-3">
          <div class="rounded-xl border border-white/10 bg-white/5 p-4">
            <Workflow class="text-blue-400" :size="22" />
            <p class="mt-3 text-sm">端到端履约协同</p>
          </div>
          <div class="rounded-xl border border-white/10 bg-white/5 p-4">
            <ChartNoAxesCombined class="text-violet-400" :size="22" />
            <p class="mt-3 text-sm">集团运营洞察</p>
          </div>
          <div class="rounded-xl border border-white/10 bg-white/5 p-4">
            <ShieldCheck class="text-emerald-400" :size="22" />
            <p class="mt-3 text-sm">统一安全治理</p>
          </div>
        </div>
      </div>
      <p class="text-sm text-slate-500">Enterprise Supply Chain Collaboration Platform</p>
    </section>
    <section class="relative flex items-center justify-center p-6 sm:p-10">
      <div class="absolute right-6 top-6"><ThemeToggle /></div>
      <slot />
    </section>
  </main>
</template>
