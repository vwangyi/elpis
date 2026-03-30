const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.config.js'); // 基础配置
const HtmlWebpackInjectAttributesPlugin = require('html-webpack-inject-attributes-plugin');
const rootPath = process.cwd(); // 项目根路径 启动命令的路径

// 继承了基础配置
const webpackConfig = merge(baseConfig, {
  mode: 'production', // 指定为 生产环境
  output: {
    filename: 'js/[name]_[chunkhash:8].bundle.js',
    path: path.resolve(rootPath, './dist/'), // 输出文件路径
    globalObject: 'this', // globalObject指向this
    crossOriginLoading: 'anonymous'
  },
  /**
   * webpack 不会有大量的 hints 信息 默认为 waring
   */
  performance: {
    hints: false
  },
  plugins: [
    // 浏览器在请求资源时 不发送用户的身份凭证
    new HtmlWebpackInjectAttributesPlugin({
      crossOrigin: 'anonymous'
    })
  ]
});

webpack(webpackConfig, (err, stats) => {
  if (err) {
    console.log(err);
    return;
  }
  const config = {
    colors: true, // 控制台输出色彩信息
    modules: false, // 不显示每个模块的打包信息
    children: false, // 不显示子编译任务的信息
    chunks: false, // 不显示每个代码块的信息
    chunkModules: true // 显示代码块中模块的信息
  };
  process.stdout.write(`${stats.toString(config)}\n`);
});
