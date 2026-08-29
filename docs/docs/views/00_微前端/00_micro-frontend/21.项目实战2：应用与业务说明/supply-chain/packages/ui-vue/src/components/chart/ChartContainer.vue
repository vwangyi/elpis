<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'

import type { ChartConfig } from './types'

const props = defineProps<{ config: ChartConfig; class?: string }>()

const style = computed(
  () =>
    Object.fromEntries(
      Object.entries(props.config).map(([key, item]) => [`--color-${key}`, item.color]),
    ) as CSSProperties,
)
</script>

<template>
  <div :class="['shadcn-chart min-h-48 w-full text-xs', props.class]" :style="style">
    <slot />
  </div>
</template>
