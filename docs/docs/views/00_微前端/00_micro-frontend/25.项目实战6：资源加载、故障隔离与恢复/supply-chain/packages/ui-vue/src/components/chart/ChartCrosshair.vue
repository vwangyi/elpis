<script setup lang="ts">
import { VisCrosshair, VisTooltip } from '@unovis/vue'
import { createApp } from 'vue'

import ChartTooltip from './ChartTooltip.vue'

const props = defineProps<{
  colors: string[]
  index: string
  items: { name: string; label: string; color?: string }[]
}>()

const cache = new WeakMap<object, string>()

function template(value: unknown) {
  if (!value || typeof value !== 'object') return ''
  if (cache.has(value)) return cache.get(value) ?? ''

  const datum = value as Record<string, unknown>
  const element = document.createElement('div')
  const data = props.items.map((item, index) => ({
    name: item.label,
    color: item.color ?? props.colors[index],
    value: datum[item.name],
  }))
  createApp(ChartTooltip, { title: String(datum[props.index] ?? ''), data }).mount(element)
  cache.set(value, element.innerHTML)
  return element.innerHTML
}

function color(_value: unknown, index: number) {
  return props.colors[index] ?? 'transparent'
}
</script>

<template>
  <VisTooltip :horizontal-shift="20" :vertical-shift="20" />
  <VisCrosshair :template="template" :color="color" />
</template>
