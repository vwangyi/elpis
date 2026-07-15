// src/db/services/todoService.ts
import { db } from '../index';
import { TodoItem } from '../models/todo';
import { v4 as uuidv4 } from 'uuid';

/**
 * 站在indexedDB的角度 封装 增删改查 CURD  给Store调用  store给页面调用
 */

export async function getAllByStatus(status: string): Promise<TodoItem[]> {
  return db.todos.where('status').equals(status).toArray();
}

export async function getById(id: string): Promise<TodoItem | undefined> {
  return db.todos.get(id);
}

export async function add(
  item: Omit<TodoItem, 'id' | 'createdAt'>
): Promise<string> {
  const id = uuidv4();
  await db.todos.add({
    ...item,
    id,
    createdAt: Date.now()
  });
  return id;
}

export async function update(
  id: string,
  changes: Partial<TodoItem>
): Promise<number> {
  return db.todos.update(id, changes);
}

export async function remove(id: string): Promise<void> {
  await db.todos.delete(id);
}

export async function bulkCreate(items: TodoItem[]): Promise<void> {
  await db.todos.bulkAdd(items);
}

export async function clearCompleted(): Promise<void> {
  await db.todos.where('status').equals('completed').delete();
}
