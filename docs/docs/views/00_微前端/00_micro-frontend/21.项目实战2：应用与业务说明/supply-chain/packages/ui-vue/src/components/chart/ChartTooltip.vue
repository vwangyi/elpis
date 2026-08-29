<script setup lang="ts">
defineProps<{
  title?: string
  data: { name: string; color?: string; value: unknown }[]
}>()
</script>

<template>
  <div class="min-w-36 rounded-lg border border-border bg-background px-3 py-2 text-xs shadow-xl">
    <p v-if="title" class="mb-2 font-medium">{{ title }}</p>
    <div class="grid gap-1.5">
      <div v-for="item in data" :key="item.name" class="flex items-center justify-between gap-4">
        <span class="flex items-center gap-2 text-muted-foreground">
          <span class="size-2.5 rounded-sm" :style="{ backgroundColor: item.color }"></span>
          {{ item.name }}
        </span>
        <span class="font-mono font-medium tabular-nums">{{ item.value }}</span>
      </div>
    </div>
  </div>
</template>
