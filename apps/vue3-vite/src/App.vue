<!-- App.vue -->
<template>
  <div id="app">
    <h1>高阶组件 - 登录鉴权示例</h1>

    <!-- 使用高阶组件 -->
    <AuthDashboard :user-info="{ name: '张三' }" @refresh="handleRefresh" />

    <div style="margin-top: 20px">
      <button @click="toggleLogin" class="btn">
        {{ isLogin ? '退出登录' : '模拟登录' }}
      </button>
      <span style="margin-left: 10px; color: #666">
        当前状态：{{ isLogin ? '✅ 已登录' : '❌ 未登录' }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import Dashboard from './components/Dashboard.vue';
import { withAuth } from './components/WithAuth.vue';

// 用高阶组件包装 Dashboard
const AuthDashboard = withAuth(Dashboard);

// 登录状态管理（仅用于演示）
const isLogin = ref(!!localStorage.getItem('token'));

// 切换登录状态
const toggleLogin = () => {
  if (isLogin.value) {
    localStorage.removeItem('token');
    isLogin.value = false;
  } else {
    localStorage.setItem('token', 'fake-jwt-token');
    isLogin.value = true;
  }
};

// 监听登录状态变化，强制更新高阶组件
watch(isLogin, () => {
  // 触发重新渲染
});

// 事件处理
const handleRefresh = () => {
  console.log('刷新数据...');
  alert('数据已刷新！');
};
</script>

<style>
#app {
  max-width: 500px;
  margin: 50px auto;
  font-family: Arial, sans-serif;
}

.btn {
  padding: 8px 16px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn:hover {
  background: #359268;
}
</style>
