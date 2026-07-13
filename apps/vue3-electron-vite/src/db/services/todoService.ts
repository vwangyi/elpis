import { db } from '../index';
import { TodoItem } from '../models/todo';
import { v4 as uuidv4 } from 'uuid';

export const todoService = {
  async getAllByStatus(status: string): Promise<TodoItem[]> {
    return db.todos.where('status').equals(status).toArray();
  },

  async getById(id: string): Promise<TodoItem | undefined> {
    return db.todos.get(id);
  },

  async add(item: Omit<TodoItem, 'id' | 'createdAt'>): Promise<string> {
    const id = uuidv4();
    await db.todos.add({
      ...item,
      id,
      createdAt: Date.now()
    });
    return id;
  },

  async update(id: string, changes: Partial<TodoItem>): Promise<number> {
    return db.todos.update(id, changes);
  },

  async delete(id: string): Promise<void> {
    await db.todos.delete(id);
  },

  async bulkCreate(items: TodoItem[]): Promise<void> {
    await db.todos.bulkAdd(items);
  },

  async clearCompleted(): Promise<void> {
    await db.todos.where('status').equals('completed').delete();
  }
};
