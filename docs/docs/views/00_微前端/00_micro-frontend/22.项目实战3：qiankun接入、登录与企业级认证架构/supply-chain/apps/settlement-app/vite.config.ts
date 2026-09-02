import { fileURLToPath, URL } from 'node:url'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import qiankun from 'vite-plugin-qiankun'

export default defineConfig(({ command }) => ({
  // qiankun 开发模式不能执行 React Fast Refresh 注入的 ESM 前导脚本。
  // 构建时仍使用 React 插件，开发时由 Vite 内置的 esbuild 转换 JSX。
  plugins: [
    ...(command === 'build' ? [react()] : []),
    qiankun('settlementApp', { useDevMode: true }),
  ],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  server: { cors: true, proxy: { '/api': 'http://localhost:3000' } },
  build: { rollupOptions: { output: { manualChunks: { charts: ['recharts'] } } } },
}))
