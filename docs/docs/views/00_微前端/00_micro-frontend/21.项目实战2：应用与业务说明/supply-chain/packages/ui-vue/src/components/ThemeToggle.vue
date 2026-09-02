<script setup lang="ts">
import {
  getResolvedTheme,
  initializeTheme,
  THEME_CHANGE_EVENT,
  toggleTheme,
  type ResolvedTheme,
} from '@supply-chain/design-tokens/theme'
import { Moon, Sun } from 'lucide-vue-next'
import { onBeforeUnmount, onMounted, ref } from 'vue'

import Button from './Button.vue'

const currentTheme = ref<ResolvedTheme>('light')

function syncTheme() {
  currentTheme.value = getResolvedTheme()
}

function handleToggle() {
  currentTheme.value = toggleTheme()
}

onMounted(() => {
  currentTheme.value = initializeTheme()
  window.addEventListener(THEME_CHANGE_EVENT, syncTheme)
})

onBeforeUnmount(() => window.removeEventListener(THEME_CHANGE_EVENT, syncTheme))
</script>

<template>
  <Button
    variant="outline"
    size="sm"
    :aria-label="currentTheme === 'dark' ? '切换为浅色主题' : '切换为深色主题'"
    @click="handleToggle"
  >
    <Sun v-if="currentTheme === 'dark'" :size="16" />
    <Moon v-else :size="16" />
  </Button>
</template>
