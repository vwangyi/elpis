<!-- components/Dashboard.vue -->
<template>
  <div class="dashboard">
    <h2>📊 控制面板</h2>
    <p>欢迎回来，{{ userInfo?.name }}</p>
    <p>这是只有登录用户才能看到的内容</p>
    <button @click="emit('refresh')">刷新数据</button>
  </div>
</template>

<script setup>
defineProps({
  userInfo: {
    type: Object,
    default: () => ({ name: '用户' })
  }
});

const emit = defineEmits(['refresh']);
</script>

<style scoped>
.dashboard {
  padding: 20px;
  background: #f0f9ff;
  border-radius: 8px;
  border: 1px solid #b3d9ff;
}
</style>
