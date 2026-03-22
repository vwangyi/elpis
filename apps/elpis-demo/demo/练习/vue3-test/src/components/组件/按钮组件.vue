<script setup>
const props = defineProps({
  loading: Boolean,
  loadingText: String,
})
const emits = defineEmits(['click'])

function onClick(e) {
  if (props.loading) {
    return
  }
  emits('click', e)
}
</script>

<template>
  <div
    :class="{
      button: true,
      loading: props.loading,
    }"
    @click="onClick"
  >
    <template v-if="props.loading">
      <el-icon class="loading" color="#fff">
        <Loading />
      </el-icon>
      <span>{{ props.loadingText }}</span>
    </template>

    <template v-else>
      <slot />
    </template>
  </div>
</template>

<style scoped>
.button {
  background: #00f;
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 4px;
  color: #fff;
  user-select: none;
}

.button.loading {
  cursor: not-allowed;
}

.button .loading {
  animation: rotate 2s linear infinite;
}
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
