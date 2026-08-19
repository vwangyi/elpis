import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import type { UserConfig, ConfigEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vueDevTools from 'vite-plugin-vue-devtools';

// 一般来说 不会使用 node原生提供的process.env 而是用vite提供的 import.meta.env

// https://cn.vite.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  // 加载 .env 文件（包括 .env.dev 等）
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      vue(),
      vueJsx()
      // vueDevTools()
    ],
    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_SOCKET_BASE_URL || '',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, '')
        },
        '/socket.io': {
          target: env.VITE_SOCKET_BASE_URL || 'http://localhost:3000',
          changeOrigin: true,
          ws: true // 关键：支持 WebSocket 升级
        }
      }
    }
  };
});
