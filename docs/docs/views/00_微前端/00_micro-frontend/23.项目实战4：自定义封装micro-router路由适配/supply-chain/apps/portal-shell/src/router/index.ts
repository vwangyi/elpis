import { createRouter, createWebHistory } from 'vue-router'
import { getSafeRedirect, hasSession } from '@supply-chain/auth-session'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { public: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
      meta: { public: true },
    },
    {
      path: '/',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
    },
    {
      path: '/fulfillment/:pathMatch(.*)*',
      name: 'fulfillment',
      component: () => import('../views/MicroAppRouteView.vue'),
      meta: { microApp: true },
    },
    {
      path: '/settlement/:pathMatch(.*)*',
      name: 'settlement',
      component: () => import('../views/MicroAppRouteView.vue'),
      meta: { microApp: true },
    },
    {
      // 旧链接或错误地址统一回到首页，避免路由无匹配时出现空白页面。
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

router.beforeEach((to) => {
  const authenticated = hasSession()
  if (!to.meta.public && !authenticated) {
    // 保存用户原本要去的页面，登录成功后继续之前的访问目标。
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  // 已登录用户不应停留在登录或注册页，同时必须校验 redirect 是否为站内地址。
  if (to.meta.public && authenticated) return getSafeRedirect(to.query.redirect)
  return true
})

export default router
