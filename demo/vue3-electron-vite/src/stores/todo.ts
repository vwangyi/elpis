// stores/todoStore.ts
import { defineStore } from 'pinia';
import { ref, shallowRef, computed } from 'vue';
import { todoService } from '@/db/services/todoService';
import { db } from '@/db';
import type { TodoItem } from '@/db/models/todo';

export const useTodoStore = defineStore('todo', () => {
  // --- state ---
  const todos = shallowRef<TodoItem[]>([]);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  // 分页/搜索参数也可以放在 state
  const keyword = ref('');
  const currentPage = ref(1);
  const pageSize = 20;

  // --- getters ---
  const completedCount = computed(
    () => todos.value.filter(t => t.status === 'completed').length
  );
  const isEmpty = computed(() => todos.value.length === 0);

  // --- actions ---
  async function loadTodos(status?: string) {
    loading.value = true;
    error.value = null;
    try {
      todos.value = status
        ? await todoService.getAllByStatus(status)
        : await db.todos.toArray();
    } catch (e) {
      error.value = e as Error;
    } finally {
      loading.value = false;
    }
  }

  async function addTodo(item: Omit<TodoItem, 'id' | 'createdAt'>) {
    const id = await todoService.add(item);
    await loadTodos(); // 也可乐观更新
    return id;
  }

  async function removeTodo(id: string) {
    await todoService.delete(id);
    // 乐观删除
    todos.value = todos.value.filter(t => t.id !== id);
  }

  async function toggleStatus(todo: TodoItem) {
    const newStatus = todo.status === 'completed' ? 'active' : 'completed';
    const idx = todos.value.findIndex(t => t.id === todo.id);
    if (idx !== -1) {
      todos.value[idx] = { ...todos.value[idx], status: newStatus };
    }
    try {
      await db.todos.update(todo.id, { status: newStatus });
    } catch {
      if (idx !== -1) {
        todos.value[idx] = { ...todos.value[idx], status: todo.status };
      }
    }
  }

  // 分页加载
  async function loadPage(page: number, kw?: string) {
    if (kw !== undefined) keyword.value = kw;
    currentPage.value = page;
    loading.value = true;
    try {
      let collection = db.todos.orderBy('createdAt');
      if (keyword.value) {
        collection = collection.filter(t => t.title.includes(keyword.value));
      }
      const offset = (currentPage.value - 1) * pageSize;
      todos.value = await collection.offset(offset).limit(pageSize).toArray();
    } catch (e) {
      error.value = e as Error;
    } finally {
      loading.value = false;
    }
  }

  return {
    // state
    todos,
    loading,
    error,
    keyword,
    currentPage,
    // getters
    completedCount,
    isEmpty,
    // actions
    loadTodos,
    addTodo,
    removeTodo,
    toggleStatus,
    loadPage
  };
});
