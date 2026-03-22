const express = require('express')
const path = require('path')
const consoler = require('consoler')
const webpack = require('webpack')
const devMiddleware = require('webpack-dev-middleware')
const hotMiddleware = require('webpack-hot-middleware')
const { webpackConfig, DEV_SERVER_CONFIG } = require('./webpack.dev.js')
const compiler = webpack(webpackConfig)
const app = express()

// 指定静态文件目录
app.use(express.static(path.join(__dirname, '../public/dist/dev/')))

// 引用 webpackDevMiddleware 中间件（监控文件改动）
app.use(
  devMiddleware(compiler, {
    writeToDisk: (filePath) => {
      console.log('filePath', filePath)
      return true // 输出所有文件

      return filePath.endsWith('.html') // ||  filePath.endsWith('.ico')
    }, // html文件需要物理输出 其他文件就放到内存中
    publicPath: webpackConfig.output.publicPath, // 设置 资源路径 和 输出的publicPath 一致
    // 解决跨域
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Request-With, content-type, Authorization',
    },
    stats: { colors: true }, // 打印要有颜色
  }),
)
// 引用 webpack-hot-middleware 中间件（通知）
app.use(
  hotMiddleware(compiler, {
    path: `/${DEV_SERVER_CONFIG.HMR_PATH}`,
    log: () => {
      console.log(2222)
    },
  }),
)

app.listen(DEV_SERVER_CONFIG.PORT, () => {
  consoler.info(`请等待webpack初次构建完成提示...: ${DEV_SERVER_CONFIG.PORT}`)
})
