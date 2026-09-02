<script setup lang="ts">
import { Button, Card, Input, Label } from '@supply-chain/ui-vue'
import { ArrowRight, Boxes } from 'lucide-vue-next'
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

import AuthShell from '../components/AuthShell.vue'
import { persistSession, register } from '../services/auth'

const router = useRouter()
const username = ref('')
const displayName = ref('')
const organizationCode = ref('GROUP-HQ')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const loading = ref(false)

async function submit() {
  errorMessage.value = ''
  if (password.value !== confirmPassword.value) {
    errorMessage.value = '两次输入的密码不一致'
    return
  }
  loading.value = true
  try {
    const session = await register({
      username: username.value,
      displayName: displayName.value,
      password: password.value,
      organizationCode: organizationCode.value,
    })
    persistSession(session)
    await router.push('/')
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '注册失败'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthShell>
    <div class="w-full max-w-md py-8">
      <div class="mb-7 flex items-center gap-3 lg:hidden">
        <span class="grid size-10 place-items-center rounded-xl bg-blue-600 text-white"
          ><Boxes :size="20" /></span
        ><span class="font-semibold">集团供应链协同平台</span>
      </div>
      <div class="mb-7">
        <h2 class="text-3xl font-semibold tracking-tight">创建平台账号</h2>
        <p class="mt-2 text-slate-500">加入所属组织，开始处理供应链协同任务</p>
      </div>
      <Card class="p-6 sm:p-8">
        <form class="space-y-4" @submit.prevent="submit">
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-2">
              <Label for="displayName">姓名</Label
              ><Input
                id="displayName"
                v-model="displayName"
                autocomplete="name"
                placeholder="请输入姓名"
              />
            </div>
            <div class="space-y-2">
              <Label for="username">用户名</Label
              ><Input
                id="username"
                v-model="username"
                autocomplete="username"
                placeholder="设置用户名"
              />
            </div>
          </div>
          <div class="space-y-2">
            <Label for="organizationCode">组织编码</Label
            ><Input id="organizationCode" v-model="organizationCode" placeholder="请输入组织编码" />
          </div>
          <div class="space-y-2">
            <Label for="password">密码</Label
            ><Input
              id="password"
              v-model="password"
              type="password"
              autocomplete="new-password"
              placeholder="至少 8 位字符"
            />
          </div>
          <div class="space-y-2">
            <Label for="confirmPassword">确认密码</Label
            ><Input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              autocomplete="new-password"
              placeholder="再次输入密码"
            />
          </div>
          <p v-if="errorMessage" class="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">
            {{ errorMessage }}
          </p>
          <Button class="w-full" :disabled="loading"
            >{{ loading ? '注册中…' : '创建账号' }}<ArrowRight class="ml-2" :size="16"
          /></Button>
        </form>
        <p class="mt-6 text-center text-sm text-slate-500">
          已有账号？<RouterLink to="/login" class="ml-1 font-medium text-blue-600"
            >返回登录</RouterLink
          >
        </p>
      </Card>
    </div>
  </AuthShell>
</template>
