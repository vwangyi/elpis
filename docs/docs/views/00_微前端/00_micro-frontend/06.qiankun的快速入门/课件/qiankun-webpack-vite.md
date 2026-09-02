结论：**qiankun 和 webpack、vite 都不是强绑定，理论上都可以配合，但 webpack 是目前最成熟、坑最少的组合；vite 可以接，但需要额外插件和配置，尤其在开发模式下有兼容成本。**

### 为什么会有这个区别？

qiankun 加载子应用的默认方式是：

1. 读取子应用的 `entry` HTML；
2. 解析出其中的 JS/CSS；
3. 通过 `import-html-entry` 执行 JS；
4. 子应用 JS 需要以 **UMD** 之类的格式暴露 `bootstrap`、`mount`、`unmount` 生命周期。

所以关键点在于：**子应用构建产物要能导出 qiankun 需要的生命周期，并且能在 qiankun 沙箱里正常执行。**

- **Webpack**：很容易配置成 UMD，官方示例和社区实践基本都是 webpack，支持最好。
- **Vite**：开发态是原生 ESM，默认不是 UMD，qiankun 原生对 `type="module"` 的脚本处理不完善，所以需要借助 `vite-plugin-qiankun` 这类插件，或者生产构建转成 UMD/兼容格式。

### 推荐选择

| 场景 | 建议 |
|------|------|
| 新项目微前端，想稳定落地 | **主应用、子应用统一用 webpack** |
| 子应用已经用 Vite，或团队非常想用 Vite 开发体验 | 可以用 **vite-plugin-qiankun**，但要做好踩坑准备 |
| 主应用 webpack，子应用混合 webpack 和 vite | 可以，但尽量少混合，避免维护成本 |

### Webpack 子应用关键配置

```js
output: {
  library: 'app-name',
  libraryTarget: 'umd',
  globalObject: 'window',
  jsonpFunction: 'webpackJsonp_app-name', // 避免多应用冲突
  publicPath: 'http://localhost:3000/'
}
devServer: {
  headers: { 'Access-Control-Allow-Origin': '*' }
}
```

### Vite 子应用关键点

- 使用 `vite-plugin-qiankun`；
- 配置 `base` 为完整地址，保证资源路径正确；
- 开发服务器开启 CORS；
- 生产构建通常需要插件帮助导出 UMD/生命周期。

```js
import qiankun from 'vite-plugin-qiankun'

export default {
  plugins: [
    qiankun('app-name', { useDevMode: true })
  ],
  server: {
    cors: true,
    origin: 'http://localhost:3000'
  }
}
```

### 最终建议

如果你现在还没有历史包袱，**优先选 webpack + qiankun**，这是生态最完善、文档和案例最多的组合。  
如果已经有 Vite 项目，或者很想享受 Vite 的开发速度，可以使用 `vite-plugin-qiankun`，但需要接受一定的集成成本和潜在坑。