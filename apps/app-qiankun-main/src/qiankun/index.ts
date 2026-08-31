import { registerMicroApps, start } from 'qiankun';

let started = false;
const defaultPath = ''; // 默认路由
const currentPath = window.location.pathname;
const navigate = (router, path) => {
  const targetPath = path || defaultPath;
  if (router.currentRoute.value.path !== targetPath) {
    void router.push(targetPath);
  }
};
export const apps = [
  {
    name: 'reactApp',
    entry: '//localhost:3000',
    container: '#container',
    activeRule: '/app-react'
  },
  {
    name: 'vueApp',
    entry: '//localhost:8080',
    container: '#container',
    activeRule: '/app-vue'
  },
  {
    name: 'angularApp',
    entry: '//localhost:4200',
    container: '#container',
    activeRule: '/app-angular'
  }
];

export function qiankun(router: any) {
  if (started) return;
  registerMicroApps(apps);
  start();
  started = true;
}
