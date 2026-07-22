import { createApp } from 'vue';
// https://antdv.com/components/overview-cn
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import './style.css';
import App from './App.vue';

const app = createApp(App);
app.use(Antd);
app.mount('#app').$nextTick(() => {
  window.ipcRenderer.on('main-process-message', (_event, message) => {
    console.log(message);
  });
});
