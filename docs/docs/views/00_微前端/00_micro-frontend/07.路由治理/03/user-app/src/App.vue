<script setup>
import { computed, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const isDialogOpen = ref(false);

const navItems = [
  // [路由处理2:] RouterLink 只写用户子应用内部路径，最终 URL 会自动带上 /users base。
  { to: "/list", label: "用户列表" },
  { to: "/profile/1001", label: "用户档案" },
  { to: "/roles", label: "角色权限" },
];

const dialogConfig = computed(() => {
  if (route.path === "/profile/1001") {
    return {
      actionLabel: "编辑用户资料",
      title: "编辑用户资料",
      fields: ["真实姓名", "所属部门", "联系电话"],
    };
  }

  if (route.path === "/roles") {
    return {
      actionLabel: "分配角色",
      title: "分配角色",
      fields: ["角色名称", "数据范围", "审批权限"],
    };
  }

  return {
    actionLabel: "新增用户",
    title: "新增用户",
    fields: ["登录账号", "用户姓名", "初始角色"],
  };
});

function openDialog() {
  isDialogOpen.value = true;
}

function closeDialog() {
  isDialogOpen.value = false;
}
</script>

<template>
  <section class="module-shell">
    <header class="module-header">
      <div>
        <span class="module-badge">用户系统</span>
        <h1>用户管理</h1>
      </div>
      <div class="header-actions">
        <button class="dialog-trigger" type="button" @click="openDialog">
          {{ dialogConfig.actionLabel }}
        </button>
      </div>
    </header>

    <nav class="module-tabs">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="tab-link"
      >
        {{ item.label }}
      </RouterLink>
    </nav>

    <main class="module-content">
      <RouterView />
    </main>

    <Teleport to="body">
      <div v-if="isDialogOpen" class="dialog-mask" @click.self="closeDialog">
        <section
          class="dialog-panel"
          role="dialog"
          aria-modal="true"
          :aria-label="dialogConfig.title"
        >
          <div class="dialog-head">
            <div>
              <span class="dialog-badge">用户操作</span>
              <h2>{{ dialogConfig.title }}</h2>
            </div>
            <button class="dialog-close" type="button" @click="closeDialog">
              关闭
            </button>
          </div>

          <div class="dialog-form">
            <label
              v-for="field in dialogConfig.fields"
              :key="field"
              class="dialog-field"
            >
              <span>{{ field }}</span>
              <input :placeholder="`请输入${field}`" />
            </label>
          </div>

          <footer class="dialog-actions">
            <button class="dialog-secondary" type="button" @click="closeDialog">
              取消
            </button>
            <button class="dialog-primary" type="button" @click="closeDialog">
              保存
            </button>
          </footer>
        </section>
      </div>
    </Teleport>
  </section>
</template>
