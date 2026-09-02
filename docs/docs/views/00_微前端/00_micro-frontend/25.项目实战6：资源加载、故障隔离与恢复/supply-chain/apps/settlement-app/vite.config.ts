import { fileURLToPath, URL } from 'node:url'

import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import qiankun from 'vite-plugin-qiankun'

const appDirectory = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, appDirectory, '')

  return {
    // 生产构建必须生成子应用自己的绝对资源地址；否则 qiankun 执行
    // import('/assets/...') 时会错误地从主应用 Origin 请求文件。
    base:
      command === 'build'
        ? (env.VITE_SETTLEMENT_PUBLIC_BASE ?? 'http://localhost:6175/')
        : '/',
    // qiankun 开发模式不能执行 React Fast Refresh 注入的 ESM 前导脚本。
    // 构建时仍使用 React 插件，开发时由 Vite 内置的 esbuild 转换 JSX。
    plugins: [
      ...(command === 'build' ? [react()] : []),
      qiankun('settlementApp', { useDevMode: true }),
    ],
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
    server: {
      cors: true,
      hmr: { overlay: false },
      proxy: { '/api': 'http://localhost:3000' },
    },
    build: { rollupOptions: { output: { manualChunks: { charts: ['recharts'] } } } },
  }
})
