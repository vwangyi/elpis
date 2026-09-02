<script setup lang="ts">
import { Button } from '@supply-chain/ui-vue'
import { RefreshCw } from 'lucide-vue-next'

defineProps<{ title: string; description: string; loading?: boolean }>()
defineEmits<{ refresh: [] }>()
</script>

<template>
  <header class="mb-6 flex flex-wrap items-start justify-between gap-4">
    <div>
      <h1 class="text-2xl font-bold tracking-tight">{{ title }}</h1>
      <p class="mt-1 text-sm text-muted-foreground">{{ description }}</p>
    </div>
    <Button variant="outline" :disabled="loading" @click="$emit('refresh')">
      <RefreshCw class="mr-2" :size="16" />刷新数据
    </Button>
  </header>
</template>
