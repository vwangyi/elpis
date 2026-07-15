import { createApp, type App as VueApp } from 'vue';
import { createPinia, type Pinia } from 'pinia';
import persistentState from 'pinia-plugin-persistedstate';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import echarts from 'vue-echarts';
import 'echarts';
import router from './router';
import App from './App';
import '@/styles/index.scss';
import '@/assets/iconfont/iconfont.css';
import '@/router/permission';

import VxeUITable from 'vxe-table';
import 'vxe-table/es/style.css';

// import '@/utils/check-update';
const pinia: Pinia = createPinia();
pinia.use(persistentState);
const app: VueApp = createApp(App);
app.component('vue-echarts', echarts);
app.use(VxeUITable);
app.use(Antd);
app.use(pinia);
app.use(router);
app.mount('#app');

// 导出应用实例（用于测试或其他场景）
export { app, pinia };
