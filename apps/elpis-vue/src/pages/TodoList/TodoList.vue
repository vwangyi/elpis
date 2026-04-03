<script setup lang="ts">
import TodoList from '@/components/TodoList/TodoList.vue';
</script>

<template>
  <div class="home">
    <div class="todolist">
      <TodoList />
    </div>
  </div>
</template>

<style scoped>
.home {
  width: 100%;
  height: 100%;
}
.todolist {
  width: 80vw;
  height: 80vh;
}
</style>
