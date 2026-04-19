<script setup lang="ts">
import TodoList from '@/components/TodoList/TodoList.vue';
import { useTodoStore } from '@/stores/todo';
import { ref, computed, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import {
  AppleOutlined,
  AndroidOutlined,
  DeleteOutlined
} from '@ant-design/icons-vue';
const todoStore = useTodoStore();
const activeKey = ref('1');
const todoList = computed(() => todoStore.todoList);
const todoInp = ref<string>('');
const checked = ref(false);

/* 处理输入框的回车事件 */
async function handleEnter(e: KeyboardEvent) {
  const target = e.target as HTMLInputElement;
  const title = target.value.trim();
  const result = await todoStore.createTodo({ title });
  result.message && message.success(result.message);
  todoInp.value = '';
  await todoStore.findAll(1, 10);
}

function handleDelete() {
  console.log('21212');
}

onMounted(() => {
  todoStore.findAll(1, 10);
});
</script>

<template>
  <div class="todo-list">
    <div class="container">
      <a-input
        class="todo-inp"
        v-model:value.lazy="todoInp"
        autofocus
        placeholder="请输入代办事项"
        @pressEnter="handleEnter"
      />

      <div class="todo-tabs">
        <a-tabs v-model:activeKey="activeKey" centered :tabBarGutter="150">
          <a-tab-pane class="tab" key="1">
            <template #tab>
              <span>
                <!-- <apple-outlined /> -->
                未完成
              </span>
            </template>
            <div class="list-container">
              <div class="list-card" v-for="item in todoList">
                <a-checkbox v-model:checked="checked">{{
                  item.title
                }}</a-checkbox>
                <DeleteOutlined class="card-icon" @click="handleDelete" />
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane class="tab" key="2">
            <template #tab>
              <span>
                <!-- <android-outlined /> -->
                已完成
              </span>
            </template>
            已完成
          </a-tab-pane>
          <a-tab-pane class="tab" key="3">
            <template #tab>
              <span>
                <!-- <android-outlined />s -->
                全部
              </span>
            </template>
            全部
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.todo-list {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.container {
  width: 50vw;
  height: 100vh;
  border-radius: 30px;
  background-color: rgb(113, 93, 187);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
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
  height: 520px;
  overflow-y: scroll;
}

.list-container .list-card {
  display: flex;
  font-size: 18px;
  margin: 16px 0px;
  background: white;
  border-radius: 20px;
  padding: 12px 16px 12px 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
  border: 1px solid #edf2f7;
  transition: all 0.2s;
  display: flex;
  justify-content: center;
  align-items: flex-start;

  > * {
    flex: 1;
  }

  .card-icon {
    color: red;
    flex: 0;
  }
}
</style>
