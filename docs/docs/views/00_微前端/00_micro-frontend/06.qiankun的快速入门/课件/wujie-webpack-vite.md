结论：**wujie 和 webpack、vite 都没有强关联，都可以配合，而且几乎不需要为构建工具做特殊适配。**

### 为什么都可以配合？

wujie 的核心设计是 **iframe + WebComponent**：

- 子应用被加载进一个隔离的 iframe 中运行；
- 主应用通过 WebComponent 将子应用的 DOM 挂载到指定容器；
- 子应用的加载方式就是**提供一个 URL（entry）**，wujie 直接请求该 URL 对应的 HTML 页面。

所以只要你的子应用（无论用 webpack 还是 vite 构建）能正常通过 HTTP 访问，就能被 wujie 加载。**构建工具只负责产出浏览器可运行的资源，wujie 不关心这些资源是 UMD、ESM 还是其他格式。**

### 对比 qiankun

qiankun 之所以对构建工具有要求，是因为它需要子应用暴露生命周期（bootstrap/mount/unmount），并且默认解析的是 UMD 格式的 JS。而 wujie 不需要这些约定，子应用**不需要任何改造**，甚至不需要导出任何东西，天然支持 Vite、Webpack、任意框架。

### 实际使用中的注意点

虽然构建工具无关，但有一些通用要求：

1. **子应用必须可跨域访问**：  
   如果子应用和主应用不同源，需要在子应用服务器上设置 CORS 头（`Access-Control-Allow-Origin: *`）。这与构建工具无关，是 HTTP 服务器配置。

2. **子应用的资源路径**：  
   如果子应用部署在子路径或 CDN，需要确保 `base` 或 `publicPath` 配置正确，使 JS/CSS/图片等资源能被正确加载。这一点在 webpack 和 vite 中配置方式不同，但都是常规配置。

3. **主应用可以是任何框架/构建工具**：  
   主应用用 Vite 还是 webpack 构建都不影响 wujie 的使用，因为 wujie 只是一个运行时库，通过 npm 安装引入即可。

### 推荐

- 如果你已经有现成的 webpack 或 vite 项目，**直接接入 wujie 即可，不需要更换构建工具**。
- 如果你正在新建项目，**主应用和子应用可以根据团队喜好自由选择**，比如主应用用 Vite 享受开发速度，子应用用 webpack 或 Vite 都可以。

所以答案是：**wujie 与 webpack、vite 都能完美配合，没有偏向性。** 这是它相比 qiankun 的一个重要优势。
