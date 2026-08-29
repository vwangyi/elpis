<script setup>
import { markRaw, onMounted, shallowRef } from "vue";

defineProps({
  warehouse: { type: String, required: true },
  operator: { type: String, required: true },
});

const emit = defineEmits(["follow-order"]);
const remoteComponent = shallowRef(null);
const status = shallowRef("loading");
const errorMessage = shallowRef("");

async function loadRemote() {
  status.value = "loading";
  errorMessage.value = "";
  try {
    const remoteModule = await import("orderApp/OrderOverview");
    remoteComponent.value = markRaw(remoteModule.default);
    status.value = "ready";
  } catch (error) {
    status.value = "error";
    errorMessage.value = error instanceof Error ? error.message : String(error);
  }
}

onMounted(loadRemote);
</script>

<template>
  <div v-if="status === 'loading'" class="remote-state">
    <span class="loading-dot"></span>
    <div><strong>正在加载订单数据</strong><small>请稍候</small></div>
  </div>
  <div v-else-if="status === 'error'" class="remote-state remote-error" role="alert">
    <div><strong>订单服务加载失败</strong><small>{{ errorMessage }}</small></div>
    <button type="button" @click="loadRemote">重试</button>
  </div>
  <component
    :is="remoteComponent"
    v-else
    :warehouse="warehouse"
    :operator="operator"
    @follow-order="emit('follow-order', $event)"
  />
</template>
