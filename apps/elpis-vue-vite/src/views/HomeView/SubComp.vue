<script setup lang="ts">
import { getCurrentInstance } from 'vue';

const vm = getCurrentInstance() || { exposed: null };
const props = defineProps({
  list: {
    type: Array,
    default: () => []
  }
});
// defineExpose({
//     getList: () => props.list
// })
vm.exposed = {
  getList: () => props.list
};
</script>
<template>
  <div>{{ JSON.stringify(props.list) }}</div>
</template>
