import { createRouter, createWebHistory } from 'vue-router'

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
  ],
})

router.beforeEach((to) => {
  const hasToken = Boolean(localStorage.getItem('supply-chain-token'))
  if (!to.meta.public && !hasToken) return { name: 'login' }
  if (to.meta.public && hasToken) return { name: 'dashboard' }
  return true
})

export default router
