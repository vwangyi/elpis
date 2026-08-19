import { ref } from 'vue';
import { defineStore } from 'pinia';
import * as todoAPI from '@/api/todo';
import type { Todo, TodoPageResult, TodoParams } from '@/types/todo';
import type { ApiResponse } from '@/utils/request';

/* todo 模块 */
export const useTodoStore = defineStore('todo', () => {
  // 总条数（分页用）
  const todoTotal = ref<number>(0);
  // 当前页 / 每页条数
  const page = ref<number>(1);
  const pageSize = ref<number>(10);
  // 加载状态
  const loading = ref<boolean>(false);

  // 输入框内容
  const todoInp = ref<string>('');
  function updateTodoInp(val: string) {
    todoInp.value = val;
  }

  // 查询待办列表
  const todoList = ref<Todo[]>([]);
  async function findAll(
    p?: number,
    ps?: number,
    title?: string,
    status?: number
  ): Promise<ApiResponse<TodoPageResult>> {
    loading.value = true;
    try {
      const curPage = p ?? page.value;
      const curPageSize = ps ?? pageSize.value;
      const res = await todoAPI.findAll({
        page: curPage,
        pageSize: curPageSize,
        title,
        status
      });
      if (res.success && res.data) {
        todoList.value = res.data.list || [];
        todoTotal.value = res.data.total || 0;
        page.value = curPage;
        pageSize.value = curPageSize;
      }
      return res;
    } finally {
      loading.value = false;
    }
  }

  // 查询单个待办
  async function findOne(id: number): Promise<ApiResponse<Todo>> {
    return await todoAPI.findOne(id);
  }

  // 新增待办
  async function createTodo(data: TodoParams): Promise<ApiResponse<Todo>> {
    const res = await todoAPI.createTodo(data);
    if (res.success) {
      // 新增成功后刷新当前页列表
      await findAll(page.value, pageSize.value);
    }
    return res;
  }

  // 更新待办
  async function updateTodo(
    id: number,
    data: TodoParams
  ): Promise<ApiResponse<Todo>> {
    const res = await todoAPI.updateTodo(id, data);
    if (res.success) {
      // 本地同步更新，避免额外请求
      const idx = todoList.value.findIndex(t => t.id === id);
      if (idx > -1 && res.data) {
        todoList.value[idx] = res.data;
      }
    }
    return res;
  }

  // 删除待办
  async function removeTodo(id: number): Promise<ApiResponse<null>> {
    const res = await todoAPI.removeTodo(id);
    if (res.success) {
      // 本地移除，同步总数
      todoList.value = todoList.value.filter(t => t.id !== id);
      todoTotal.value = Math.max(0, todoTotal.value - 1);
    }
    return res;
  }

  return {
    todoInp,
    todoList,
    todoTotal,
    page,
    pageSize,
    loading,
    updateTodoInp,
    findAll,
    findOne,
    createTodo,
    updateTodo,
    removeTodo
  };
});
