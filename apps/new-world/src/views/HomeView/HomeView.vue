<template>
  <div>
    <a-menu
      v-model:openKeys="state.openKeys"
      v-model:selectedKeys="state.selectedKeys"
      style="width: 220px"
      :mode="state.mode"
      :items="items"
      :theme="state.theme"
    ></a-menu>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
const state = reactive({
  mode: 'inline',
  theme: 'light',
  selectedKeys: ['1'],
  openKeys: ['sub1'],
})

const items = ref(
  new Array(10).fill(0).map((item: unknown, index: number) => {
    return {
      key: 'asdfa' + index,
      label: 'asdfaf' + index,
      type: 'safa' + index,
    }
  }),
)
</script>
