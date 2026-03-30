const path = require('path');
const { merge } = require('webpack-merge');
const express = require('express');
const consoler = require('consoler');
const webpack = require('webpack');
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
const baseConfig = require('./webpack.config.js');
const fs = require('fs-extra'); // 安装: pnpm add -D fs-extra
const serverConfig = {
  HOST: '127.0.0.1', // 开发环境 肯定为本机
  PORT: 9002, // 随意分配端口号
  HMR_PATH: '__webpack_hmr', // 官方规定
  TIMEOUT: 20000
};
const { HOST, PORT, HMR_PATH, TIMEOUT } = serverConfig;
const rootPath = process.cwd(); // 项目根路径 启动命令的路径

// // 修改entry webpack-hot-middleware插件规定的
// baseConfig.entry = [
//   // hmr 更新入口 官方指定的 hmr路径     双方通信用 eventsource 或 webSockte 都行 这里用的eventsource
//   `webpack-hot-middleware/client?path=${path1}`,
//   baseConfig.entry,
// ];

// 继承基础配置 并重写部分配置
const url = `http://${HOST}:${PORT}/${HMR_PATH}&timeout=${TIMEOUT}&reload=true`; // 开发阶段的 entry 配置需要加入hmr
const webpackConfig = merge(baseConfig, {
  mode: 'development', // 指定为 开发环境
  devtool: 'cheap-module-source-map',
  entry: [
    // hmr 更新入口 官方指定的 hmr路径     双方通信用 eventsource 或 webSockte 都行 这里用的eventsource
    `webpack-hot-middleware/client?path=${url}`,
    baseConfig.entry
  ],
  // 开发环境 的 output 配置
  output: {
    filename: 'js/[name]_[chunkhash:8].bundle.js',
    path: path.resolve(rootPath, './dist/'), // 输出文件路径
    publicPath: `http://${HOST}:${PORT}/public/dist/`, // 外部资源公共路径 这一句决定html中的 js css等静态资源从哪里加载
    globalObject: 'this' // globalObject指向this
  },
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
  plugins: [
    // hmr
    new webpack.HotModuleReplacementPlugin({ multiStep: false })
  ]
});

// console.log('baseConfig', JSON.stringify(baseConfig))
// console.log('webpackConfig', JSON.stringify(webpackConfig))

// ===============================================================================================================================================
// 启动服务
const app = express();
// 指定静态文件目录
app.use(express.static(path.join(__dirname, '../public/dist/')));

const compiler = webpack(webpackConfig);
// 引用 webpackDevMiddleware 中间件（监控文件改动）
app.use(
  devMiddleware(compiler, {
    writeToDisk: filePath => {
      // return filePath.endsWith('.html'); // 物理输出.html文件 其他文件就放到内存中
      return true; // 物理输出所有文件
    },
    publicPath: webpackConfig.output.publicPath, // 设置 资源路径 和 输出的publicPath 一致
    // 解决跨域
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Request-With, content-type, Authorization'
    },
    stats: { colors: true } // 打印要有颜色
  })
);
// 引用 webpack-hot-middleware 中间件（通知）
app.use(
  hotMiddleware(compiler, {
    path: `/${HMR_PATH}`,
    log: () => {}
  })
);

// 添加一个中间件，当访问根路径时返回 index.html
app.get('/', (req, res, next) => {
  const filename = path.join(compiler.outputPath, 'index.html');

  compiler.outputFileSystem.readFile(filename, (err, result) => {
    if (err) {
      return next(err);
    }
    res.set('content-type', 'text/html');
    res.send(result);
    res.end();
  });
});

// 处理 404，返回 index.html（支持 Vue Router 的 history 模式）
// {path: '*', wildcard: true}
// app.get("/*", (req, res) => {
//   const filename = path.join(compiler.outputPath, "index.html");
//   compiler.outputFileSystem.readFile(filename, (err, result) => {
//     if (err) {
//       res.status(404).send("Page not found");
//       return;
//     }
//     res.set("content-type", "text/html");
//     res.send(result);
//     res.end();
//   });
// });

// 在启动服务器前清理
const distPath = path.resolve(rootPath, './dist/');
if (fs.existsSync(distPath)) {
  console.log('🧹 清理 dist 目录...');
  fs.emptyDirSync(distPath);
}

app.listen(PORT, () => {
  consoler.info(`请等待webpack初次构建完成提示...: ${PORT}`);
});
