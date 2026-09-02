import { createApp } from "vue";
import WujieVue from "wujie-vue3";
import App from "./App.vue";
import {
  fetchMicroResource,
  microApps,
  operatorContext,
} from "./micro-apps.js";
import { router } from "./router.js";
import "./styles.css";

const { setupApp, preloadApp } = WujieVue;

for (const app of Object.values(microApps)) {
  setupApp({
    name: app.name,
    url: app.url,
    alive: app.alive,
    sync: true,
    props: operatorContext,
    fetch: fetchMicroResource,
  });
}

preloadApp({
  name: microApps.finance.name,
  exec: false,
});

createApp(App).use(router).use(WujieVue).mount("#app");
