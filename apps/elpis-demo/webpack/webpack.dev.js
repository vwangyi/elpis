const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.js') // 基础配置
// devServer 配置
const DEV_SERVER_CONFIG = {
  HOST: '127.0.0.1',
  PORT: 9002,
  HMR_PATH: '__webpack_hmr', // webpack官网上规定
  TIMEOUT: 20000,
}
const { HOST, PORT, HMR_PATH, TIMEOUT } = DEV_SERVER_CONFIG

// 开发阶段的 entry 配置需要加入hmr
const path1 = `http://${HOST}:${PORT}/${HMR_PATH}&timeout=${TIMEOUT}&reload=true`

// 修改entry webpack-hot-middleware插件规定的
baseConfig.entry = [
  // hmr 更新入口 官方指定的 hmr路径     双方通信用 eventsource 或 webSockte 都行 这里用的eventsource
  `webpack-hot-middleware/client?path=${path1}`,
  baseConfig.entry,
]

const outputPath = path.resolve(process.cwd(), './public/dist/dev/')

console.log('outputPath', outputPath)

// 继承了基础配置
const webpackConfig = merge.smart(baseConfig, {
  mode: 'development', // 指定为 开发环境
  devtool: 'eval-cheap-module-source-map', // 开发环境打开sourceMap

  // 开发环境 的 output 配置
  output: {
    filename: 'js/[name]_[chunkhash:8].bundle.js',
    path: path.resolve(process.cwd(), './public/dist/dev/'), // 输出文件路径
    publicPath: `http://${HOST}:${PORT}/public/dist/dev/`, // 外部资源公共路径 这一句决定html中的 js css等静态资源从哪里加载
    globalObject: 'this', // globalObject指向this
  },

  plugins: [
    // hmr
    new webpack.HotModuleReplacementPlugin({ multiStep: false }),
  ],
})

module.exports = {
  webpackConfig,
  DEV_SERVER_CONFIG, // devServer配置 暴露给 build.dev.js使用
}
