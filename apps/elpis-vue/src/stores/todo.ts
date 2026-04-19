import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import * as todoAPI from '@/api/todo';
import type { Todo } from '@/types/todo';

/* todo模块 */
export const useTodoStore = defineStore('todo', () => {
  const todoList = ref<Todo[]>([]);
  const todoTotal = ref<number>(0);

  async function createTodo(data: Todo) {
    const vto = await todoAPI.createTodo(data);
    return { ...vto, data: null };
  }

  async function findAll(pageIndex: number, pageSize: number) {
    const dto = await todoAPI.findAll(pageIndex, pageSize);
    todoList.value = dto?.data?.list || [];
    todoTotal.value = dto?.data?.total || 0;
    return { ...dto, data: null };
  }

  return {
    todoList,
    createTodo,
    findAll
  };
});
