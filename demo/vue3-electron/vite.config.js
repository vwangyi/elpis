import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { devPlugin } from './plugins/devPlugin';
import optimizer from 'vite-plugin-optimizer';

function getOptimizerConfig() {
  const nodeMudules = [
    'electron',
    'os',
    'fs',
    'path',
    'events',
    'child_process',
    'crypto',
    'http',
    'buffer',
    'url',
    'better-sqlite3',
    'knex'
  ];
  return nodeMudules.reduce((prev, curr) => {
    prev[curr] = () => {
      if (curr === 'electron') {
        const electronModules = [
          'clipboard',
          'ipcRenderer',
          'nativeImage',
          'shell',
          'webFrame'
        ].join(',');
        const result = {
          find: new RegExp(`^electron$`), // 使用该正则去匹配 electron 模块
          code: `const { ${electronModules} } = require('electron'); export { ${electronModules} }`
        };
        return result;
      }
      return {
        find: new RegExp(`^(node:)?${curr}$`),
        code: `const ${curr} = require('${curr}'); export { ${curr} as default }`
      };
    };
    return prev;
  }, {});
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    optimizer(getOptimizerConfig()), // 让 渲染进程中 可以使用 node提供的api 和 electron提供的api
    devPlugin(), // 让项目运行在 electron中 而不是浏览器中
    vue()
  ]
});
