在 Vue3 项目中引入 IndexedDB，核心思路是将其封装为可复用、可测试、与 UI 解耦的持久化服务。下面从架构设计、库选型、数据模型、Vue 集成、版本迁移到性能优化，给出完整方案。

---

1. 为什么需要 IndexedDB？

· 存储容量大：通常可用空间的 50% 以上，远超 LocalStorage 的 5MB。
· 异步非阻塞：所有操作均异步，不卡 UI。
· 结构化存储：支持对象存储、索引、事务，可做复杂查询。
· 离线优先：作为本地数据库，支撑离线编辑、草稿保存、数据缓存。

适用场景：大体积 JSON 数据、离线编辑、消息列表、用户草稿、前端数据仓库、大型表单暂存等。

---

2. 技术选型：原生 or 封装库？

方案 优点 缺点
原生 IndexedDB API 无依赖 回调地狱，事务易错，版本升级复杂
idb (轻量 Promise 封装) 体积小，标准 Promise 仍需手动管理 Schema 和迁移
Dexie.js ✅ 语法简洁、链式调用、版本迁移优雅、TypeScript 支持好 库体积 ~30KB gzipped

强烈推荐 Dexie.js，它能让 IndexedDB 代码接近 SQL/MongoDB 的查询体验。

```bash
npm install dexie
```

---

3. 目录结构设计

将数据层完全隔离，组件只调用 Service 方法。

```
src/
├── db/
│   ├── index.ts          # 数据库实例，单例导出
│   ├── models/           # 表结构定义（Dexie Table 类型）
│   │   └── todo.ts
│   ├── services/         # 业务数据操作服务
│   │   └── todoService.ts
│   └── migrations/       # 版本迁移逻辑（可选，或直接在 db 类中写）
├── composables/          # 组合式函数，连接 Service 与响应式状态
│   └── useTodoDatabase.ts
└── ...
```

---

4. 数据库定义与版本管理

使用 Dexie 声明式定义数据库，每个版本升级通过 version().stores() 管理。

```typescript
// src/db/index.ts
import Dexie, { Table } from 'dexie';
import { TodoItem } from './models/todo';

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
```

关键点：版本号只能升不能降，每次 Schema 变更递增版本号，并在 upgrade 中处理存量数据。

---

5. 业务服务层封装

服务层负责所有 CRUD 细节，对外暴露纯数据方法，不掺杂 UI 逻辑。

```typescript
// src/db/services/todoService.ts
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
```

---

6. Vue3 集成：响应式状态与组合式函数

IndexedDB 操作是异步的，需要与 Vue 的响应式系统桥接。推荐使用 composable 封装：

```typescript
// src/composables/useTodoDatabase.ts
import { ref, computed, shallowRef } from 'vue';
import { todoService } from '@/db/services/todoService';
import type { TodoItem } from '@/db/models/todo';

export function useTodoDatabase() {
  const todos = shallowRef<TodoItem[]>([]); // 大数组用 shallowRef 优化
  const loading = ref(false);
  const error = ref<Error | null>(null);

  // 加载数据
  const loadTodos = async (status?: string) => {
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
  };

  // 添加
  const addTodo = async (item: Omit<TodoItem, 'id' | 'createdAt'>) => {
    const id = await todoService.add(item);
    await loadTodos(); // 重新拉取，或本地乐观更新
    return id;
  };

  // 删除
  const removeTodo = async (id: string) => {
    await todoService.delete(id);
    todos.value = todos.value.filter(t => t.id !== id); // 乐观删除
  };

  // 计算属性
  const completedCount = computed(
    () => todos.value.filter(t => t.status === 'completed').length
  );

  return {
    todos,
    loading,
    error,
    loadTodos,
    addTodo,
    removeTodo,
    completedCount
  };
}
```

组件使用：

```vue
<script setup lang="ts">
import { onMounted } from 'vue';
import { useTodoDatabase } from '@/composables/useTodoDatabase';

const { todos, loading, loadTodos, addTodo, removeTodo } = useTodoDatabase();
onMounted(() => loadTodos());
</script>
```

为什么不用 reactive？
IndexedDB 返回的是普通对象数组，深层次 reactive 包裹开销大且易丢失响应性。用 ref/shallowRef 整体替换引用，是最高效的方式。

---

7. 性能优化关键点

1. 合理创建索引
   查询频繁的字段（如 status、createdAt）必须建索引，否则会全表扫描。
   ```ts
   this.version(1).stores({
     todos: 'id, status, createdAt'
   });
   ```
1. 批量操作使用 bulkAdd/bulkPut/bulkDelete
   比循环单条插入快几十倍，尤其适合初始化数据。
1. 大结果集分页查询
   ```ts
   db.todos.orderBy('createdAt').offset(20).limit(10).toArray();
   ```
1. 事务显式控制
   ```ts
   db.transaction('rw', db.todos, db.drafts, async () => {
     // 多个操作在同一事务内
     await db.todos.add(...);
     await db.drafts.delete(draftId);
   });
   ```
1. 避免在 upgrade 中执行耗时操作
   版本升级阻塞数据库打开，仅做必要的数据迁移，不宜做复杂计算。
1. 使用 shallowRef 与 markRaw
   存储大量对象时，避免深度响应式开销。

---

8. 错误处理与重试机制

```typescript
// 包装一个带重试的查询
export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 300
): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (retries <= 0) throw err;
    await new Promise(resolve => setTimeout(resolve, delay));
    return withRetry(fn, retries - 1, delay);
  }
}
```

在 Service 层调用时包裹关键操作，应对浏览器 quota 限制或临时锁冲突。

---

9. 与离线能力结合

IndexedDB 是实现 离线优先 的基石，建议配合 Service Worker 使用：

· 读缓存：先返回 DB 缓存数据，再请求网络更新。
· 写操作：网络正常时同步至服务器；网络异常时将操作暂存 DB 的 “待同步队列” 表，待在线后批量同步。

可简单实现一个 outbox 模式：

```ts
this.version(1).stores({
  outbox: '++id, type, payload, timestamp'
});
// 网络恢复时：读取 outbox 表，逐条发送，成功后删除记录。
```

---

10. 敏感数据加密

如果需要存储 token、个人信息等，可用 Web Crypto API 对字段加密后再存入。

```ts
// 加解密工具
async function encryptData(
  plainText: string,
  key: CryptoKey
): Promise<ArrayBuffer> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(plainText);
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoded
  );
  return encrypted; // 存储时需转 base64 + iv 一起保存
}
```

Dexie 中间件可以拦截写入/读取，实现透明加密层。

---

11. 测试策略

· 单元测试：mock IndexedDB 使用 fake-indexeddb 库，在 Node 环境运行测试。
· Service 层测试：直接测试 todoService 的增删改查，确保事务和索引正确。
· Composable 测试：使用 @vue/test-utils + 假数据，验证响应式状态变更。

```bash
npm install --save-dev fake-indexeddb
```

```ts
// jest.setup.ts
import 'fake-indexeddb/auto';
```

---

12. 总结设计原则

原则 具体做法
单一职责 数据库定义、服务层、UI 层完全分离
版本管理谨慎 使用 Dexie 声明式迁移，记录变更历史
异步封装 通过 Composable 将异步转为可响应状态
错误兜底 关键操作加重试，异常上报与用户提示
性能敏感 索引设计、批量 API、事务控制
安全 敏感数据加密存储，注意客户端风险

按照上述结构，你的 Vue3 项目可获得一个稳定、可扩展、高性能的 IndexedDB 数据层，无论是小型 Todo 还是复杂离线应用都能从容应对。

基于前面搭建的 IndexedDB 架构（Dexie + Service + Composable），现在来看 Vue3 页面中如何高效、优雅地使用本地数据库数据。

---

一、准备：从 Composable 获取能力

我们已经封装了 useTodoDatabase 组合式函数，它暴露了响应式状态和方法：

```typescript
// composables/useTodoDatabase.ts (回顾)
export function useTodoDatabase() {
  const todos = shallowRef<TodoItem[]>([]);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  const loadTodos = async (status?: string) => {
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
  };

  const addTodo = async (item) => {
    const id = await todoService.add(item);
    await loadTodos(); // 或乐观更新
    return id;
  };

  const removeTodo = async (id: string) => {
    await todoService.delete(id);
    todos.value = todos.value.filter(t => t.id !== id); // 乐观删除
  };

  // ...其他方法
  return { todos, loading, error, loadTodos, addTodo, removeTodo, ... };
}
```

---

二、基础页面使用：加载、列表渲染、交互

以一个 Todo 管理页面为例。

```vue
<template>
  <div class="todo-page">
    <h2>我的任务</h2>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading">加载中...</div>

    <!-- 错误提示 -->
    <div v-else-if="error" class="error">
      出错了：{{ error.message }}
      <button @click="loadTodos()">重试</button>
    </div>

    <!-- 空状态 -->
    <div v-else-if="todos.length === 0" class="empty">
      暂无任务，快来添加一条吧
    </div>

    <!-- 列表 -->
    <ul v-else class="todo-list">
      <li
        v-for="todo in todos"
        :key="todo.id"
        :class="{ completed: todo.status === 'completed' }"
      >
        <input
          type="checkbox"
          :checked="todo.status === 'completed'"
          @change="toggleStatus(todo)"
        />
        <span class="title">{{ todo.title }}</span>
        <button @click="removeTodo(todo.id)">删除</button>
      </li>
    </ul>

    <!-- 添加表单 -->
    <form @submit.prevent="handleAdd">
      <input v-model="newTitle" placeholder="输入任务标题" />
      <button type="submit" :disabled="!newTitle.trim()">添加</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useTodoDatabase } from '@/composables/useTodoDatabase';

const { todos, loading, error, loadTodos, addTodo, removeTodo } =
  useTodoDatabase();
const newTitle = ref('');

onMounted(() => {
  loadTodos(); // 进入页面加载数据
});

// 切换完成状态（乐观更新示例）
async function toggleStatus(todo: TodoItem) {
  const newStatus = todo.status === 'completed' ? 'active' : 'completed';
  // 立即更新本地响应式数据，UI 马上变化
  const idx = todos.value.findIndex(t => t.id === todo.id);
  if (idx !== -1) {
    todos.value[idx] = { ...todos.value[idx], status: newStatus };
  }
  // 异步持久化到 IndexedDB
  try {
    await db.todos.update(todo.id, { status: newStatus });
  } catch (e) {
    // 回滚
    if (idx !== -1) {
      todos.value[idx] = { ...todos.value[idx], status: todo.status };
    }
    console.error('更新失败', e);
  }
}

async function handleAdd() {
  if (!newTitle.value.trim()) return;
  await addTodo({
    title: newTitle.value,
    status: 'active',
    priority: 'normal'
  });
  newTitle.value = ''; // 清空输入
}
</script>
```

关键点解释：

· 分层加载状态：loading 为真时展示加载动画；error 不为空时展示错误及重试按钮；数据为空时展示引导文案。
· 数据驱动视图：todos 是 shallowRef，每次整体赋值新数组触发更新，比 reactive 或深层 ref 更节省性能。
· 乐观更新：toggleStatus 里先改本地 todos 数组，再异步写库；如果写入失败，再将本地数据回滚。这让交互瞬间响应。
· 添加任务：addTodo 内部会重新拉取全量数据（也可改为本地拼接新对象，减少一次读取）。这里为了保持数据一致性，选择了重新拉取，简单可靠。若数据量大，可优化为只在本地数组 push 新项。

---

三、搜索与分页

当数据量较大时，需要使用分页查询，避免一次性加载全部数据导致卡顿。

```typescript
// composables/useTodoDatabase.ts 增加分页方法
const pageSize = 20;
const currentPage = ref(1);
const keyword = ref('');

const loadPage = async () => {
  loading.value = true;
  try {
    let collection = db.todos.orderBy('createdAt');
    if (keyword.value) {
      // 简单搜索：使用 filter 在索引后过滤（注意：IndexedDB 不支持中文全文搜索，需额外实现或使用 filter 遍历）
      collection = collection.filter(todo =>
        todo.title.includes(keyword.value)
      );
    }
    const offset = (currentPage.value - 1) * pageSize;
    todos.value = await collection.offset(offset).limit(pageSize).toArray();
  } catch (e) {
    error.value = e as Error;
  } finally {
    loading.value = false;
  }
};

const search = (kw: string) => {
  keyword.value = kw;
  currentPage.value = 1; // 重置页码
  loadPage();
};
```

页面模板中增加搜索框和分页按钮：

```vue
<input
  v-model="searchKeyword"
  @input="search(searchKeyword)"
  placeholder="搜索任务"
/>
<div class="pagination">
  <button :disabled="currentPage <= 1" @click="currentPage--; loadPage()">上一页</button>
  <span>第 {{ currentPage }} 页</span>
  <button @click="currentPage++; loadPage()">下一页</button>
</div>
```

注意：Dexie 的 filter 会遍历所有匹配索引的记录，如果数据量极大（如万级以上），建议建立专门的搜索索引（如倒排索引）或使用 Web Worker 处理。

---

四、与路由联动

例如，展示不同状态的 Todo 列表：/todos/all、/todos/active、/todos/completed。

```vue
<script setup lang="ts">
import { watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const { todos, loadTodos } = useTodoDatabase();

// 监听路由变化重新加载数据
watch(
  () => route.params.filter,
  async filter => {
    if (filter === 'all') {
      await loadTodos();
    } else {
      await loadTodos(filter); // 假设 loadTodos 接受 status 参数
    }
  },
  { immediate: true }
);
</script>
```

这样用户切换标签时，数据自动从 IndexedDB 查询对应状态，无网络请求，响应极快。

---

五、大规模列表优化：虚拟滚动

如果列表有成千上万项，真实 DOM 节点会非常多，此时需要虚拟滚动（仅渲染可视区域内的项目）。可以结合 vue-virtual-scroller 库。

```bash
npm install vue-virtual-scroller
```

```vue
<template>
  <DynamicScroller :items="todos" :min-item-size="50" class="scroller">
    <template v-slot="{ item, active }">
      <DynamicScrollerItem :item="item" :active="active">
        <div class="todo-item">
          {{ item.title }}
        </div>
      </DynamicScrollerItem>
    </template>
  </DynamicScroller>
</template>
```

注意：虚拟滚动依赖 todos 数组的整体引用变化，所以用 shallowRef 整体替换非常合适。

---

六、错误边界与用户提示

除了在 Composable 中捕获异常，页面还可使用全局错误处理或 Toast 提示。

```typescript
// 简单全局错误处理
const { error } = useTodoDatabase();
watch(error, err => {
  if (err) {
    // 使用 UI 库的 Toast 或自己实现
    showToast('操作失败：' + err.message);
  }
});
```

对于关键写操作，带上重试逻辑（前面 Composable 中可集成 withRetry）。

---

七、小结：页面使用要点

要点 实践
数据加载 onMounted 调用 loadTodos()，展示 loading/error/空状态三种 UI
响应式绑定 用 shallowRef 存储数组，整体替换；避免深度包裹大对象
交互更新 乐观更新先改本地，再异步写 DB；失败时回滚
搜索分页 利用 IndexedDB 索引 + limit/offset，避免全量数据渲染
路由联动 监听路由参数，重新查询对应数据
大规模列表 引入虚拟滚动库，减少 DOM 节点
错误处理 组件捕获异常并展示友好提示，关键操作加重试

最终，页面代码简洁、数据流清晰，所有 IndexedDB 操作都被封装在 Service 和 Composable 后，组件只关心 UI 交互和响应式数据。无论你的项目是简单清单还是复杂离线应用，这套模式都提供了稳定的数据驱动方案。

完全可以，而且很推荐。Composable 和 Pinia 本质上都是基于 Vue3 响应式系统的状态封装，用 Pinia 替换是顺滑的。

---

一、什么时候该用 Pinia？

· 需要跨组件/路由共享 IndexedDB 数据（如用户信息、全局配置、购物车）
· 需要更清晰的状态管理结构（state/getters/actions 明确分离）
· 需要 DevTools 调试支持（时间旅行、状态快照）
· 团队更熟悉 Pinia 模式

如果数据只在单个页面内使用，Composable 就够用，更轻量。

---

二、改造示例：从 Composable 到 Pinia Store

原来 useTodoDatabase 是组合式函数，改成 Pinia store 基本是把 ref 放进 state，方法放进 actions。

```typescript
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
```

这里使用了 Setup Store 语法，它本身就是 Composable 写法，所以迁移几乎零成本。

---

三、页面中使用 Pinia Store

和 Composable 用法几乎一样，只是引入方式变了。

```vue
<template>
  <div class="todo-page">
    <div v-if="todoStore.loading">加载中...</div>
    <div v-else-if="todoStore.error">出错了：{{ todoStore.error.message }}</div>
    <div v-else-if="todoStore.isEmpty">暂无任务</div>
    <ul v-else>
      <li v-for="todo in todoStore.todos" :key="todo.id">
        <input
          type="checkbox"
          :checked="todo.status === 'completed'"
          @change="todoStore.toggleStatus(todo)"
        />
        {{ todo.title }}
        <button @click="todoStore.removeTodo(todo.id)">删除</button>
      </li>
    </ul>
    <form @submit.prevent="handleAdd">
      <input v-model="newTitle" />
      <button type="submit">添加</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useTodoStore } from '@/stores/todoStore';

const todoStore = useTodoStore();
const newTitle = ref('');

onMounted(() => {
  todoStore.loadTodos();
});

async function handleAdd() {
  if (!newTitle.value.trim()) return;
  await todoStore.addTodo({
    title: newTitle.value,
    status: 'active',
    priority: 'normal'
  });
  newTitle.value = '';
}
</script>
```

注意：模板中直接使用 todoStore.todos 即可，因为 Pinia store 本身是响应式对象，不需要 .value（shallowRef 在 store 内部自动解包）。

---

四、与路由联动示例

```vue
<script setup lang="ts">
import { watch } from 'vue';
import { useRoute } from 'vue-router';
import { useTodoStore } from '@/stores/todoStore';

const route = useRoute();
const todoStore = useTodoStore();

watch(
  () => route.params.filter,
  filter => {
    if (filter === 'all') todoStore.loadTodos();
    else todoStore.loadTodos(filter as string);
  },
  { immediate: true }
);
</script>
```

因为 Pinia store 是全局单例（模块作用域），整个应用共享同一份数据，非常适合这种跨页面状态。

---

五、Composable vs Pinia 对比

特性 Composable Pinia Store
作用域 调用一次创建一个新实例（局部状态） 全局单例，组件共享
共享数据 需要提升到父组件或 provide/inject 开箱即用，任意组件直接引用
DevTools 无内置支持 ✅ Vue DevTools 可查看/编辑状态
持久化插件 需手动集成 社区有 pinia-plugin-persistedstate 可配合 IndexedDB 或 localStorage
代码结构 自由，更像函数 约定 state/getters/actions，结构清晰
适用场景 页面级私有状态、局部逻辑 全局共享状态、跨页面缓存、用户信息

结论：

· 如果 IndexedDB 数据需要在多个不相关的页面/组件间实时同步 → 用 Pinia
· 如果只是某个页面自己的本地数据库缓存（如草稿、历史记录） → Composable 更轻便，避免全局污染

---

六、高级技巧：Pinia + IndexedDB 持久化

如果希望 store 中的数据自动同步回 IndexedDB（如刷新不丢失），可以写一个简单的插件：

```typescript
// 简易 IndexedDB 持久化插件
export function indexdbPersistPlugin(context) {
  const { store } = context;
  // 从 IndexedDB 恢复状态
  db.table('appState')
    .get(store.$id)
    .then(saved => {
      if (saved) store.$patch(saved);
    });
  // 监听变化存入 DB
  store.$subscribe((mutation, state) => {
    db.table('appState').put({ id: store.$id, ...state });
  });
}
```

或者使用现成的 pinia-plugin-persistedstate 并配置 IndexedDB 存储（需结合 localForage 等）。

---

七、最终建议

完全可以替换，而且 Pinia 能让你的 IndexedDB 状态管理更规范。 如果项目里已经有 Pinia，把数据库操作放进 store 就是最自然的做法。如果你追求极简，Composable 仍然是不错的选择。

选择取决于你的状态共享范围，而不是 IndexedDB 本身。
