import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import type { UserConfig, ConfigEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://cn.vite.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  // 加载.env文件 不会使用node原生提供的process.env 而是用vite提供的import.meta.env
  const env = loadEnv(mode, process.cwd(), '');
  console.log('VITE_BASE_URL', env.VITE_BASE_URL);
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
          target: env.VITE_BASE_URL || 'http://localhost:1234', // 后端 NestJS 默认端口
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, '')
        },
        // /socket.io这个key值是socket.io这个库决定的
        '/socket.io': {
          target: env.VITE_BASE_URL || 'http://localhost:1234',
          changeOrigin: true,
          ws: true // 关键：支持 WebSocket 升级
        }
      }
    }
  };
});
