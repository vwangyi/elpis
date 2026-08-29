# 第 26 课案例：Module Federation 运行时模块共享

本案例沿用第 18 课的零售运营工作台业务，但不再使用无界加载完整子应用，而是通过 Webpack 5 Module Federation 在运行时组合业务模块。

## 应用与端口

| 应用 | 技术栈 | 开发端口 | 联邦角色 |
| --- | --- | ---: | --- |
| `main-app` | Vue + Webpack | 5173 | Host，消费远程模块 |
| `order-app` | Vue + Webpack | 5174 | Remote，暴露 Vue 组件 |
| `finance-app` | React + Webpack | 5175 | Remote，暴露框架无关挂载函数 |

两个 Remote 分别提供：

```text
orderApp/OrderOverview
financeApp/mountSettlementOverview
```

## 启动

```bash
pnpm install
pnpm dev
```

打开：

```text
主应用：http://localhost:5173
订单应用：http://localhost:5174/list
财务应用：http://localhost:5175/settlement
```

如果这几个端口已有前面课程的服务，请先在对应终端中停止旧服务。

## 构建与生产预览

```bash
pnpm build
pnpm preview
```

生产预览地址是 `6173`、`6174`、`6175`。主应用的生产构建会分别从下面两个地址请求远程入口：

```text
http://localhost:6174/remoteEntry.js
http://localhost:6175/remoteEntry.js
```

## 课堂观察顺序

1. 分别打开 5174 和 5175，确认两个 Remote 仍可独立运行。
2. 打开 5173，在 Network 中过滤 `remoteEntry`。
3. 刷新页面，观察主应用先加载自己的入口，再加载两个远程入口和业务 chunk。
4. 修改负责人或仓库，观察主应用 props 更新到 Vue 和 React 远程模块。
5. 点击“跟进”或“处理”，观察远程模块通过事件或回调通知主应用。
6. 点击“刷新数据视图”，验证 React Remote 的 `unmount()` 清理契约。
7. 单独停止订单应用后刷新主应用，观察订单插槽降级，而财务插槽和主应用仍然可用。

完整原理与讲解步骤参见项目根目录的《第 26 课：从应用级接入到模块级共享——Webpack Module Federation》。
