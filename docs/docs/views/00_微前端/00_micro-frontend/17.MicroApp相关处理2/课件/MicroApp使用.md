# 16. MicroApp 使用

## 这节课要拿到什么结果

前面已经使用 qiankun 处理过微前端中的路由、通信、沙箱、样式隔离、保活、预加载和工程兜底。

换成 MicroApp 后，这些问题仍然存在，只是框架提供的接入方式和配置位置发生了变化。

本节需要掌握七个问题：

1. Vite 子应用为什么需要单独考虑原生 ESM 的执行方式？
2. `baseroute`、子应用路由和 `router-mode` 分别解决什么问题？
3. 路由恢复、资源缓存和 `keep-alive` 有什么区别？
4. 定向通信和全局通信分别适合哪些数据？
5. MicroApp 如何处理 JS、DOM 和 CSS 隔离？
6. `preFetch` 提前完成了什么，又没有完成什么？
7. 主应用如何把生命周期和错误信号组织成 loading、success、error 和 retry？

先记住一句话：

```txt
框架可以变化，但浏览器只有一份 URL、一套全局环境和一棵页面树，微前端要解决的基本矛盾不会变化。
```

---

## 1. 配套项目

| 应用 | 技术栈 | 路由 | MicroApp 运行方式 | 主要作用 |
| --- | --- | --- | --- | --- |
| 主应用 | Vue + Vite | history | 不适用 | 应用切换、通信、生命周期和兜底 |
| 订单中心 | Vue + Webpack | history | 默认 with 沙箱、保活 | 路由恢复、定向通信、样式作用域 |
| 财务中心 | React + Vite | hash | iframe | ESM 运行、全局通信、原生隔离 |

启动项目：

```bash
pnpm install
pnpm dev
```

访问地址：

```txt
主应用：http://localhost:5173
订单中心：http://localhost:5174
财务中心：http://localhost:5175
```

生产构建：

```bash
pnpm build
```

需要区分三个容易混淆的维度：

```txt
构建工具：Webpack / Vite
子应用路由：history / hash
MicroApp 路由模式：search / native / native-scope / pure
```

例如“Vite + hash + native + iframe”只是财务应用当前采用的一组配置，不是一条固定公式。

---

## 2. MicroApp 的基础接入

### 2.1 安装并启动 MicroApp

主应用安装：

```bash
pnpm add @micro-zoe/micro-app
```

入口中启动：

```js
import microApp from "@micro-zoe/micro-app";

microApp.start();
```

页面中使用自定义元素：

```html
<micro-app
  name="order"
  url="http://localhost:5174/"
></micro-app>
```

MicroApp 的接入模型是：

```txt
主应用启动 MicroApp
-> 注册 <micro-app> 自定义元素
-> Vue 渲染 <micro-app>
-> Custom Element 进入页面
-> MicroApp 获取子应用 HTML、CSS 和 JS
-> 执行子应用入口
-> 子应用完成 Vue / React 渲染
```

qiankun 更像“注册应用，再根据路由激活”；MicroApp 更像“在页面中使用一个能够加载子应用的组件”。

虽然标签写法更简单，底层仍然要处理资源地址、脚本运行环境、路由、状态、通信和卸载清理。

### 2.2 Vue 主应用识别自定义元素

Vue 默认会尝试把 `<micro-app>` 当作 Vue 组件解析。

Vite 配置中需要告诉 Vue，这是浏览器自定义元素：

```js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag === "micro-app",
        },
      },
    }),
  ],
});
```

这项配置只解决 Vue 模板编译问题，不负责启动或加载子应用。

### 2.3 子应用资源允许跨域

主应用需要从其他端口获取子应用资源，所以开发服务器需要设置 CORS。

Webpack 子应用：

```js
devServer: {
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
}
```

Vite 子应用：

```js
server: {
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
}
```

开发环境可以使用 `*` 简化演示，生产环境应根据真实域名、Cookie 和鉴权策略配置。

---

## 3. Vite 子应用与原生 ESM

### 3.1 “HTML 能请求到”不代表“子应用能运行”

加载子应用至少包含四层：

```txt
能否请求 index.html
-> 能否找到 JS、CSS、图片
-> 能否按正确地址继续加载依赖
-> 脚本能否在微前端沙箱中正确执行
```

Vite 开发态入口通常是：

```html
<script type="module" src="/src/main.jsx"></script>
```

原生 ESM 由浏览器建立模块图，并具有：

```txt
独立模块作用域
静态 import / export
异步加载
浏览器原生 URL 解析
只执行一次的模块缓存语义
```

传统脚本沙箱通常会：

```txt
获取脚本文本
-> 包装进 Function / with
-> 注入代理 window
-> 再执行
```

原生 ESM 不能简单地当作普通脚本文本重新包装，所以 Vite 子应用需要选择与 ESM 执行模型兼容的方案。

### 3.2 本项目使用 iframe 模式

财务应用标签：

```html
<micro-app
  name="finance"
  url="http://localhost:5175/"
  iframe
></micro-app>
```

iframe 提供浏览器原生的：

```txt
window
document
location
history
原生 ESM 执行环境
```

因此 Vite 的模块入口可以继续按浏览器规则运行，不需要强行进入默认 with 沙箱的传统脚本执行链。

这不代表：

```txt
Vite 不能用于微前端
所有 Vite 子应用都必须使用 iframe
React 必须使用 iframe
hash 路由必须使用 iframe
```

本项目选择 iframe，是为了稳定承接 Vite 开发态 ESM，并展示浏览器原生隔离与默认代理沙箱的差别。

### 3.3 iframe 模式的代价

隔离更强也会增加边界：

```txt
主应用样式不会自然进入 iframe
弹层只能在 iframe 文档范围内布局
主子应用需要通过通信通道传递数据
某些需要跨文档定位的组件要单独适配
```

选择运行模式时，需要同时考虑兼容性、隔离强度和业务体验。

---

## 4. 路由处理

### 4.1 路由冲突的根因

主应用和子应用都可能：

```txt
读取 location
调用 pushState / replaceState
监听 popstate
根据 URL 决定渲染内容
```

浏览器却只有一个地址栏和一份原生 History。

因此路由问题的本质是：

```txt
多个应用如何共同使用唯一的浏览器 URL，并明确哪一段地址属于谁。
```

分析路由时要分清四个概念：

| 概念 | 解决的问题 |
| --- | --- |
| 主应用激活规则 | 当前 URL 下应该显示哪个子应用 |
| 子应用路由类型 | 子应用使用 history、hash 还是 memory |
| 子应用基础路径 | 子应用把哪段路径视为自己的根 |
| MicroApp 路由模式 | MicroApp 如何隔离、记录或同步子应用路由 |

### 4.2 `baseroute` 与子应用 base

主应用标签：

```html
<micro-app
  name="order"
  url="http://localhost:5174/"
  baseroute="/micro/order"
  router-mode="native"
></micro-app>
```

订单应用读取 MicroApp 注入的基础路径：

```js
const baseRoute = window.__MICRO_APP_BASE_ROUTE__ || "/";

const router = createRouter({
  history: createWebHistory(baseRoute),
  routes,
});
```

`baseroute` 回答的是：

```txt
子应用应该把哪一段路径当作自己的根？
```

当前地址会形成：

```txt
/micro/order/list
/micro/order/exceptions
```

子应用独立运行时没有 MicroApp 注入值，使用 `/` 作为根路径；嵌入主应用时使用 `/micro/order`。

### 4.3 `router-mode` 解决什么

`router-mode` 回答的是：

```txt
MicroApp 如何处理子应用访问 location 和 history 时产生的路由状态？
```

可以将调用链理解为：

```txt
子应用 Router
-> 沙箱中的 location / history
-> MicroApp 路由层
-> 根据 router-mode 映射到真实浏览器 URL
```

四种模式的主要取向：

| 模式 | 核心特点 | 适用考虑 |
| --- | --- | --- |
| `search` | 子路由信息同步到主应用查询参数 | 更重视路由隔离，可以接受框架化 URL |
| `native` | 子路由自然反映到 pathname 或 hash | 主子应用能够严格约定路径边界 |
| `native-scope` | 在 native 方向上进一步限制子路由作用域 | 需要防止子应用越过自己的基础路径 |
| `pure` | 保留虚拟路由，不同步到浏览器地址 | 不需要刷新恢复和分享深链接 |

选择时主要判断：

```txt
地址栏是否需要显示子路由
是否需要刷新恢复
是否需要浏览器前进后退
谁拥有最终 URL
子应用是否必须限制在基础路径内
```

### 4.4 history、hash、router-mode 和 iframe 不是同一层

财务应用使用 React `HashRouter`：

```jsx
import { HashRouter as Router } from "react-router-dom";
```

同时标签仍可以配置：

```html
router-mode="native"
iframe
```

三者分别表示：

```txt
HashRouter：财务应用怎样表达内部页面
router-mode：MicroApp 怎样处理子应用路由状态
iframe：财务应用 JavaScript 在什么运行环境执行
```

不能因为财务应用使用 hash，就推导出它必须使用 iframe。

---

## 5. 路由恢复、资源缓存和保活

### 5.1 三层状态必须分开

| 层次 | 保留内容 | 不能证明什么 |
| --- | --- | --- |
| 路由状态 | 离开前访问的路径 | 页面组件实例仍然存在 |
| 资源缓存 | HTML、JS、CSS 可以复用 | 表单、DOM 和组件状态还在 |
| 应用保活 | DOM、组件实例和内存状态 | 隐藏应用的后台逻辑已经暂停 |

因此：

```txt
地址恢复 ≠ 实例保活
资源没有重新下载 ≠ 页面状态仍在
```

### 5.2 项目记录最后访问路径

主应用保存每个应用最后一次地址：

```js
const lastAppPaths = {
  order: "/micro/order/list",
  finance: "/micro/finance#/settlement",
};
```

离开应用时记录当前地址：

```js
lastAppPaths[leavingAppName] =
  window.location.pathname +
  window.location.search +
  window.location.hash;
```

进入应用时恢复：

```js
router.push(
  lastAppPaths[appName] || apps[appName].defaultPath,
);
```

它解决的是“回来后进入上次页面”，不是“保留上次页面实例”。

### 5.3 `keep-alive`

订单应用：

```html
<micro-app
  name="order"
  keep-alive
></micro-app>
```

开启后，标签离开当前显示位置时，应用进入缓存状态，不走普通销毁流程；再次显示时恢复原来的运行现场。

典型生命周期：

```txt
首次进入：created -> beforemount -> mounted
切走：afterhidden
切回：beforeshow -> aftershow
```

再次出现 `<micro-app>` 标签节点，不代表内部 Vue 应用重新 mount。需要通过 `mounted`、`afterhidden`、`beforeshow` 和 `aftershow` 判断真实状态。

### 5.4 `keep-router-state` 不是保活

```txt
keep-router-state
  -> 记住卸载前访问的子路由
  -> 再次创建应用时恢复该页面

keep-alive
  -> 保留应用运行现场
  -> DOM、组件实例和内存状态继续存在
```

只恢复路由，表单内容和组件内部状态仍可能丢失。

### 5.5 保活的成本

隐藏不等于暂停：

```txt
定时器可能继续执行
WebSocket 可能继续接收消息
全局监听器可能继续存在
隐藏应用可能继续接收全局数据
DOM 和内存仍然被占用
```

适合保活：

```txt
输入成本高的长表单
频繁往返的工作台
恢复成本明显高于常驻成本的应用
```

不适合默认保活：

```txt
低频应用
内存占用很大
后台副作用较多
每次进入都必须重新校验数据
```

---

## 6. 定向通信和全局通信

### 6.1 先判断数据作用域

| 数据 | 接收范围 | 通信方式 |
| --- | --- | --- |
| 订单仓库、审批权限 | 只属于订单中心 | 定向通信 |
| 主题、登录用户、风控模式 | 多个应用共同关心 | 全局通信 |

通信方式不是根据 API 长短决定，而是根据数据所有权和接收范围决定。

### 6.2 主应用向指定子应用发送数据

```js
microApp.setData("order", {
  warehouse: "华南仓",
  permission: "approve",
});
```

第一个参数 `order` 与标签的 `name="order"` 对应。

订单应用监听：

```js
function receiveData(data) {
  Object.assign(hostContext, data);
}

window.microApp?.addDataListener(receiveData, true);
```

第二个参数 `true` 表示注册监听器时，如果已经存在缓存数据，就立即触发一次。

它处理了异步加载中的时序问题：

```txt
主应用先发送
-> 子应用稍后才启动
-> 子应用仍然可以取得最近一次数据
```

### 6.3 子应用向主应用回传

订单应用：

```js
window.microApp?.dispatch({
  message: "异常订单已处理",
  source: "order",
});
```

主应用在标签上监听：

```html
<micro-app
  name="order"
  @datachange="receiveOrderData"
></micro-app>
```

```js
function receiveOrderData(event) {
  const data = event.detail?.data || {};
  orderMessage.value = data.message;
}
```

### 6.4 全局通信

主应用发布：

```js
microApp.setGlobalData({
  theme: "dark",
  riskMode: true,
});
```

子应用订阅：

```js
function receiveGlobalData(data) {
  Object.assign(globalContext, data);
}

window.microApp?.addGlobalDataListener(
  receiveGlobalData,
  true,
);
```

定向通信与全局通信的区别不是少写了一个应用名，而是数据作用域不同。

```txt
setData(name, data)：发给一个指定应用
setGlobalData(data)：所有关心这份状态的应用都可以接收
```

### 6.5 解除监听

```js
window.microApp?.removeDataListener(receiveData);
window.microApp?.removeGlobalDataListener(receiveGlobalData);
```

监听器是运行期副作用。不清理可能导致：

```txt
重复响应
一次消息执行多次
旧组件被闭包引用
应用销毁后仍无法释放内存
```

保活应用还要决定隐藏期间是否继续接收消息。如果不应该继续处理，需要在隐藏和恢复生命周期中暂停、恢复业务订阅。

### 6.6 框架只提供传输通道

MicroApp 可以把对象从一个应用送到另一个应用，但不会决定：

```txt
谁拥有数据写权限
通信字段如何版本化
刷新后从哪里恢复真实数据
业务操作失败后如何回滚
同一个事件重复到达时如何保持幂等
```

一份重要数据应当有明确负责人。其他应用通过稳定协议读取数据或申请修改，真正的业务状态通常仍需要后端持久化。

---

## 7. JS、DOM 和 CSS 隔离

### 7.1 冲突为什么发生

三个应用都可能执行：

```js
window.runtimeOwner = "当前应用";
```

如果访问同一个真实 `window`，后执行的应用会覆盖前一个值。

三个应用也可能写：

```css
.shared-scope-card {
  background: red;
}
```

浏览器只会按选择器匹配 DOM，并不知道样式属于哪个业务应用。

微前端框架需要把组织上的应用边界转换成浏览器能够执行的运行时边界。

### 7.2 默认 with 沙箱

订单中心使用 MicroApp 默认沙箱。

它可以概括为：

```txt
创建代理 window
-> 使用 with 让子应用变量访问进入代理作用域
-> Proxy 拦截全局属性读写
-> 卸载时清理相关副作用
```

一句话理解：

```txt
with 把访问带到代理边界，Proxy 在边界上处理读写。
```

订单应用写入：

```js
window.runtimeOwner = "order-app";
```

不会覆盖主应用真实 window 上的同名字段。

这与 qiankun Proxy 沙箱属于相近的技术路线，只是框架内部实现细节不同。

### 7.3 iframe 沙箱

财务应用使用 iframe：

```txt
代理沙箱
  -> 同一页面中通过 JavaScript 构造 window 边界

iframe
  -> 浏览器创建独立 window 和 document
```

iframe 的 JS 和 DOM 隔离更强，但样式共享、弹层挂载和跨上下文通信成本也更高。

微前端沙箱主要解决全局变量和运行期副作用冲突，不应当被当成执行不可信第三方代码的安全沙箱。

### 7.4 CSS 作用域隔离

MicroApp 默认会对普通模式子应用的 CSS 选择器增加应用作用域。

概念结果：

```css
/* 子应用原样式 */
.title {
  color: red;
}

/* 处理后的概念结果 */
micro-app[name="order"] .title {
  color: red;
}
```

它主要阻止：

```txt
子应用样式向主应用和其他子应用扩散
```

但选择器前缀通常不能阻止主应用主动向内匹配：

```css
.host-style-invasion .shared-scope-card {
  outline: 3px solid red;
}
```

因此要区分两个方向：

```txt
子应用样式向外：默认 scoped CSS 负责限制
主应用样式向内：普通同文档选择器仍可能匹配
```

关闭作用域隔离可以使用相关禁用配置，但会增加样式污染风险，不应在没有原因时关闭。

### 7.5 元素作用域

主应用和子应用可能都存在：

```html
<div id="app"></div>
```

子应用调用：

```js
document.querySelector("#app");
```

应该优先找到自己的挂载点，而不是主应用节点。MicroApp 会围绕应用容器处理元素查询和动态资源，使子应用操作尽量限制在自己的作用域内。

```txt
CSS 隔离：控制样式能匹配谁
元素隔离：控制子应用代码能查询和操作谁
```

### 7.6 iframe 中的样式边界

财务应用位于独立 iframe document：

```txt
主应用 CSS 不会跨 document 匹配财务 DOM
财务应用 document.querySelector 从 iframe document 开始
```

这属于浏览器原生文档边界，比同一 document 中的选择器前缀更强。

---

## 8. 预加载

### 8.1 下载、执行和挂载是三个阶段

```txt
下载：HTML、JS、CSS 到达浏览器
执行：脚本运行并创建应用环境
挂载：应用 DOM 进入页面并可以交互
```

预加载主要提前进行资源准备，不等于应用已经挂载。

### 8.2 `preFetch`

本项目预加载财务中心：

```js
microApp.preFetch([
  {
    name: "finance",
    url: "http://localhost:5175/",
    iframe: true,
    level: 2,
  },
]);
```

预加载描述中的关键运行配置应与正式渲染保持一致。

财务应用正式使用 iframe，预加载也声明 `iframe: true`，避免预加载模型和最终运行模型不一致。

### 8.3 预加载不等于什么

```txt
不等于组件已经 mounted
不等于业务接口数据已经准备好
不等于页面表单状态已经保存
不等于所有动态 chunk 都一定下载完成
不等于应用保活
```

如果需要预取接口数据，还要设计业务缓存、过期时间、权限校验和失效策略。

### 8.4 预加载的成本

```txt
占用网络带宽
增加浏览器解析工作
占用缓存空间
低概率访问的应用可能永远用不到
```

适合优先预加载高概率的下一跳应用，而不是一次拉取所有后台系统。

### 8.5 预加载与保活的区别

| 能力 | 主要解决的问题 |
| --- | --- |
| 预加载 | 用户第一次进入时，不要才开始下载资源 |
| 路由恢复 | 再次进入时回到上次访问页面 |
| 保活 | 切走时不销毁页面运行现场 |

---

## 9. 工程兜底

### 9.1 主应用需要三种状态

```txt
loading：子应用正在准备
success：子应用已经可以交互
error：子应用加载失败，但主应用仍然可用
```

框架提供生命周期和错误信号，项目负责把信号转换成用户能理解的页面状态。

### 9.2 自定义 `fetch`

主应用启动配置：

```js
microApp.start({
  fetch(url, options, appName) {
    return window.fetch(url, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `资源请求失败：${response.status} ${url}`,
          );
        }
        return response.text();
      });
  },
});
```

`fetch` 由 MicroApp 在加载或预加载 HTML、外链 JS、CSS 等资源时调用。

项目可以在这里实现：

```txt
资源请求
凭证处理
状态码检查
加载耗时记录
测试延迟
预加载失败上报
```

自定义 `fetch` 主要处理 MicroApp 接管的子应用资源，不代表自动拦截子应用的全部业务接口。

### 9.3 全局错误与标签错误

全局生命周期：

```js
microApp.start({
  lifeCycles: {
    error(event) {
      reportMicroAppFailure(event);
    },
  },
});
```

标签事件：

```html
<micro-app
  @error="handleAppError"
></micro-app>
```

两者作用不同：

```txt
lifeCycles.error
  -> 统一记录日志、监控和失败状态

标签 error
  -> 更新当前区域 UI，关闭 loading，展示失败页
```

### 9.4 loading 跟随生命周期

开始加载或恢复显示：

```txt
切换应用
created
beforemount
beforeshow
```

进入 loading。

应用可交互：

```txt
mounted
aftershow
```

结束 loading。

```js
function recordEvent(label, event) {
  const name = event.detail?.name;

  if (["created", "beforemount", "beforeshow"].includes(label)) {
    loadingApps.value = {
      ...loadingApps.value,
      [name]: true,
    };
  }

  if (["mounted", "aftershow"].includes(label)) {
    loadingApps.value = {
      ...loadingApps.value,
      [name]: false,
    };
  }
}
```

不要用固定延时猜测子应用是否加载完成。

### 9.5 预加载失败为什么还要在 fetch 层记录

`preFetch` 可能在 `<micro-app>` 标签出现前执行。

此时页面中没有对应元素，失败无法通过标签 `error` 事件传递给当前组件。因此自定义 `fetch` 还需要记录错误：

```js
return window.fetch(url, options)
  .then((response) => response.text())
  .catch((error) => {
    reportMicroAppFailure({
      detail: { name: appName, error },
    });
    throw error;
  });
```

继续抛出异常，是为了让 MicroApp 本身也进入失败流程，而不是把失败伪装成成功。

### 9.6 错误页面仍要保留主应用能力

错误兜底至少需要提供：

```txt
哪个子应用失败了
可理解的错误说明
重新加载入口
进入其他子系统入口
保持主应用导航和账号区域可用
```

错误状态应优先于 loading：

```html
<section v-if="currentFailure" role="alert">
  子应用暂时无法打开，可以重试或进入其他子系统。
</section>

<section v-else-if="currentAppLoading" role="status">
  正在加载……
</section>
```

### 9.7 重试不刷新整个主应用

本项目先让 Vue 移除失败标签，再销毁 MicroApp 缓存实例并重新渲染：

```js
appElementsVisible.value = {
  ...appElementsVisible.value,
  [name]: false,
};
await nextTick();

if (microApp.getAllApps().includes(name)) {
  await microApp.unmountApp(name, { destroy: true });
}

appUrls.value = {
  ...appUrls.value,
  [name]: apps[name].url,
};
appElementsVisible.value = {
  ...appElementsVisible.value,
  [name]: true,
};
```

先由 Vue 移除自己管理的元素，可以避免 MicroApp 直接删除 DOM 后，Vue 虚拟 DOM 仍然认为旧节点存在。

重试只重建失败子应用，主应用和其他子系统不需要一起刷新。

### 9.8 框架错误不等于完整监控

MicroApp 的 `error` 生命周期主要处理子应用加载或渲染链路失败。

应用运行后的异常仍需要：

```txt
Vue errorHandler
React Error Boundary
window.onerror
unhandledrejection
日志与监控平台
```

---

## 10. 完整操作验证

### 10.1 路由

1. 进入订单中心的“异常处理”。
2. 观察 pathname。
3. 刷新页面，确认主应用和订单页面恢复。
4. 使用浏览器前进、后退。
5. 切换财务中心内部页面，观察 hash。

### 10.2 保活

1. 在订单中心输入未提交内容。
2. 切换到财务中心。
3. 再切回订单中心。
4. 确认输入和子路由仍在。
5. 对照 `afterhidden -> beforeshow -> aftershow`。

### 10.3 通信

1. 主应用切换订单仓库，观察订单中心更新。
2. 切换全局主题和风控模式，观察两个子应用。
3. 由订单中心回传消息，观察主应用信息区。

### 10.4 隔离

1. 对比主应用、订单应用和财务应用的 `window.runtimeOwner`。
2. 检查订单应用处理后的 CSS 选择器。
3. 观察主应用样式可以向内影响普通模式订单应用。
4. 观察主应用 CSS 不会进入财务 iframe。

### 10.5 预加载

1. 清空 Network 后刷新主应用。
2. 不进入财务中心，观察财务资源请求。
3. 首次进入财务中心，观察缓存复用。
4. 对照生命周期，确认预加载没有提前 mounted。

### 10.6 工程兜底

1. 模拟慢加载，观察 loading。
2. 模拟加载失败，观察 error 页面。
3. 确认主应用导航仍可操作。
4. 点击重新加载，观察重新进入 loading 并恢复。

---

## 11. 框架间的处理位置对照

| 共同问题 | qiankun 常见处理位置 | MicroApp 常见处理位置 |
| --- | --- | --- |
| Vite / ESM | 生命周期、构建适配或插件方案 | 可使用 iframe 沙箱承接原生模块环境 |
| 路由冲突 | activeRule、base/basename、memory 和项目同步 | 虚拟路由、`router-mode`、`baseroute` |
| 路由恢复 | 项目记录最后路径 | 路由模式、项目路径记录、`keep-router-state` |
| 应用保活 | 手动实例和常驻容器等项目方案 | `keep-alive` |
| 定向通信 | props、实例 update 等 | `setData`、`dispatch`、`datachange` |
| 全局通信 | `initGlobalState` | `setGlobalData` 和全局监听器 |
| JS 隔离 | Proxy 沙箱 | 默认 with + Proxy，或 iframe |
| CSS 隔离 | 可选选择器改写或 Shadow DOM | 默认 scoped CSS，或 iframe 文档边界 |
| 预加载 | prefetch / prefetchApps | `preFetch` |
| 工程兜底 | loader、全局错误处理和项目状态 | 标签生命周期、全局生命周期、自定义 fetch |

这张表不是功能排名，而是帮助定位：同一个问题最终由框架的哪一层处理。

---

## 12. 常见错误结论

### 12.1 “MicroApp 只写一个标签，所以没有复杂问题”

错误。标签只是接入形式，资源、路由、沙箱、通信、状态和错误仍然存在。

### 12.2 “Vite 子应用不能用于微前端”

错误。问题是原生 ESM 如何进入所选运行环境，而不是 Vite 这个名字本身。

### 12.3 “财务应用使用 hash，所以必须 iframe”

错误。hash 是子应用路由类型，iframe 是脚本运行环境。

### 12.4 “设置 baseroute 就解决了所有路由问题”

错误。它只说明子应用基础路径，还要决定激活规则、router-mode、恢复方式和部署回退。

### 12.5 “keep-alive 就是记住上次路径”

错误。它保留应用运行现场；记住路径只属于路由状态。

### 12.6 “JS 和 CSS 没有重新请求，所以应用仍然保活”

错误。资源缓存不等于组件实例和 DOM 仍然存在。

### 12.7 “全局通信更方便，所以所有数据都放全局”

错误。只属于一个应用的数据应使用定向通道或保留在应用内部。

### 12.8 “默认 CSS 隔离后，主子应用双向都不会污染”

错误。选择器前缀主要防止子应用样式向外扩散，主应用样式仍可能向内匹配普通模式子应用。

### 12.9 “沙箱可以安全运行任意第三方代码”

错误。微前端沙箱主要处理全局变量和副作用隔离，不是完整安全边界。

### 12.10 “预加载等于提前启动应用”

错误。预加载主要准备资源，不等于应用已经执行、挂载或保活。

### 12.11 “注册 error 回调就完成了工程兜底”

错误。还需要 loading、失败页、重试、替代导航、状态清理和完整监控。

---

## 13. 最终总结

面对一个微前端问题，可以按照下面的顺序分析：

```txt
1. 问题发生在加载、路由、状态、通信还是隔离？
2. 浏览器的哪一种共享机制导致了问题？
3. 这份状态或数据应该属于谁？
4. MicroApp 把对应能力封装在哪个配置或 API 中？
5. 这项能力保留或隔离的到底是资源、实例、DOM、路由还是数据？
6. 它的成本和边界是什么？
```

本节最重要的结论：

```txt
Vite / ESM：关注模块如何进入运行环境，iframe 是一种解决路线。

路由：baseroute 分配路径根，router-mode 决定路由怎样隔离和同步。

状态：路由恢复、资源缓存和 keep-alive 是三个层次。

通信：先判断数据作用域，再选择定向或全局通道。

隔离：默认模式使用代理 window 和 scoped CSS，iframe 使用浏览器原生文档边界。

预加载：提前准备资源，不等于提前挂载，也不等于保活。

兜底：框架提供信号，项目负责 loading、success、error 和 retry 的完整体验。
```
