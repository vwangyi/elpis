import { createApp, nextTick } from "vue";
import App from "./App.vue";
import { createHostRouter } from "./router";
import "./style.css";
import {setupQiankun} from "./micro-apps";

const router = createHostRouter();
const app = createApp(App);

app.use(router);

router.isReady().then(async () => {
  app.mount("#app");
  await nextTick();
  setupQiankun();
});