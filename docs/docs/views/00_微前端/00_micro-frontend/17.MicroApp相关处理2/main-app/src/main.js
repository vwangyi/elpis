import { createApp } from "vue";
import microApp from "@micro-zoe/micro-app";
import App from "./App.vue";
import { router } from "./router.js";
import {
  consumeMicroAppFetchDelay,
  reportMicroAppFailure,
} from "./micro-app-fallback.js";
import "./styles.css";

window.runtimeOwner = "main-app";

microApp.start({
  fetch(url, options, appName) {
    const request = () => window.fetch(url, options);
    const responsePromise = consumeMicroAppFetchDelay(appName)
      ? new Promise((resolve) => setTimeout(resolve, 1200)).then(request)
      : request();

    return responsePromise
      .then((response) => {
        if (!response.ok) {
          throw new Error(`资源请求失败：${response.status} ${url}`);
        }
        return response.text();
      })
      .catch((error) => {
        // preFetch 阶段还没有 micro-app 元素，生命周期 error 无法派发，
        // 因此需要在资源请求层把失败同步给主应用的兜底状态。
        if (appName) {
          reportMicroAppFailure({ detail: { name: appName, error } });
        }
        throw error;
      });
  },
  lifeCycles: {
    error(event) {
      reportMicroAppFailure(event);
      console.error("MicroApp load error", event);
    },
  }
});

microApp.preFetch([
  {
    name: "finance",
    url: "http://localhost:5175/",
    iframe: true,
    level: 2,
  },
]);

createApp(App).use(router).mount("#app");
