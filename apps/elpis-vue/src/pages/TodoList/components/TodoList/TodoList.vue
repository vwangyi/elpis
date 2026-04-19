<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

const inputTask = ref('');
// ---------- 数据层 ----------
let tasks = [
  {
    id: Date.now() + 1,
    text: '浏览现代待办清单设计',
    completed: true
  },
  {
    id: Date.now() + 2,
    text: '体验交互动画与卡片质感',
    completed: false
  },
  {
    id: Date.now() + 3,
    text: '添加 3 个工作任务并完成一个',
    completed: false
  }
];

let currentFilter = 'all'; // 'all', 'active', 'completed'

// DOM 元素
const todoListEl = document.getElementById('todoList')!;
const taskInput = document.getElementById('taskInput') as HTMLInputElement;
const addBtn = document.getElementById('addBtn')!;
const totalSpan = document.getElementById('totalCount')!;
const activeSpan = document.getElementById('activeCount')!;
const completedSpan = document.getElementById('completedCount')!;
const clearCompletedBtn = document.getElementById('clearCompleted')!;

// 辅助函数 - 更新统计数据
function updateStats() {
  const total = tasks.length;
  const active = tasks.filter(t => !t.completed).length;
  const completed = tasks.filter(t => t.completed).length;
  totalSpan.innerText = total.toString();
  activeSpan.innerText = active.toString();
  completedSpan.innerText = completed.toString();
}

// 渲染待办列表 (基于当前过滤器)
function renderTodoList() {
  let filteredTasks = tasks;
  if (currentFilter === 'active') {
    filteredTasks = tasks.filter(t => !t.completed);
  } else if (currentFilter === 'completed') {
    filteredTasks = tasks.filter(t => t.completed);
  }

  if (filteredTasks.length === 0) {
    todoListEl.innerHTML = `
                    <div class="empty-state">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
                            <path d="M9 11H15M9 15H12M12 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7" />
                            <path d="M16 18 L19 21 L22 18" />
                            <path d="M19 15 L19 21" />
                        </svg>
                        <p>✨ 暂无待办事项，添加一条开始吧 ✨</p>
                    </div>
                `;
    updateStats();
    return;
  }

  const tasksHTML = filteredTasks
    .map(task => {
      return `
                    <li class="todo-item" data-id="${task.id}">
                        <div class="todo-checkbox ${task.completed ? 'completed' : ''}" data-complete="${task.id}">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                        <div class="todo-text ${task.completed ? 'completed' : ''}">${escapeHtml(task.text)}</div>
                        <button class="delete-btn" data-delete="${task.id}">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                <line x1="10" y1="11" x2="10" y2="17" />
                                <line x1="14" y1="11" x2="14" y2="17" />
                            </svg>
                        </button>
                    </li>
                `;
    })
    .join('');

  todoListEl.innerHTML = tasksHTML;
  updateStats();
}

// 简单的防XSS
function escapeHtml(str: string) {
  return str
    .replace(/[&<>]/g, function (m: string) {
      if (m === '&') return '&amp;';
      if (m === '<') return '&lt;';
      if (m === '>') return '&gt;';
      return m;
    })
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, function (c) {
      return c;
    });
}

// 添加新任务
function addTask() {
  console.log('addTask', inputTask.value);
  const text = inputTask.value.trim();

  if (text === '') {
    alert('请填写待办内容 ✏️');
    return;
  }

  tasks.unshift({
    id: Date.now(),
    text: text as string,
    completed: false
  });

  inputTask.value = '';
  return;
  const newTask = {
    id: Date.now(),
    text: text as string,
    completed: false
  };
  tasks.push(newTask);
  taskInput.value = '';
  // 如果当前过滤器不是 'all' 或 'active'，为了体验友好，自动切回全部或者保持active且展示新任务更好？
  if (currentFilter === 'completed') {
    // 添加的新任务肯定是未完成，如果处在已完成过滤器下用户看不到，自动切换到active或all？
    currentFilter = 'all';
    // 同步高亮按钮状态
    const filterBtns = document.querySelectorAll(
      '.filter-btn'
    ) as NodeListOf<HTMLButtonElement>;
    filterBtns.forEach((btn: HTMLButtonElement) => {
      if (btn.dataset.filter === 'all') btn.classList.add('active');
      else btn.classList.remove('active');
    });
  }
  renderTodoList();
}

// 切换完成状态
function toggleComplete(taskId: number) {
  const task = tasks.find(t => t.id == taskId);
  if (task) {
    task.completed = !task.completed;
    renderTodoList();
  }
}

// 删除任务
function deleteTask(taskId: number) {
  tasks = tasks.filter(t => t.id != taskId);
  renderTodoList();
}

// 清除已完成任务
function clearCompletedTasks() {
  tasks = tasks.filter(t => !t.completed);
  renderTodoList();
}

// 事件委托 (处理复选框点击 / 删除按钮)
function handleListClick(e: MouseEvent) {
  const target: HTMLElement | null = e.target as HTMLElement;
  // 点击复选框区域
  const checkboxDiv = target?.closest('.todo-checkbox')! as HTMLElement;
  if (checkboxDiv && checkboxDiv.dataset.complete) {
    const taskId = checkboxDiv.dataset.complete as string;
    toggleComplete(Number(taskId));
    return;
  }
  // 点击删除按钮
  const deleteBtn = target?.closest('.delete-btn')! as HTMLElement;
  if (deleteBtn && deleteBtn.dataset.delete) {
    const taskId = deleteBtn.dataset.delete;
    deleteTask(Number(taskId));
    return;
  }
}

// 过滤器切换
function setFilter(filter: string) {
  currentFilter = filter;
  renderTodoList();
  // UI 高亮
  const filterBtns = document.querySelectorAll(
    '.filter-btn'
  ) as NodeListOf<HTMLButtonElement>;
  filterBtns.forEach((btn: HTMLButtonElement) => {
    if (btn.dataset.filter === filter) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// 初始化事件监听
function init() {
  todoListEl.addEventListener('click', handleListClick);
  clearCompletedBtn.addEventListener('click', clearCompletedTasks);

  const filterBtns: HTMLButtonElement[] = Array.from(
    document.querySelectorAll('.filter-btn')
  );
  filterBtns.forEach((btn: HTMLButtonElement) => {
    btn.addEventListener('click', e => {
      const filter = btn.dataset.filter;
      setFilter(filter as string);
    });
  });

  renderTodoList();
}

onMounted(init);
</script>

<template>
  <div class="todo-list-container-box">
    <div class="todo-card">
      <div class="header">
        <h1>
          📋 待办清单
          <span>专注力</span>
        </h1>
        <p>捕捉灵感 · 有序完成 · 每天进步</p>
      </div>

      <div class="stats">
        <div class="stat-item">
          <div class="stat-number" id="totalCount">0</div>
          <div class="stat-label">全部</div>
        </div>
        <div class="stat-item">
          <div class="stat-number" id="activeCount">0</div>
          <div class="stat-label">未完成</div>
        </div>
        <div class="stat-item">
          <div class="stat-number" id="completedCount">0</div>
          <div class="stat-label">已完成</div>
        </div>
      </div>

      <div class="input-area">
        <div class="input-wrapper">
          <input
            v-model="inputTask"
            type="text"
            id="taskInput"
            placeholder="写一个任务，比如 “设计UI界面” ..."
            autocomplete="off"
            @keypress="e => (e.key === 'Enter' ? addTask() : null)"
          />
          <!-- 按钮 -->
          <button class="add-btn" @click="addTask">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>

      <div class="todo-list-container">
        <ul class="todo-list" id="todoList" @click="">
          <!-- 动态渲染任务 -->
          <div class="empty-state">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.2"
            >
              <path
                d="M9 11H15M9 15H12M12 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7"
              />
              <path d="M16 18 L19 21 L22 18" />
              <path d="M19 15 L19 21" />
            </svg>
            <p>✨ 暂无待办事项，添加一条开始吧 ✨</p>
          </div>
        </ul>
      </div>

      <div class="filter-bar">
        <div class="filter-group">
          <button class="filter-btn active" data-filter="all">全部</button>
          <button class="filter-btn" data-filter="active">未完成</button>
          <button class="filter-btn" data-filter="completed">已完成</button>
        </div>
        <button class="clear-btn" id="clearCompleted">清除已完成</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import './style.scss';
</style>
