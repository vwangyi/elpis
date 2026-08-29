import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./router.js";
import { MiniWujie } from "./mini-wujie/index.js";
import "./styles.css";

MiniWujie.start();

createApp(App).use(router).mount("#app");
