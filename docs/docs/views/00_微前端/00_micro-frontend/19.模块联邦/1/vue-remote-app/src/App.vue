<script setup>
import UserCard from "./UserCard.vue";
</script>

<template>
  <main class="page">
    <p class="eyebrow">Vue Remote · localhost:5301</p>
    <h1>Vue 子应用</h1>
    <p>它可以独立运行，也可以把 UserCard 组件交给 Vue 主应用。</p>
    <UserCard name="独立访问者" />
  </main>
</template>
