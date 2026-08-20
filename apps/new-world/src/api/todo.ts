import request from '@/api/request';
import type { ApiResponse } from '@/api/request';
import type { Todo, TodoPageResult, TodoParams } from '@/types/todo';

// 查询待办列表（分页 + 可选筛选）
// GET /todo?page=1&pageSize=10&title=xxx&status=0
export function findAll(params: {
  page?: number | undefined;
  pageSize?: number | undefined;
  title?: string | undefined;
  status?: number | undefined;
}): Promise<ApiResponse<TodoPageResult>> {
  return request.get('/api/todo', { query: params });
}

// 查询单个待办
// GET /todo/:id
export function findOne(id: number): Promise<ApiResponse<Todo>> {
  return request.get(`/api/todo/${id}`);
}

// 新增待办
// POST /todo  body: { title, description?, status? }
export function createTodo(data: TodoParams): Promise<ApiResponse<Todo>> {
  return request.post('/api/todo', { data });
}

// 更新待办
// PATCH /todo/:id  body: { title?, description?, status? }
export function updateTodo(
  id: number,
  data: TodoParams
): Promise<ApiResponse<Todo>> {
  return request.patch(`/api/todo/${id}`, { data });
}

// 删除待办
// DELETE /todo/:id
export function removeTodo(id: number): Promise<ApiResponse<null>> {
  return request.delete(`/api/todo/${id}`);
}
