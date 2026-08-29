<script setup lang="ts">
import { Button, Card, Input, Label } from '@supply-chain/ui-vue'
import { ArrowRight, Boxes } from 'lucide-vue-next'
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

import AuthShell from '../components/AuthShell.vue'
import { login, persistSession } from '../services/auth'

const router = useRouter()
const username = ref('')
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)

async function submit() {
  errorMessage.value = ''
  loading.value = true
  try {
    persistSession(await login(username.value, password.value))
    await router.push('/')
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '登录失败'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthShell>
    <div class="w-full max-w-md">
      <div class="mb-8 flex items-center gap-3 lg:hidden">
        <span class="grid size-10 place-items-center rounded-xl bg-blue-600 text-white"
          ><Boxes :size="20" /></span
        ><span class="font-semibold">集团供应链协同平台</span>
      </div>
      <div class="mb-7">
        <h2 class="text-3xl font-semibold tracking-tight">欢迎回来</h2>
        <p class="mt-2 text-slate-500">登录后进入集团运营驾驶舱</p>
      </div>
      <Card class="p-6 sm:p-8">
        <form class="space-y-5" @submit.prevent="submit">
          <div class="space-y-2">
            <Label for="username">用户名</Label
            ><Input
              id="username"
              v-model="username"
              autocomplete="username"
              placeholder="请输入用户名"
            />
          </div>
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <Label for="password">密码</Label
              ><button type="button" class="text-sm text-blue-600">忘记密码？</button>
            </div>
            <Input
              id="password"
              v-model="password"
              type="password"
              autocomplete="current-password"
              placeholder="请输入密码"
            />
          </div>
          <p v-if="errorMessage" class="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">
            {{ errorMessage }}
          </p>
          <Button class="w-full" :disabled="loading"
            >{{ loading ? '登录中…' : '登录' }}<ArrowRight class="ml-2" :size="16"
          /></Button>
        </form>
        <p class="mt-6 text-center text-sm text-slate-500">
          还没有账号？<RouterLink to="/register" class="ml-1 font-medium text-blue-600"
            >申请注册</RouterLink
          >
        </p>
      </Card>
    </div>
  </AuthShell>
</template>
