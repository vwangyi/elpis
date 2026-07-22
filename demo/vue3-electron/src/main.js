import { createApp } from 'vue';
import './style.css';
import './assets/css/all.min.css';
import App from './App.vue';
import { createPinia } from 'pinia';
import router from './router';
import './init.js';

const app = createApp(App);

const pinia = createPinia();
app.use(pinia);
app.use(router);
app.mount('#app');
