# 开发服务器

- https://webpack.docschina.org/configuration/dev-server/

> webpack.config.js

```js
// pnpm i webpack-dev-server -D  必须下载这个插件才可以使用devServer配置项 
// 通过 npx webpack serve 启动
module.exports = {
  mode: "development", // devServer只能开发环境使用
  devServer: {
    port: 8080,
    open: true,
    hot: true,
    compress: true,
    host: 'localhost',
    static: {
      directory: path.resolve(rootPath, './dist')
    },
    client: {
      overlay: true,
      progress: true
    },
    proxy: [
      {
        context: ['/api'], // 注意：属性名从 key 改为 context 数组
        target: 'http://localhost:3002',
        changeOrigin: true
      }
    ],
    // SPA 路由支持
    historyApiFallback: true,

    onListening(devServer) {
      setTimeout(() => {
        console.clear();
        const port = devServer.server.address().port;
        console.log("\n");
        console.log("  App running at:");
        console.log(`  - Local:   \x1b[36mhttp://localhost:${port}/\x1b[0m`);
        console.log(
          `  - Network: \x1b[36mhttp://${ip.address()}:${port}/\x1b[0m`,
        );
        console.log("\n");
      }, 5000 * 2);
    },
  },
};
```

> webpack.config.js

```js
module.exports = {};
```

## 问：devServer 开发服务器原理是什么？

> webpack-dev-server

[http://localhost:8080/webpack-dev-server](http://localhost:8080/webpack-dev-server)

- 业务文件（.vue .jsx .less） >>> 业务产物（.html .css .js)
- devServer 监控能力 用webpack-dev-middleware 中间件实现 监控业务文件是否修改
- devServer 通知能力 用webpack-hot-middleware 中间件实现 通知页面重新请求最新的资源
- 内存：不会物理输出到磁盘 而是在内存中（更新内存 比 更新磁盘更快）







  // devServer: {
  //   static: {
  //     directory: path.join(__dirname, "../app/public"),
  //   },
  //   compress: true,
  //   port: 8081,
  //   open: true,
  //   hot: true,
  //   historyApiFallback: true, // 支持HTML5 History API
  //   client: {
  //     progress: true,
  //     overlay: {
  //       errors: true,
  //       warnings: false,
  //     },
  //   },
  //   onListening(devServer) {
  //     setTimeout(() => {
  //       console.clear();
  //       const port = devServer.server.address().port;
  //       console.log("\n");
  //       console.log("  App running at:");
  //       console.log(`  - Local:   \x1b[36mhttp://localhost:${port}/\x1b[0m`);
  //       console.log(
  //         `  - Network: \x1b[36mhttp://${ip.address()}:${port}/\x1b[0m`,
  //       );
  //       console.log("\n");
  //     }, 5000 * 2);
  //   },
  // },