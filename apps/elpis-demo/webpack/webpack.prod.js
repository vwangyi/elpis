const path = require('path')
const merge = require('webpack-merge')
const os = require('os')
const HappyPack = require('happypack')
// 基础配置
const baseConfig = require('./webpack.base.js')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin')
const HtmlWebpackInjectAttributesPlugin = require('html-webpack-inject-attributes-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')

// 多线程 build 设置
const happyPackCommonConfig = {
  debug: false,
  threadPool: HappyPack.ThreadPool({ size: os.cpus().length }),
}

// 继承了基础配置
const webpackConfig = merge.smart(baseConfig, {
  mode: 'production', // 指定为 生产环境
  // 开发环境的 output 配置
  output: {
    filename: 'js/[name]_[chunkhash:8].bundle.js',
    path: path.join(process.cwd(), './app/public/dist/prod/'),
    publicPath: '/dist/prod/',
    crossOriginLoading: 'anonymous',
  },

  //
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'happypack/loader?id=css'],
      },
      {
        test: /\.js$/,
        // 只对 ./app/pages下的目录进行解析  可以加快webpack打包速度
        // include: [path.resolve(process.cwd(), './app/pages')],
        include: [path.resolve(process.cwd(), './app/view')],
        use: ['happypack/loader?id=js'],
      },
    ],
  },
  /**
   * webpack 不会有大量的 hints 信息 默认为 waring
   */
  performance: {
    hints: false,
  },
  plugins: [
    // 每次 build 生产新的dist目录之前 删除之前的dist目录
    new CleanWebpackPlugin(['public/dist'], {
      root: path.resolve(process.cwd(), './app/'),
      exclude: [],
      verbose: true,
      dry: false,
    }),

    // 提取 css 的公共部分 有效利用缓存 （非公共部分使用 inline）
    new MiniCssExtractPlugin({
      chunkFilename: 'css/[name]_[contenthash:8].bundle.css',
    }),

    // 优化并压缩 css 资源
    new CssMinimizerWebpackPlugin(),

    // 多线程打包 JS 加快打包速度
    new HappyPack({
      ...happyPackCommonConfig,
      id: 'js',
      loaders: [
        `babel-loader?${JSON.stringify({
          presets: ['@babel/preset-env'],
          plugins: ['@babel/plugin-transform-runtime'],
        })}`,
      ],
    }),

    // 多线程打包 css 加快打包速度
    new HappyPack({
      ...happyPackCommonConfig,
      id: 'css',
      loaders: [
        {
          path: 'css-loader',
          options: {
            importLoaders: 1,
          },
        },
      ],
    }),

    // 浏览器在请求资源时 不发送用户的身份凭证
    new HtmlWebpackInjectAttributesPlugin({
      crossOrigin: 'anonymous',
    }),
  ],
  optimization: {
    // 使用 TerserPlugin 的并发和缓存 提升压缩阶段的性能
    minimize: true,
    minimizer: [
      new TerserWebpackPlugin({
        cache: true, // 使用缓存 加速构建过程
        parallel: true, // 使用多核 cpu 加速压缩速度
        terserOptions: {
          compress: {
            drop_console: true, // 删除console.log 因为console.log会让变量保持引用 从而导致 内存泄露
          },
        },
      }),
    ],
  },
})

module.exports = webpackConfig
