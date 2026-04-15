<script setup lang="ts">
import TodoList from '@/components/TodoList/TodoList.vue';
import { useTodoStore } from '@/stores/todo';
const todoStore = useTodoStore();

todoStore.getTodoList(1, 3);
</script>

<template>
  <div class="home">
    <div class="todolist">
      <!-- <TodoList /> -->
      {{ todoStore.todoList }}
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
