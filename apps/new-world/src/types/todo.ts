// 待办实体（与后端 todo.entity.ts 对齐）
export interface Todo {
  id: number;
  title: string;
  description?: string;
  status: number; // 0-未完成 1-已完成
  createTime: string;
  updateTime: string;
}

// 分页查询结果
export interface TodoPageResult {
  list: Todo[];
  total: number;
  page: number;
  pageSize: number;
}

// 新增/更新入参
export interface TodoParams {
  title?: string;
  description?: string;
  status?: number;
}
