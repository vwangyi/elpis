// 定义实体模型 （也就是定义表字段）
export interface Note {
  id?: number; // 自增主键（Dexie 建议用 ++）
  title: string;
  content: string;
  updatedAt: number;
  is_delete: 0 | 1;
}

interface Friend {
  id: number;
  name: string;
  age: number;
}

export type { Friend };
