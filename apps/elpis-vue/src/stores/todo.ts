import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import * as todoAPI from '@/api/todo';

/* todo模块 */
export const useTodoStore = defineStore('todo', () => {
  const todoList = ref([]);

  async function getTodoList(pageIndex: number, pageSize: number) {
    const dto = await todoAPI.getTodoList(pageIndex, pageSize);
    const vo = ref([]);
    // todoList.value = vo;
    return;
  }

  return {
    todoList,
    getTodoList
  };
});
