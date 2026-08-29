import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./router.js";
import { SimpleMicroApp } from "./micro-app/index.js";
import "./styles.css";

SimpleMicroApp.start();

createApp(App).use(router).mount("#app");
