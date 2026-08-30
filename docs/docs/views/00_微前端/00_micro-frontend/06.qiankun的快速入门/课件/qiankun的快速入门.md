Single-spa 是一个完整可用的微前端框架
主要做了2件事
1 定义了一套微前端应用的接口规范，子应用必须暴露 bootstrap、mount unmount 这几个生命周期函数

2 实现了一套微前端调度引擎，它拦截路由（hash 和 history）根据当前url决定哪些子应用应该被挂载 哪些应该被卸载，并按照规范调用 子应用的生命周期函数。

所以直接可以用single-spa + systemjs 或 import-map 来加载子应用，缺点是 没有处理 样式隔离、js沙箱、资源加载这些工程问题。

所以可以用于生产 但不好用，需要使用者做很多事。
所以有qiankun基于它二次封装

qiankun是基于single-spa的二次封装的框架
html-entry：
Js沙箱
样式隔离
资源预加载 
应用通信辅助。




# 06. qiankun 的使用

## 这节课要拿到什么结果

这一课只做一件事：把当前项目里本来独立运行的 3 个系统，改成 qiankun 的主应用 + 子应用结构。

你要拿到 3 个结论：

- 主应用怎么把 webpack 子应用接进来
- 为什么同样的思路到了 Vite 子应用这里会先失败
- Vite 子应用为什么要额外加一层适配

这一课先只解决“怎么接进来”。

主子应用的路由同步、嵌入态 memory router 这些问题，放到下一课再处理。

---

## 1. 先把 qiankun 理解成什么

### 1.1 single-spa 是什么

先说白话：single-spa 像一个总调度员。

它不负责写你的业务页面，但它负责决定：

- 当前 URL 应该激活哪个子应用
- 什么时候挂载子应用
- 什么时候卸载子应用

再说术语：single-spa 是一个微前端运行时框架。它要求子应用暴露 3 个生命周期函数：

- `bootstrap`
- `mount`
- `unmount`

然后它会根据路由变化，去调用这些生命周期。

### 1.2 qiankun 是什么

先说白话：qiankun = single-spa + 一层更省事的工程能力。

再说术语：qiankun 是基于 single-spa 的微前端框架，在 single-spa 的基础上补了这些能力：

- HTML Entry
- JS 沙箱
- 样式隔离
- 预加载

这里第一次出现一个新词，先解释一下。

HTML Entry 的白话意思是：你只给 qiankun 一个子应用地址，它就会先拿这个地址对应的 HTML，再把 HTML 里的 JS 和 CSS 解析出来执行。

所以你可以先把 qiankun 理解成两层：

- single-spa 负责调度
- qiankun 负责把接入这件事做得更完整一些

### 1.3 这一课为什么先接 `order-app`

因为 `order-app` 是 webpack 子应用，和 qiankun 官方入门链路最接近。

这一课按这个顺序学最稳：

1. 先把 webpack 子应用接成功
2. 再把 `finance-app` 接进来，并且故意先失败一次
3. 最后再给 Vite 子应用补适配

这样你更容易看清楚：

- 第一次成功靠的是什么
- 第二次失败到底是哪里不一样

---

## 2. 写代码前先确认项目能跑

先在项目根目录执行：

```bash
pnpm install
```

再分别启动 3 个项目：

```bash
pnpm dev:main
```

```bash
pnpm dev:order
```

```bash
pnpm dev:finance
```

默认端口：

- `main-app`：`http://localhost:5173`
- `order-app`：`http://localhost:5174`
- `finance-app`：`http://localhost:5175`

先确认 3 个项目都能独立打开，再开始改代码。

---

## 3. 第一步：先接 `order-app`

### 3.1 这一步会碰哪些文件

- `局部修改`：`main-app/package.json`
- `新增文件`：`main-app/src/components/RoutePortal.vue`
- `新增文件`：`main-app/src/micro-apps.js`
- `整文件替换`：`main-app/src/main.js`
- `整文件替换`：`main-app/src/router/index.js`
- `整文件替换`：`main-app/src/App.vue`
- `新增文件`：`order-app/src/public-path.js`
- `整文件替换`：`order-app/src/main.js`
- `局部修改`：`order-app/webpack.config.cjs`

### 3.2 先给主应用装上 qiankun

文件位置：`main-app/package.json`

修改方式：`局部修改`

在 `dependencies` 里新增 `qiankun`：

```json
"dependencies": {
  "vue": "^3.5.18",
  "vue-router": "^4.6.4",
  "qiankun": "^2.10.16"
}
```

改完依赖后，回到项目根目录重新执行一次：

```bash
pnpm install
```

### 3.3 新建主应用挂载容器

文件位置：`main-app/src/components/RoutePortal.vue`

修改方式：`新增文件`

这个文件的作用很简单：专门给子应用留一个挂载位置。

```vue
<template>
  <section>
    <article class="panel">
      <div class="subapp-host" id="subapp-viewport"></div>
    </article>
  </section>
</template>
```

### 3.4 新建 qiankun 注册文件

文件位置：`main-app/src/micro-apps.js`

修改方式：`新增文件`

先只注册 `order-app`，不要一上来就把 `finance-app` 也接进来。

```js
import { registerMicroApps, start } from "qiankun";

const microApps = {
  order: {
    name: "order-app",
    label: "订单子应用",
    entry: "//localhost:5174",
    activeRule: "/orders",
    defaultPath: "/orders/list",
  },
};

let started = false;

export function getMicroApps() {
  return microApps;
}

export function setupQiankun() {
  if (started) {
    return;
  }

  registerMicroApps([
    {
      name: microApps.order.name,
      entry: microApps.order.entry,
      container: "#subapp-viewport",
      activeRule: microApps.order.activeRule,
    },
  ]);

  start({ prefetch: false });
  started = true;
}
```

这里先记住两句话：

- `registerMicroApps()` 是把子应用清单交给 qiankun
- `start()` 才是让 qiankun 真正开始接管

### 3.5 替换主应用入口

文件位置：`main-app/src/main.js`

修改方式：`整文件替换`

```js
import { createApp, nextTick } from "vue";
import App from "./App.vue";
import { setupQiankun } from "./micro-apps";
import { createHostRouter } from "./router";
import "./style.css";

const router = createHostRouter();
const app = createApp(App);

app.use(router);

router.isReady().then(async () => {
  app.mount("#app");
  await nextTick();
  setupQiankun();
});
```

这里要特别注意 `setupQiankun()` 的执行时机。

为什么要先 `app.mount("#app")`，再 `await nextTick()`，最后才启动 qiankun？

因为子应用容器 `#subapp-viewport` 是在 `App.vue` 里渲染出来的。

如果容器节点还没出现在页面上，你就先 `start()`，qiankun 很容易直接报“找不到挂载容器”。

### 3.6 替换主应用路由

文件位置：`main-app/src/router/index.js`

修改方式：`整文件替换`

```js
import { createRouter, createWebHistory } from "vue-router";
import RoutePortal from "../components/RoutePortal.vue";

const routes = [
  {
    path: "/",
    redirect: "/orders/list",
  },
  {
    path: "/orders/:pathMatch(.*)*",
    component: RoutePortal,
    meta: {
      appName: "order",
    },
  },
  {
    path: "/finance/:pathMatch(.*)*",
    component: RoutePortal,
    meta: {
      appName: "finance",
    },
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/orders/list",
  },
];

export function createHostRouter() {
  return createRouter({
    history: createWebHistory(),
    routes,
  });
}
```

这里最关键的是：

- `/orders/:pathMatch(.*)*` 要把订单子应用的深层路径让出来
- `/finance/:pathMatch(.*)*` 先把财务子应用的路由位留好，下一步再真正接它

### 3.7 替换主应用外壳

文件位置：`main-app/src/App.vue`

修改方式：`整文件替换`

```vue
<script setup>
import { computed } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";
import { getMicroApps } from "./micro-apps";

const route = useRoute();
const microApps = getMicroApps();

const menuItems = [microApps.order].filter(Boolean);

const currentApp = computed(() => {
  return microApps.order;
});
</script>

<template>
  <div class="page-shell">
    <aside class="sidebar">
      <div class="menu-list">
        <RouterLink
          v-for="item in menuItems"
          :key="item.name"
          class="menu-button"
          :class="{ active: currentApp.name === item.name }"
          :to="item.defaultPath"
        >
          <strong>{{ item.label }}</strong>
        </RouterLink>
      </div>
    </aside>

    <main class="workspace">
      <RouterView />
    </main>
  </div>
</template>
```

这一步故意只保留订单菜单。

原因很简单：第一轮先把一条标准链路跑通，不要把成功和失败混在一起看。

### 3.8 给订单子应用补运行时 publicPath

文件位置：`order-app/src/public-path.js`

修改方式：`新增文件`

```js
if (window.__POWERED_BY_QIANKUN__) {
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}
```

先说白话：这段代码是在告诉 webpack，子应用后面继续加载 chunk、图片、样式时，应该回自己家的地址去找，不要误去主应用地址找。

再说术语：这段代码是在 qiankun 环境下，动态改写 webpack 的 `__webpack_public_path__`。

这里顺手记住两个全局变量：

- `window.__POWERED_BY_QIANKUN__`：当前是不是运行在 qiankun 里
- `window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__`：qiankun 注入的真实资源前缀

### 3.9 替换订单子应用入口

文件位置：`order-app/src/main.js`

修改方式：`整文件替换`

```js
import "./public-path";
import { createApp } from "vue";
import { createWebHashHistory } from "vue-router";
import App from "./App.vue";
import { createOrderRouter } from "./router";
import "./style.css";

let app = null;
let router = null;
let mountNode = null;

async function render(props = {}) {
  mountNode = props.container
    ? props.container.querySelector("#app")
    : document.querySelector("#app");

  router = createOrderRouter(createWebHashHistory());

  router.afterEach((to) => {
    document.title = `订单管理 - ${to.meta.title}`;
  });

  app = createApp(App);
  app.use(router);

  await router.isReady();
  app.mount(mountNode);
}

export async function bootstrap() {
  console.info("[order-app] bootstrap");
}

export async function mount(props = {}) {
  await render(props);
}

export async function unmount() {
  app?.unmount();
  app = null;
  router = null;
  mountNode = null;
}

if (!window.__POWERED_BY_QIANKUN__) {
  void render();
}
```

这一步最关键的是 4 件事：

- 入口最顶部先引入 `./public-path`
- 子应用必须导出 `bootstrap`、`mount`、`unmount`
- `mount(props)` 里要兼容 `props.container`
- 独立运行时还要保留自己的启动兜底

### 3.10 修改订单子应用的 webpack 配置

文件位置：`order-app/webpack.config.cjs`

修改方式：`局部修改`

先在文件顶部新增：

```js
const packageName = require("./package.json").name;
```

再把 `output` 改成下面这样：

```js
output: {
  clean: true,
  filename: "js/[name].js",
  path: path.resolve(__dirname, "dist"),
  publicPath: isProduction ? "/" : `//localhost:${port}/`,
  globalObject: "window",
  chunkLoadingGlobal: `webpackJsonp_${packageName}`,
  library: {
    name: `${packageName}-[name]`,
    type: "umd",
  },
},
```

最后给 `devServer` 补跨域头：

```js
devServer: {
  allowedHosts: "all",
  historyApiFallback: true,
  hot: false,
  liveReload: true,
  port,
  client: {
    overlay: true,
  },
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
},
```

这里要把两个词分开记：

- UMD：解决“qiankun 怎么认出你导出的生命周期”
- 运行时 publicPath：解决“后续资源该回哪里继续找”

### 3.11 这一步做完后应该看到什么

重新启动：

```bash
pnpm dev:main
```

```bash
pnpm dev:order
```

```bash
pnpm dev:finance
```

这时预期结果是：

1. 主应用默认进入 `/orders/list`
2. 订单子应用能正常挂载到主应用里
3. 菜单里还看不到财务入口

如果这里已经成功，说明第一条标准链路已经跑通了。

---

## 4. 第二步：再接 `finance-app`，但先故意让它失败一次

### 4.1 这一步会碰哪些文件

- `整文件替换`：`finance-app/src/main.jsx`
- `整文件替换`：`main-app/src/micro-apps.js`
- `整文件替换`：`main-app/src/App.vue`

这一轮先不改 `finance-app/src/router.jsx`。

先把它接进来，再看它为什么会失败。

### 4.2 先按接 `order-app` 的思路硬接一次

文件位置：`finance-app/src/main.jsx`

修改方式：`整文件替换`

这一版不是最终答案。

这一版是故意模拟第一反应：既然订单子应用能这样接，财务子应用也先照这个思路接一次。

```jsx
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { createFinanceRouter } from "./router.jsx";
import "./style.css";

const routerFuture = { v7_startTransition: true };

let root = null;
let mountNode = null;

function render(props = {}) {
  mountNode = props.container
    ? props.container.querySelector("#app")
    : document.querySelector("#app");

  const router = createFinanceRouter();

  root = createRoot(mountNode);
  root.render(<RouterProvider router={router} future={routerFuture} />);
}

export async function bootstrap() {
  console.info("[finance-app] bootstrap");
}

export async function mount(props = {}) {
  render(props);
}

export async function unmount() {
  root?.unmount();
  root = null;
  mountNode = null;
}

if (!window.__POWERED_BY_QIANKUN__) {
  render();
}
```

### 4.3 把 `finance-app` 注册回主应用

文件位置：`main-app/src/micro-apps.js`

修改方式：`整文件替换`

把前面那版文件替换成下面这版：

```js
import { registerMicroApps, start } from "qiankun";

const microApps = {
  order: {
    name: "order-app",
    label: "订单子应用",
    entry: "//localhost:5174",
    activeRule: "/orders",
    defaultPath: "/orders/list",
  },
  finance: {
    name: "finance-app",
    label: "财务子应用",
    entry: "//localhost:5175",
    activeRule: "/finance",
    defaultPath: "/finance/bills",
  },
};

let started = false;

export function getMicroApps() {
  return microApps;
}

export function setupQiankun() {
  if (started) {
    return;
  }

  registerMicroApps([
    {
      name: microApps.order.name,
      entry: microApps.order.entry,
      container: "#subapp-viewport",
      activeRule: microApps.order.activeRule,
    },
    {
      name: microApps.finance.name,
      entry: microApps.finance.entry,
      container: "#subapp-viewport",
      activeRule: microApps.finance.activeRule,
    },
  ]);

  start({ prefetch: false });
  started = true;
}
```

### 4.4 把财务菜单补回主应用

文件位置：`main-app/src/App.vue`

修改方式：`整文件替换`

把前面那版文件替换成下面这版：

```vue
<script setup>
import { computed } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";
import { getMicroApps } from "./micro-apps";

const route = useRoute();
const microApps = getMicroApps();

const menuItems = [microApps.order, microApps.finance].filter(Boolean);

const currentApp = computed(() => {
  if (route.path.startsWith("/finance") && microApps.finance) {
    return microApps.finance;
  }

  return microApps.order;
});
</script>

<template>
  <div class="page-shell">
    <aside class="sidebar">
      <div class="menu-list">
        <RouterLink
          v-for="item in menuItems"
          :key="item.name"
          class="menu-button"
          :class="{ active: currentApp.name === item.name }"
          :to="item.defaultPath"
        >
          <strong>{{ item.label }}</strong>
        </RouterLink>
      </div>
    </aside>

    <main class="workspace">
      <RouterView />
    </main>
  </div>
</template>
```

### 4.5 这时候你大概率会看到什么报错

重新启动后再点财务菜单，`finance-app` 这时大概率挂不上。

常见报错通常是这两类：

- `Cannot use import statement outside a module`
- `@vitejs/plugin-react can't detect preamble`

报错文案可能会有一点差异，但核心问题是同一个：

- 主应用已经把 `finance-app` 注册进来了
- qiankun 也开始拉它的入口了
- 但入口脚本执行阶段和 Vite 开发态机制冲突了

### 4.6 为什么明明也导出了 `mount()`，还是会失败

先说白话：问题不在于你有没有写出 `mount()`，而在于 qiankun 要想真正调到这个 `mount()`，前面还有好几层前提要先成立。

也就是说，源码里“有这个函数”，不等于 qiankun 已经能顺利拿到它、执行它。

原来的 README 这里其实说了 5 层原因，这里不要省略，按学生能理解的顺序把它拆开看。

#### 4.6.1 原因 1：JS 加载和执行方式先冲突了

先说白话：qiankun 接子应用时，习惯的是“我把你的入口脚本抓下来，再按我的方式执行”；但 Vite 开发态输出的是浏览器原生 ESM，这种脚本不是随便换个方式就能执行的。

再说术语：qiankun 的 HTML Entry 链路会抓取子应用 HTML，再解析里面的脚本；Vite 开发态的入口通常是 `type="module"` 的 ESM 脚本，后面还连着 `import` 依赖链和 `import.meta.hot` 这一类开发态能力。

冲突点就在这里：ESM 代码里有 `import` / `export`，而 qiankun 接管入口时那套执行方式，并不是按浏览器原生 ESM 那条链路在跑。

所以最常见的报错就是：

- `Cannot use import statement outside a module`

一旦入口脚本连第一步都没跑起来，后面的 `mount()` 当然也就调不到了。

#### 4.6.2 原因 2：qiankun 的全局沙箱会影响 Vite 的 HMR

先说白话：Vite 开发态的热更新，要往全局环境里挂一些运行时状态；qiankun 的沙箱又想把全局环境隔开。一个想往外放，一个想收住它，两边就会打架。

再说术语：Vite 的 HMR 依赖一批挂在全局对象上的运行时状态；qiankun 默认会通过快照沙箱或 Proxy 沙箱隔离全局变量。这样就可能出现两种问题：

- Vite 写进去的全局状态被沙箱隔离掉
- 或者子应用拿到的全局对象已经不是它原本以为的那个 `window`

结果就是：

- 热更新失效
- 入口脚本行为异常
- 看起来像“页面白屏”或者“没反应”

所以这里不是只有 `mount()` 一个函数的问题，而是开发态整套运行时环境都可能被影响。

#### 4.6.3 原因 3：样式隔离会影响 Vite 的 CSS 注入

先说白话：Vite 开发态的样式，不一定都是提前打包好再一次性挂上去的，很多时候它会在运行时动态插入 `<style>` 标签；而 qiankun 又可能对样式作用范围做隔离，这两边也可能对不上。

再说术语：qiankun 的样式隔离会改变子应用样式生效的边界；Vite 开发态的 CSS 注入和 CSS HMR，又依赖动态创建和替换 `<style>` 标签。

这时就可能出现：

- 样式没生效
- 样式热更新不正常
- 页面不是完全挂不上，而是“挂上了但样式不对”

这也是 Vite 子应用接入 qiankun 时，经常不只是 JS 报错，连样式表现也会一起异常。

#### 4.6.4 原因 4：资源路径和 publicPath 的处理方式不一样

先说白话：就算第一屏侥幸出来了，子应用后面继续加载 chunk、图片、样式时，也可能去错地方找资源。

再说术语：webpack 子应用可以用 `__webpack_public_path__` 配合 qiankun 注入的路径，动态修正资源前缀；但 Vite 不是这套机制，它更依赖 `base`、`import.meta.url` 或插件来处理资源路径。

所以如果没有额外适配，就可能出现：

- 首屏能出来
- 但后续异步资源 404
- 一切页、懒加载、静态资源就开始出问题

这也是为什么前面接 `order-app` 时要补 `public-path.js`，但接 `finance-app` 时不能直接把这套写法照抄过去。

#### 4.6.5 原因 5：生命周期“写出来了”和“能被 qiankun 认出来了”不是一回事

先说白话：你在源码里写了 `bootstrap`、`mount`、`unmount`，只说明这个文件里确实存在这些函数；但 qiankun 还得真的能通过它加载到的入口，把这些函数认出来并调用到。

再说术语：qiankun 更熟悉的是“打包后、按它约定暴露生命周期”的子应用入口；而 Vite 开发态直接跑的是浏览器模块，没有天然给 qiankun 准备好那层它最容易识别的包装。

所以这里最容易踩的误区就是：

- 你看到代码里已经 `export async function mount()` 了
- 就以为 qiankun 一定能拿到它

其实中间还隔着“入口怎么加载、脚本怎么执行、生命周期怎么桥接”这几步。

#### 4.6.6 把这 5 点压成一句话

真正的问题不是“少写了一个 `mount()`”，而是 Vite 开发态和 qiankun 在下面这 5 层上都可能冲突：

1. 入口脚本的加载和执行方式
2. 开发态 HMR 依赖的全局对象
3. 动态样式注入和样式隔离
4. 运行时资源路径
5. 生命周期暴露和识别方式

所以学生在这里最该建立的认知是：

- `finance-app` 失败，不是因为 React 不行
- 也不是因为你忘了写 `mount()`
- 而是因为 Vite 开发态默认不是按 qiankun 最顺手的那套入口协议在跑

---

## 5. 第三步：给 `finance-app` 补上 Vite 适配

### 5.1 这一步会碰哪些文件

- `局部修改`：`finance-app/package.json`
- `整文件替换`：`finance-app/vite.config.js`
- `整文件替换`：`finance-app/src/main.jsx`

### 5.2 先安装 `vite-plugin-qiankun`

文件位置：`finance-app/package.json`

修改方式：`局部修改`

在 `dependencies` 里新增：

```json
"dependencies": {
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^6.30.4",
  "vite-plugin-qiankun": "^1.0.15"
}
```

改完依赖后，回到项目根目录重新执行：

```bash
pnpm install
```

### 5.3 替换 `finance-app/vite.config.js`

文件位置：`finance-app/vite.config.js`

修改方式：`整文件替换`

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import qiankun from "vite-plugin-qiankun";

const port = 5175;

export default defineConfig(({ command }) => {
  const useDevMode = command === "serve";
  const reactPlugins = useDevMode ? [] : [react()];

  return {
    plugins: [...reactPlugins, qiankun("finance-app", { useDevMode })],
    ...(useDevMode
      ? {
          esbuild: {
            jsx: "automatic",
            jsxImportSource: "react",
          },
        }
      : {}),
    server: {
      port,
      strictPort: true,
      cors: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },
    preview: {
      port: 6175,
      strictPort: true,
    },
  };
});
```

这段配置重点看 4 件事：

1. `qiankun("finance-app", { useDevMode })`：把 Vite 子应用桥接成 qiankun 能认的入口
2. `useDevMode ? [] : [react()]`：开发态先把 React 插件的 dev 注入让开，避免和 qiankun 的 HTML Entry 冲突
3. `esbuild`：开发态把 JSX 的基础编译补回来
4. `cors` 和 `Access-Control-Allow-Origin`：允许主应用跨端口拉财务子应用资源

这里再单独记一句：

- webpack 子应用用 `public-path.js` 处理资源路径
- Vite 子应用不认识 `__webpack_public_path__`，这里靠插件接入，部署路径问题则交给 Vite 的 `base`

### 5.4 第二次替换 `finance-app/src/main.jsx`

文件位置：`finance-app/src/main.jsx`

修改方式：`整文件替换`

把前面那版“直觉版”入口，替换成下面这版“适配版”：

```jsx
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import {
  qiankunWindow,
  renderWithQiankun,
} from "vite-plugin-qiankun/dist/helper";
import { createFinanceRouter } from "./router.jsx";
import "./style.css";

const routerFuture = { v7_startTransition: true };

let root = null;
let router = null;
let mountNode = null;

function render(props = {}) {
  mountNode = props.container
    ? props.container.querySelector("#app")
    : document.querySelector("#app");

  router = createFinanceRouter();

  root = createRoot(mountNode);
  root.render(<RouterProvider router={router} future={routerFuture} />);
}

renderWithQiankun({
  bootstrap() {
    console.info("[finance-app] bootstrap");
  },
  mount(props) {
    render(props);
  },
  unmount() {
    root?.unmount();
    root = null;
    router = null;
    mountNode = null;
  },
});

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render();
}
```

这两个 helper 要分开记：

- `renderWithQiankun()`：把 Vite 入口桥接成 qiankun 能调用的生命周期入口
- `qiankunWindow`：让你判断当前是不是运行在 qiankun 里

### 5.5 这次再启动，应该看到什么

重新启动：

```bash
pnpm dev:main
```

```bash
pnpm dev:order
```

```bash
pnpm dev:finance
```

这次预期结果是：

1. 点订单菜单，`order-app` 继续正常
2. 点财务菜单，`finance-app` 能被挂载到主应用里
3. 这时先只看“能不能挂上”，不要急着处理后面的路由同步问题

### 5.6 `vite-plugin-qiankun` 到底在干嘛，以及这一层的边界

先说白话：它像一层翻译器，帮 Vite 应用补上 qiankun 能认的接入方式。

再说术语：它主要做 3 类事：

- 提供 `renderWithQiankun()` 和 `qiankunWindow` 这类 helper
- 让 Vite 子应用能把生命周期接到 qiankun 上
- 在开发态处理 Vite dev 注入和 qiankun HTML Entry 的冲突

但要记住一件事：

它不是把 qiankun 换掉了。

真正的主流程还是：

1. 主应用 `registerMicroApps()`
2. qiankun 拉子应用 HTML
3. qiankun 解析并执行入口
4. qiankun 调用子应用生命周期

插件只是把 Vite 的启动方式，桥接到这条链路上。

这一层还有一个边界要记住：`vite-plugin-qiankun` 的说明里明确提到，Vite 子应用不是完全运行在 qiankun 的 JS 沙箱里。

翻译成人话就是：Vite 子应用里如果随手往 `window` 上挂全局变量，要更谨慎。

这一课先记住 3 个做法：

1. 能不用全局变量，就别用
2. 必须碰运行环境时，优先通过 `qiankunWindow` 判断
3. 跨应用通信优先走 `props`、共享状态或专门的通信层，不要靠 `window.xxx`
