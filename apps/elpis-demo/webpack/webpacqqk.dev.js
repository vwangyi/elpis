const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { DefinePlugin } = require('webpack')
const ip = require('ip')
const { VueLoaderPlugin } = require('vue-loader')
const merge = require('webpack-merge')

module.exports = {
  mode: 'development',
  entry: './app/view/main.js',
  output: {
    path: path.resolve(process.cwd(), './public/dist/dev/'), // 输出文件路径
  },
  devServer: {
    static: {
      directory: path.join(__dirname, '../app/public'),
    },
    compress: true,
    port: 8081,
    open: true,
    hot: true,
    historyApiFallback: true, // 支持HTML5 History API
    client: {
      progress: true,
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    onListening(devServer) {
      setTimeout(() => {
        console.clear()
        const port = devServer.server.address().port
        console.log('\n')
        console.log('  App running at:')
        console.log(`  - Local:   \x1b[36mhttp://localhost:${port}/\x1b[0m`)
        console.log(`  - Network: \x1b[36mhttp://${ip.address()}:${port}/\x1b[0m`)
        console.log('\n')
      }, 5000 * 2)
    },
  },
  resolve: {
    // 这里配置了后缀 import 导入文件时 不用写后缀
    extensions: ['.js', '.vue', '.jsx', '.scss', '.less', '.css'],
    // 配置路径别名 映射 import xx from '$pages/xx/xx';
    alias: {
      '@': path.resolve(process.cwd(), './app/view'),
    },
  },

  module: {
    rules: [
      // 对 .vue文件 进行解析
      {
        test: /\.vue$/,
        use: {
          loader: 'vue-loader',
        },
      },
      // 对 .jsx 或 .js 文件 进行解析
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
        },
      },
      // 对 图片等文件 进行解析
      {
        test: /\.(jpg|png|jpeg|gif)(\?.+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 300,
            esModule: false,
          },
        },
        generator: {
          filename: 'imgs/[hash:5][ext][query]', // 对图片进行分类
        },
      },
      // 对 .css文件 进行解析
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      // 对 .less文件 进行解析
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader', // 将 JS 字符串生成为 style 节点
          'css-loader', // 将 CSS 转化成 CommonJS 模块
          'sass-loader', // 将 Sass 编译成 CSS
        ],
      },
      {
        test: /\.styl$/,
        use: ['style-loader', 'css-loader', 'stylus-loader'],
      },
      // 对 字体等文件 进行解析
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.+)?$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[hash][ext][query]',
        },
      },
    ],
  },
}
