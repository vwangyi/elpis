<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import { cn } from '../lib/utils'

withDefaults(
  defineProps<{
    modelValue?: string
    type?: string
    placeholder?: string
    autocomplete?: string
    disabled?: boolean
    class?: HTMLAttributes['class']
  }>(),
  {
    modelValue: '',
    type: 'text',
    placeholder: '',
    autocomplete: 'off',
    disabled: false,
    class: '',
  },
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <input
    :value="modelValue"
    :type="type"
    :placeholder="placeholder"
    :autocomplete="autocomplete"
    :disabled="disabled"
    :class="
      cn(
        'flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50',
        $props.class,
      )
    "
    @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>
