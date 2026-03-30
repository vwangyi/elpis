const { VueLoaderPlugin } = require('vue-loader');
// npm i babel-loader thread-loader @babel/plugin-transform-runtime @babel/preset-env -D
const path = require('path');
const os = require('os');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const mockServer = require('../mock/mock-server.js'); // 引入 mock 服务

console.log('当前环境变量：', process.env.VUE_APP_BASE_API);
module.exports = {
  mode: 'development',
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'js/[name]_[chunkhash:8].bundle.js',
    clean: true,
    chunkFilename: 'js/[name]_[chunkhash:8].chunk.js',
    assetModuleFilename: 'assets/[name]_[hash:8][ext][query]',
    // publicPath: "./dist",
    crossOriginLoading: 'anonymous'
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src') // 确保这行存在且路径正确
    },
    extensions: ['.js', '.vue', '.less', '.css', '.scss', '.sass'], // 可以省略文件后缀

    fallback: {
      path: require.resolve('path-browserify'), // 浏览器环境 使用 import path from 'path'
      stream: require.resolve('stream-browserify') // 浏览器环境 使用 import stream from 'stream'
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: { loader: 'vue-loader' }
      },
      {
        oneOf: [
          {
            test: /\.jsx?$/, // 匹配js 或 jsx 文件
            exclude: /node_modules/, // 排除 node_modules 目录下的文件
            use: [
              {
                loader: 'thread-loader', // 开启多线程处理babel-loader
                options: {
                  workers: 2 // 设置线程数，默认为 require("os").cpus().length - 1
                }
              },
              {
                loader: 'babel-loader', // 使用babel-loader处理js文件
                options: {
                  // presets: ['@babel/preset-env'], // 预设在babel.config.js中使用了 这里就不用了
                  cacheDirectory: true, // 启用babel-loader缓存，提高构建速度
                  cacheCompression: false, // 关闭缓存文件压缩，提升性能，因为压缩需要额外的CPU资源
                  plugins: ['@babel/plugin-transform-runtime'] // 使用transform-runtime插件，减少冗余代码，提高性能
                }
              }
            ]
          },

          {
            test: /\.css$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader']
          },
          {
            test: /\.less$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader']
          },
          {
            test: /\.s[ac]ss$/i,
            use: [
              MiniCssExtractPlugin.loader, // style-loader 改为 MiniCssExtractPlugin.loader
              // "css-loader", // 将 CSS 转化成 CommonJS 模块
              {
                loader: 'css-loader',
                options: {
                  // ✅ 显式开启 ICSS 模式，确保 :export 能被识别为 JS 导出
                  modules: {
                    mode: 'icss'
                  }
                }
              },
              // "sass-loader", // 将 Sass 编译成 CSS
              {
                loader: 'sass-loader',
                options: {
                  //   // ✅ 核心配置：全局注入 SCSS 变量
                  //   // 路径需要根据你实际 variables.scss 的位置调整
                  //   data: `@import "@/styles/variables.scss";` // 可以在 vue的script中 import xxx from 'xxx.scss'

                  // ✅ 添加 sassOptions 配置
                  sassOptions: {
                    quietDeps: true, // 沉默依赖包 (node_modules) 中的警告
                    // 或者完全沉默所有警告 (不推荐，会漏掉你自己的代码警告)
                    logger: { warn: () => {} }
                  }
                }
              }
            ]
          },
          {
            test: /\.styl$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader', 'stylus-loader']
          },
          // 处理图片 webpack5 使用内置的 asset模块处理图片资源 不需要npm i
          {
            test: /\.(png|jpg|jpeg|gif|svg|webp)$/i, // 处理 png jpg jpeg gif svg webp 等图片文件
            type: 'asset',
            parser: {
              dataUrlCondition: {
                maxSize: 10 * 1024 // 10kb  单位是b  字节byte  乘1024 转 kb了
              }
            },
            generator: {
              filename: 'img/[hash:8][ext][query]' // 把图片放到output.path里面的 img下
            }
          },
          // 对 字体等文件 进行解析
          {
            test: /\.(woff2?|eot|ttf|otf)(\?.+)?$/, // 匹配字体文件
            type: 'asset/resource', // Webpack5内置的Asset Modules 来处理字体文件
            generator: {
              filename: 'font/[hash][ext][query]'
            }
          },
          // 视频或其他 原封不动的输出到指定地方 都放 assets
          {
            test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.+)?$/, // 匹配视频音频文件
            type: 'asset/resource', // Webpack5内置的Asset Modules 来处理字体文件
            generator: {
              filename: 'assets/[hash][ext][query]'
            }
          }
        ]
      }
    ]
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist')
    },
    compress: true, // 开启gzip压缩
    port: 8081, // 指定端口号
    host: 'localhost', // 指定ip地址
    open: true, // 自动打开浏览器
    hot: true, // 热更新 开启HMR 搜索vue或react对应的热更新插件配置
    historyApiFallback: true, // 支持HTML5 History API  解决开发环境刷新404问题 生产环境用nginx配置解决

    // onBeforeSetupMiddleware: function(devServer) {
    //   mockServer(devServer.app);  // 挂载 mock 路由
    // },
    // ✅ 新版本使用 setupMiddlewares
    setupMiddlewares: (middlewares, devServer) => {
      // 挂载 mock 服务
      if (devServer) {
        mockServer(devServer.app); // 挂载 mock 路由
        console.log('📦 [mock] Mock server mounted');
      }
      return middlewares;
    },
    client: {
      progress: true,
      overlay: {
        errors: true,
        warnings: false
      }
    },

    // proxy: [
    //   {
    //     context: ["/api"], // 需要代理的路径
    //     target: "http://localhost:3000", // 目标服务器
    //     changeOrigin: true, // 推荐开启，解决虚拟主机问题
    //     // pathRewrite: { '^/api': '' }, // 可选：重写路径
    //   },
    //   可以配置多个代理规则
    //   {
    //     context: ['/auth', '/user'],
    //     target: 'http://localhost:4000',
    //   }
    // ],
    onListening(devServer) {
      setTimeout(() => {
        console.clear();
        const port = devServer.server.address().port;
        console.log('\n');
        console.log('  App running at:');
        console.log(`  - Local:   \x1b[36mhttp://localhost:${port}/\x1b[0m`);
        console
          .log
          // `  - Network: \x1b[36mhttp://${ip.address()}:${port}/\x1b[0m`
          ();
        console.log('\n');
      }, 5000 * 2);
    }
  },
  optimization: {
    minimize: true, // 开启压缩
    minimizer: [
      // 压缩js
      new TerserPlugin({
        test: /\.js(\?.*)?$/i, // 匹配需要压缩的文件
        include: /\/src/, // 要包含的文件夹
        exclude: /\/node_modules/, // 要排除的文件夹
        exclude: [
          /\/node_modules\/lodash/, // 不压缩 lodash
          /\/src\/legacy\// // 不压缩 legacy 目录
        ],

        // 多进程并行压缩
        parallel: true, // 默认： true表示 ${os.cpus().length - 1} 个进程 用多少个进程应该随着项目规模调整 因为每个线程初始化启动需要耗时
        parallel: 4, // 写死  4 个进程并行压缩

        // 提取注释到单独文件
        extractComments: true, // 将注释提取到 LICENSE 文件

        // 或者自定义注释提取
        extractComments: {
          condition: /^\**!|@preserve|@license|@cc_on/i,
          filename: fileData => {
            return `${fileData.filename}.LICENSE.txt`;
          },
          banner: licenseFile => {
            return `License information can be found in ${licenseFile}`;
          }
        },

        // Terser 压缩选项
        terserOptions: {
          sourceMap: true, // 启用 source map
          format: {
            comments: false // 移除所有注释
          },
          compress: {
            drop_console: true, // 移除 console.log
            drop_debugger: true, // 移除 debugger
            pure_funcs: ['console.log'], // 移除指定函数
            passes: 2, // 多次压缩优化

            sequences: true, // 连续声明变量
            booleans: true, // 优化布尔值
            loops: true, // 优化循环
            unused: true, // 删除未使用的变量
            warnings: false // 不显示警告
          },
          mangle: true, // 混淆变量名
          toplevel: true, // 顶层变量混淆
          keep_classnames: false, // 不保留类名
          keep_fnames: false // 不保留函数名
        }
      })
    ],

    splitChunks: {
      chunks: 'all', // 对同步模块和异步模块都进行分割
      maxAsyncRequests: 10, // 每次异步加载的最大并行请求数
      maxInitialRequests: 10, // 入口点最大并行请求数
      /**
       * 把 js 文件 按照 改动和引用次数 区分出3种类型 以达到更好利用浏览器缓存的效果
       * 根据经验 配置webpack 把js代码打包出3种类型
       * 1. vendor: 第三方 lib 库   [基本不会改动 除非依赖版本升级]
       * 2. common: 业务组件代码的公共部分抽取出来 [改动较少]
       * 3. entry.{page}: 不用页面 entry 里的业务组件代码的差异部分 [经常改动]
       */
      cacheGroups: {
        // 第三方依赖库
        vendor: {
          // 把node_modules中的文件 打包为单独的一个chunk 取名为vendor
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          priority: 20, // 优先级 数字越大 优先级越高
          enforce: true, // 强制执行
          reuseExistingChunk: true // 复用已有的公共 chunk
        },
        /**
         * 公共模块
         * 打包为公共模块的规则就是 被2处引用的文件 即视为公共模块 就会打包为common里面
         */
        common: {
          // test: /[\\/]common|widgets[\\/]/,
          name: 'common', // 模块名称
          minChunks: 2, // 被2处引用即归为公共模块
          minSize: 1, // 最小分割文件大小设置为 1字节
          priority: 10, // 优先级 数字越大 优先级越高 比 第三方依赖库 优先级高
          reuseExistingChunk: true // 复用已有的公共 chunk
        }
        // xx: {}
      }
    },
    // 将 webpack运行时 生成的代码 单独打包到 runtime.js 比如： runtime~entry.dashboard_9183948e.bundle.js
    runtimeChunk: true
  },
  plugins: [
    new MiniCssExtractPlugin(), // loader和plugin 必须成对使用
    new VueLoaderPlugin(),
    // new HtmlWebpackPlugin({
    //   template: path.resolve(__dirname, "../public/index.html"), // 模板文件路径
    // }),

    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'),
      filename: 'index.html',
      // ✅ 传递 BASE_URL 变量
      BASE_URL: '/', // 或者你的 CDN 域名

      // 或者使用 templateParameters 传递多个变量
      templateParameters: {
        BASE_URL: '/',
        TITLE: 'Elpis Admin'
        // ...其他变量
      }
    }),
    new webpack.DefinePlugin({
      // 这里定义后。就可以在 前端代码中 通过 process.env.NODE_ENV 来访问这个环境变量了
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        VUE_APP_BASE_API: JSON.stringify(process.env.VUE_APP_BASE_API || '/dev-api')
        // 添加其他需要的环境变量
      }
      // 下面的写法 等价上面
      // process: {
      //   // 注入整个 process 对象
      //   env: {
      //     NODE_ENV: JSON.stringify(process.env.NODE_ENV || "development"),
      //     VUE_APP_BASE_API: JSON.stringify(
      //       process.env.VUE_APP_BASE_API || "/api"
      //     ),
      //   },
      // },
    })
  ]
};
