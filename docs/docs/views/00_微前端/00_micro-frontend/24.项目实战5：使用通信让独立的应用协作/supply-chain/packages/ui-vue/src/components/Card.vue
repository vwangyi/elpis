<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import { cn } from '../lib/utils'

defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <section :class="cn('rounded-xl border border-border bg-card shadow-sm', $props.class)">
    <slot />
  </section>
</template>
