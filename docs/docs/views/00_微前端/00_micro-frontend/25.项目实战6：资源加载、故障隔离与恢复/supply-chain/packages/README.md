# packages

`packages` 保存不能独立部署、由多个工作区复用的包。

- `design-tokens`：React 与 Vue 共用的颜色、图表配色、圆角、深浅主题变量和主题控制器。
- `api-client`：三个前端共用的请求、错误解析、认证头和只读请求重试标准。
- `auth-session`：三个前端共用的会话存取、登录重定向和安全回跳协议。
- `micro-bridge`：主应用与 Vue/React 子应用共用的共享状态、业务事件契约和通信实现。
- `micro-router`：微应用 native 路由的路径前缀、`history.state` 隔离与 Vue/React 适配。
- `ui-vue`：基于 shadcn-vue、Reka UI、Unovis 和 CVA 的 Vue 共享组件。
- `ui-react`：基于 shadcn/ui、Radix UI、Recharts 和 CVA 的 React 共享组件。
- `eslint-config`：Vue、React、Node 和基础 ESLint 预设。
- `typescript-config`：前端、服务端和基础 TypeScript 预设。

React 与 Vue 的组件模型不同，因此使用两个 UI 包；视觉变量继续由 `design-tokens` 统一。
