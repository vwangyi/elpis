import Dexie, { Table } from 'dexie';
import { TodoItem } from './models/todo.ts';

export class AppDatabase extends Dexie {
  todos!: Table<TodoItem, string>; // 主键为 string (如 uuid)
  drafts!: Table<{ id?: number; content: string; updatedAt: number }>;

  constructor() {
    super('MyAppDB');

    // 版本 1：初始化表
    this.version(1).stores({
      todos: 'id, status, createdAt', // 索引字段
      drafts: '++id, updatedAt' // 自增主键 + 索引
    });

    // 版本 2：新增表或索引变更
    this.version(2)
      .stores({
        todos: 'id, status, createdAt, priority' // 新增 priority 索引
      })
      .upgrade(async tx => {
        // 迁移数据：为新字段设默认值
        await tx
          .table('todos')
          .toCollection()
          .modify(todo => {
            if (todo.priority === undefined) todo.priority = 'normal';
          });
      });
  }
}

// 单例导出
export const db = new AppDatabase();
