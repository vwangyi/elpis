<script setup lang="ts">
import { useTodoStore } from '@/stores/todo';
import { ref, computed, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons-vue';
import type { Todo } from '@/types/todo';

const todoStore = useTodoStore();

/* ---------- 标签页：未完成 / 已完成 / 全部 ---------- */
const tabs = [
  {
    key: '1',
    label: '未完成',
    status: 0
  },
  {
    key: '2',
    label: '已完成',
    status: 1
  },
  {
    key: '3',
    label: '全部',
    status: undefined
  }
];
const activeKey = ref('1');

const todoInp = computed({
  get: () => todoStore.todoInp,
  set: val => todoStore.updateTodoInp(val)
});

const todoList = computed(() => todoStore.todoList);

/* ---------- 加载列表 ---------- */
async function loadList() {
  const tab = tabs.find(t => t.key === activeKey.value);
  await todoStore.findAll(
    todoStore.page,
    todoStore.pageSize,
    undefined,
    tab?.status
  );
}

/* ---------- 新增 ---------- */
async function handleEnter() {
  const title = todoStore.todoInp.trim();
  if (!title) {
    message.warning('请输入待办内容');
    return;
  }
  const res = await todoStore.createTodo({
    title
  });
  if (res.success) {
    message.success('添加成功');
    todoStore.updateTodoInp('');
    // 新增后切到当前 tab 对应的列表页第一页
    todoStore.page = 1;
    await loadList();
  } else {
    message.error(res.message || '添加失败');
  }
}

/* ---------- 切换完成状态 ---------- */
async function handleToggleStatus(todo: Todo) {
  const newStatus = todo.status === 1 ? 0 : 1;
  const res = await todoStore.updateTodo(todo.id, { status: newStatus });
  if (!res.success) {
    message.error(res.message || '更新失败');
    return;
  }
  // 在「未完成 / 已完成」标签下，切换状态后需重新加载（该项应离开当前列表）
  if (activeKey.value !== '3') {
    await loadList();
  }
}

/* ---------- 编辑 ---------- */
const editVisible = ref(false);
const editLoading = ref(false);
const editForm = ref<{
  id: number;
  title: string;
  description: string;
}>({
  id: 0,
  title: '',
  description: ''
});

function handleEdit(todo: Todo) {
  editForm.value = {
    id: todo.id,
    title: todo.title,
    description: todo.description || ''
  };
  editVisible.value = true;
}

async function handleEditOk() {
  const { id, title, description } = editForm.value;
  if (!title.trim()) {
    message.warning('标题不能为空');
    return;
  }
  editLoading.value = true;
  try {
    const res = await todoStore.updateTodo(id, {
      title: title.trim(),
      description
    });
    if (res.success) {
      message.success('更新成功');
      editVisible.value = false;
    } else {
      message.error(res.message || '更新失败');
    }
  } finally {
    editLoading.value = false;
  }
}

/* ---------- 删除 ---------- */
async function handleDelete(id: number) {
  const res = await todoStore.removeTodo(id);
  if (res.success) {
    message.success('删除成功');
    // 当前页删空时回退一页
    if (todoList.value.length === 0 && todoStore.page > 1) {
      todoStore.page -= 1;
    }
    await loadList();
  } else {
    message.error(res.message || '删除失败');
  }
}

/* ---------- 标签页切换 ---------- */
async function handleTabChange() {
  todoStore.page = 1;
  await loadList();
}

/* ---------- 分页 ---------- */
async function handlePageChange(p: number, ps: number) {
  await todoStore.findAll(
    p,
    ps,
    undefined,
    tabs.find(t => t.key === activeKey.value)?.status
  );
}

onMounted(() => {
  loadList();
});
</script>

<template>
  <div class="todo-list">
    <div class="container">
      <!-- 新增输入框 -->
      <a-input
        v-model:value="todoInp"
        class="todo-inp"
        placeholder="请输入待办事项，按回车添加"
        allow-clear
        @press-enter="handleEnter"
      />

      <!-- 标签页 -->
      <div class="todo-tabs">
        <a-tabs
          v-model:active-key="activeKey"
          centered
          @change="handleTabChange"
        >
          <a-tab-pane
            v-for="tab in tabs"
            :key="tab.key"
            :tab="tab.label"
          >
            <div class="list-container">
              <a-spin :spinning="todoStore.loading">
                <a-empty
                  v-if="todoList.length === 0"
                  description="暂无待办"
                  :image="undefined"
                />
                <div
                  v-for="item in todoList"
                  :key="item.id"
                  class="list-card"
                >
                  <a-checkbox
                    :checked="item.status === 1"
                    @change="handleToggleStatus(item)"
                  >
                    <span
                      :class="{
                        done: item.status === 1
                      }"
                    >
                      {{ item.title }}
                    </span>
                    <span
                      v-if="item.description"
                      class="card-desc"
                    >
                      —
                      {{ item.description }}
                    </span>
                  </a-checkbox>
                  <div class="card-actions">
                    <EditOutlined
                      class="card-icon edit"
                      @click="handleEdit(item)"
                    />
                    <a-popconfirm
                      title="确定删除该待办吗？"
                      ok-text="删除"
                      cancel-text="取消"
                      @confirm="handleDelete(item.id)"
                    >
                      <DeleteOutlined class="card-icon delete" />
                    </a-popconfirm>
                  </div>
                </div>
              </a-spin>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>

      <!-- 分页 -->
      <div class="todo-pagination">
        <a-pagination
          :current="todoStore.page"
          :page-size="todoStore.pageSize"
          :total="todoStore.todoTotal"
          size="small"
          show-size-changer
          :show-total="(total: number) => `共 ${total} 条`"
          @change="handlePageChange"
        />
      </div>
    </div>

    <!-- 编辑弹窗 -->
    <a-modal
      v-model:open="editVisible"
      title="编辑待办"
      :confirm-loading="editLoading"
      @ok="handleEditOk"
    >
      <a-form layout="vertical">
        <a-form-item
          label="标题"
          required
        >
          <a-input
            v-model:value="editForm.title"
            placeholder="请输入标题"
          />
        </a-form-item>
        <a-form-item label="描述">
          <a-textarea
            v-model:value="editForm.description"
            :rows="3"
            placeholder="请输入描述（可选）"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<style lang="scss" scoped>
.todo-list {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.container {
  width: 50%;
  height: 100%;
  border-radius: 30px;
  background-color: rgb(113, 93, 187);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding-top: 12px;
}

.todo-inp {
  width: 80%;
  height: 48px;
  margin: 12px 0px;
  border-radius: 50px;
  font-size: 18px;
  padding: 0 16px;
}

.todo-tabs {
  width: 80%;
}

.list-container {
  width: 100%;
  height: 480px;
  overflow-y: auto;
}

.list-container .list-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  margin: 12px 0px;
  background: white;
  border-radius: 20px;
  padding: 12px 16px 12px 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
  border: 1px solid #edf2f7;
  transition: all 0.2s;

  .done {
    text-decoration: line-through;
    color: #b0b0b0;
  }

  .card-desc {
    font-size: 14px;
    color: #999;
    margin-left: 4px;
  }

  .card-actions {
    flex-shrink: 0;
    display: flex;
    gap: 12px;
  }

  .card-icon {
    cursor: pointer;
    font-size: 18px;
    transition: color 0.2s;

    &.edit {
      color: #1890ff;
    }

    &.delete {
      color: #ff4d4f;
    }
  }
}

.todo-pagination {
  width: 80%;
  display: flex;
  justify-content: center;
  padding: 12px 0;
}
</style>
