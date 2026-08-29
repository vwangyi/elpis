<template>
  <main class="grid min-h-screen place-items-center p-6 text-center">
    <div>
      <p class="text-7xl font-bold text-primary">404</p>
      <h1 class="mt-4 text-2xl font-semibold">页面不存在</h1>
      <p class="mt-2 text-sm text-muted-foreground">当前地址没有对应的履约业务页面。</p>
      <RouterLink
        to="/"
        class="mt-6 inline-block rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
        >返回履约概览</RouterLink
      >
    </div>
  </main>
</template>
