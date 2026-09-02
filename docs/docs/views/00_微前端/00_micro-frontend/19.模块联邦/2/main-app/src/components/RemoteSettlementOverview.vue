<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from "vue";

const props = defineProps({
  operator: { type: String, required: true },
  currency: { type: String, required: true },
});
const emit = defineEmits(["open-task"]);

const container = ref(null);
const status = ref("loading");
const errorMessage = ref("");
let disposeRemote = null;
let updateRemote = null;

async function mountRemote() {
  status.value = "loading";
  errorMessage.value = "";
  try {
    const { mountSettlementOverview } = await import(
      "financeApp/mountSettlementOverview"
    );
    const controls = mountSettlementOverview(container.value, {
      operator: props.operator,
      currency: props.currency,
      onOpenTask: (payload) => emit("open-task", payload),
    });
    disposeRemote = controls.unmount;
    updateRemote = controls.update;
    status.value = "ready";
  } catch (error) {
    status.value = "error";
    errorMessage.value = error instanceof Error ? error.message : String(error);
  }
}

watch(
  () => [props.operator, props.currency],
  () => updateRemote?.({ operator: props.operator, currency: props.currency }),
);

onMounted(mountRemote);
onBeforeUnmount(() => disposeRemote?.());
</script>

<template>
  <div v-show="status === 'ready'" ref="container"></div>
  <div v-if="status === 'loading'" class="remote-state">
    <span class="loading-dot"></span>
    <div><strong>正在加载财务数据</strong><small>请稍候</small></div>
  </div>
  <div v-if="status === 'error'" class="remote-state remote-error" role="alert">
    <div><strong>财务服务加载失败</strong><small>{{ errorMessage }}</small></div>
    <button type="button" @click="mountRemote">重试</button>
  </div>
</template>
