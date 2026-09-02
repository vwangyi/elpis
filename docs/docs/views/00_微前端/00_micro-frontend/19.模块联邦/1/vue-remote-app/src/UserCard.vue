<script setup>
defineProps({
  name: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["confirm"]);
</script>

<template>
  <article class="vue-user-card">
    <span>VUE REMOTE</span>
    <h2>你好，{{ name }}</h2>
    <p>这是 Vue 子应用直接暴露的单文件组件。</p>
    <button type="button" @click="emit('confirm', `Vue 子应用已收到 ${name} 的操作`)">
      确认收到
    </button>
  </article>
</template>

<style scoped>
.vue-user-card { padding: 20px; border: 1px solid #a7f3d0; border-radius: 12px; background: #ecfdf5; }
.vue-user-card span { color: #047857; font-size: 11px; font-weight: 900; letter-spacing: .08em; }
.vue-user-card h2 { margin: 8px 0; color: #064e3b; }
.vue-user-card p { margin: 0 0 14px; color: #477264; }
.vue-user-card button { background: #059669; }
</style>
