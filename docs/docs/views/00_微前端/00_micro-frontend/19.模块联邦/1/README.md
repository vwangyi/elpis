# Vue 主应用加载 Vue 与 React 子应用模块

这个案例有三个工程：

- `host-app`：Vue 主应用，运行在 5300；
- `vue-remote-app`：Vue 子应用，运行在 5301；
- `react-remote-app`：React 子应用，运行在 5302。

两个子应用都能独立打开，也都会通过 Module Federation 暴露一个组件。主应用页面先演示 Vue 加载 Vue，再演示 Vue 加载 React。

```bash
pnpm install
pnpm dev
```

- Host：http://localhost:5300
- Vue Remote：http://localhost:5301
- React Remote：http://localhost:5302

打开 Vue 主应用，在浏览器 Network 中过滤 `remoteEntry`：

1. 点击“加载 Vue 组件”，观察主应用从 5301 加载 Vue 组件；
2. 点击“加载 React 组件”，观察主应用从 5302 加载 React 挂载模块。

```bash
pnpm build
```

先看 Vue 加载 Vue：

1. `vue-remote-app/webpack.config.js` 用 `exposes` 暴露 `UserCard.vue`；
2. `host-app/webpack.config.js` 用 `remotes` 配置子应用地址；
3. `host-app/src/App.vue` 导入后直接用 `<component>` 渲染。

Host 与 Vue Remote 都用 `main.js -> import("./bootstrap.js")` 异步启动，让联邦运行时先初始化共享的 Vue。

再看 Vue 加载 React：

1. `react-remote-app/src/mountHelloCard.jsx` 把 React 渲染包装成 `mount/update/unmount`；
2. `react-remote-app/webpack.config.js` 暴露这个挂载模块；
3. `host-app/src/App.vue` 导入挂载函数，并把 DOM 容器交给 React。
