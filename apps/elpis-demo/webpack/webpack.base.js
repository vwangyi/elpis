const path = require('path')
const glob = require('glob')
const webpack = require('webpack')
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

/**
 * webpack 基础配置
 */
module.exports = {
  mode: 'development',
  entry: './app/view/main.js',
  // 配置出口路径 因为开发环境和生产环境输出不一致 所有在各自环境中自行配置 所以这里注释 开发环境一般也不需要物理输出
  output: {
    filename: 'js/[name]_[chunkhash:8].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: { loader: 'vue-loader' },
      },
      {
        test: /\.jsx?$/,
        include: [path.resolve(process.cwd(), './app/view')],
        use: { loader: 'babel-loader' },
      },
      // 使用 npm i -D url-loader 来处理图片
      {
        test: /\.(jpg|png|jpeg|gif|webp)(\?.+)?$/, // 项目使用的图片后缀 jpp jpeg png gif webp 后续可扩展
        use: {
          loader: 'url-loader',
          options: {
            limit: 300, // 小于300B的文件转为base64
            esModule: false,
            // 建议添加输出路径 path表示图片的相对路径 name是图片的文件名 ext是文件的后缀名
            name: 'imgs/[path][name].[hash:8].[ext]',
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
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
      // webpack4 对 字体等文件 进行解析
      // {
      //   test: /\.(woff2?|eot|ttf|otf)$/i,
      //   use: {
      //     loader: 'file-loader', // webpack4处理字体 需要额外安装 npm i -D file-loader 包
      //     options: {
      //       name: 'fonts/[name].[hash:8].[ext]',
      //       esModule: false  // 如果需要CommonJS模块
      //     }
      //   }
      // },
      // 对 字体等文件 进行解析
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.+)?$/,
        type: 'asset/resource', // Webpack5内置的Asset Modules 来处理字体文件
        generator: {
          filename: 'fonts/[hash][ext][query]',
        },
      },
    ],
  },
  // 配置模块解析的具体行为 方便开发便捷性
  resolve: {
    // 这里配置了后缀 import 导入文件时 不用写后缀
    extensions: ['.js', '.vue', '.jsx', '.scss', '.less', '.css'],
    // 配置路径别名 映射 import xx from '$pages/xx/xx';
    alias: {
      '@': path.resolve(process.cwd(), './app/view'),
    },
  },
  // 配置webpack插件  可以自己封装自己的webpack插件（class）
  plugins: [
    // 每次 build 生产新的dist目录之前 删除之前的dist目录
    new CleanWebpackPlugin(['public/dist'], {
      root: path.resolve(process.cwd(), './app/'),
      exclude: [],
      verbose: true,
      dry: false,
    }),

    /**
     * 将 /\.js$/ 中的规则 应用到 .vue文件中的 <script> 模块里
     * 因为 <script> 里面写的东西就是js
     */
    new VueLoaderPlugin(),
    /**
     * 把第三方库暴露到 window 下
     * 比如说 vue 配置之后 可以 window.Vue 访问
     */
    new webpack.ProvidePlugin({
      Vue: 'vue',
      axios: 'axios',
      lodash: 'lodash',
    }),
    /**
     * webpack.DefinePlugin
     * 定义编译时全局变量 通过 window.__VUE_OPTIONS_API__访问
     * 编译之后（打包之后）的代码不存在这个变量
     */
    new webpack.DefinePlugin({
      /**
       * Vue 3: 是否支持 Options API（传统写法）
       * __VUE_OPTIONS_API__ 设为 false 可以减少包体积（如果只用 Composition API）
       */
      __VUE_OPTIONS_API__: 'true',
      /**
       * __VUE_PROD_DEVTOOLS__ 表示 Vue 3: 生产环境是否启用 DevTools Vue调试工具
       * 开发环境默认为 true，生产环境应设为 false 以提升性能
       */
      __VUE_PROD_DEVTOOLS__: 'false',
      /**
       * 渲染（Rendering）是 生成DOM结构的过程
       * 水合（Hydration）是 为现有DOM添加交互事件的过程
       * 挂载（Mounting）是创建新DOM并附加交互事件的过程
       * 重新渲染（Re-render）是数据变化后 更新dom的过程
      // 禁用生产环境显示 '水合' 信息
       * __VUE_PROD_HYDRATION_MISMATCH_DETAILS__ 表示
       * 生产环境 发生水合错误时 是否显示详细信息  生产环境为false以减小体积并避免暴露内部细节  
       */
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
      /**
       * Node.js 风格的环境变量（很多工具库依赖这个）
       * 必须使用 JSON.stringify
       */
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    /**
     * 构建最终的渲染的html文件或tpl文件
     */
    new HtmlWebpackPlugin({
      template: path.resolve(process.cwd(), './public/template.html'), // 指定HTML模板
      favicon: path.resolve(process.cwd(), './public/favicon.ico'), // 指定 favicon 路径
      title: 'WANGYI',
      // 产物 最终模版 输出路径
      filename: path.resolve(process.cwd(), './public/dist/dev/', `index.html`),
      // 要注入的代码块  <script src="xxx" ></script>
      // chunks: [entryName], // entryPage1和入口的key 一样
    }),
  ],
  /**
   * 配置打包输出优化 （配置代码分割 模块合并 缓存 TreeShaking 代码压缩等优化策略）
   */
  optimization: {
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
          reuseExistingChunk: true, // 复用已有的公共 chunk
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
          reuseExistingChunk: true, // 复用已有的公共 chunk
        },
        // xx: {}
      },
    },
    // 将 webpack运行时 生成的代码 单独打包到 runtime.js 比如： runtime~entry.dashboard_9183948e.bundle.js
    runtimeChunk: true,
  },
}
/**
 * 

  devServer: {
    static: {
      directory: path.join(__dirname, "../app/public"),
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
        console.clear();
        const port = devServer.server.address().port;
        console.log("\n");
        console.log("  App running at:");
        console.log(`  - Local:   \x1b[36mhttp://localhost:${port}/\x1b[0m`);
        console.log(
          `  - Network: \x1b[36mhttp://${ip.address()}:${port}/\x1b[0m`
        );
        console.log("\n");
      }, 5000 * 2);
    },
  },
 */

// const px2vwLoader = {
//   loader: "postcss-loader",
//   options: {
//     postcssOptions: {
//       plugins: [
//         require("postcss-px-to-viewport-8-plugin")({
//           viewportWidth: 1728, // 设计稿宽度
//           unitToConvert: "px", // 要转换的单位
//           viewportUnit: "vw", // 转换后的单位
//           fontViewportUnit: "vw", // 字体使用的视口单位
//           selectorBlackList: [], // 不转换的选择器
//           minPixelValue: 1, // 最小转换值

//           // 可以从px转换为vw的属性列表 涉及到高度的属性的px都不用转vw
//           propList: ["*", "!height", "!margin-top", "!margin-bottom"],
//           mediaQuery: false, // 是否转换媒体查询中的px
//           exclude: [/node_modules/], // 排除的文件
//           include: undefined, // 包含的文件
//           landscape: false, // 是否处理横屏情况
//           landscapeUnit: "vw", // 横屏时使用的单位
//           unitPrecision: 20, // 转换后保留的小数位数
//           landscapeWidth: 812, // 横屏时使用的视口宽度
//         }),
//       ],
//     },
//   },
// };

/**
 * 获取 app/pages 下所有入口文件 （规范 entry.xx.js)
 *
//  */
// const pageEntries = {};
// const htmlWebpackPluginList = [];
// // const entryList = path.resolve(process.cwd(), './app/pages/**/entry.*.js');
// const entryList = path.resolve(process.cwd(), "./app/view/pages/**/entry.*.js");
// // glob.sync(entryList).forEach((file) => {
// //   const entryName = path.basename(file, ".js"); // 拿到文件名 比如 entry.dashboard 或 entry.project-list
// //   pageEntries[entryName] = file;
// //   htmlWebpackPluginList.push(
// //     new HtmlWebpackPlugin({
// //       // 产物 最终模版 输出路径
// //       filename: path.resolve(
// //         process.cwd(),
// //         "./app/public/dist/",
// //         `${entryName}.tpl`
// //       ),
// //       // 指定使用的文件
// //       template: path.resolve(process.cwd(), "./app/public/entry.tpl"),
// //       // 要注入的代码块  <script src="xxx" ></script>
// //       chunks: [entryName], // entryPage1和入口的key 一样
// //     })
// //   );
// // });
