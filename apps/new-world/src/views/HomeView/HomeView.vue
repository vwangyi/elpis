<script setup lang="ts">
import { ref, reactive } from 'vue';
const state = reactive({
  mode: 'inline',
  theme: 'light',
  selectedKeys: ['1'],
  openKeys: ['sub1']
});

const items = ref(
  new Array(10000)
    .fill(0)
    .map((item, index) => {
      return {
        key: 'asdfa' + index + item,
        label: 'asdfaf' + index,
        type: 'safa' + index
      };
    })
);
</script>
<template>
  <div
    :style="{
      width: 220 + 'px',
      overflowY: 'scroll'
    }"
  >
    <a-menu
      v-model:open-keys="state.openKeys"
      v-model:selected-keys="
        state.selectedKeys
      "
      style="width: 220px"
      :mode="state.mode"
      :items="items"
      :theme="state.theme"
    ></a-menu>
  </div>
</template>
