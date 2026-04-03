const path = require('path');
const os = require('os');
const webpack = require('webpack');
const {
  VueLoaderPlugin
} = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); //  将 CSS 从 JavaScript 中提取出来，生成独立的 .css 文件
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin'); // 压缩css
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const cpu =
  os.cpus().length - 1;
const rootPath =
  process.cwd(); // 项目根路径 启动命令的路径
const {
  BundleAnalyzerPlugin
} = require('webpack-bundle-analyzer');
const extra = require('fs-extra'); // 安装: pnpm add -D fs-extra

// 在启动服务器前清理dist
function clearDist() {
  const distPath =
    path.resolve(
      rootPath,
      './dist/'
    );
  if (
    extra.existsSync(distPath)
  ) {
    console.log(
      '🧹 清理 dist 目录...'
    );
    extra.emptyDirSync(
      distPath
    );
  }
}
clearDist();
/**
 * webpack 基础配置
 */
module.exports = {
  entry: './src/main.ts',
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader:
              'babel-loader'
          },
          {
            loader:
              'ts-loader',
            options: {
              // transpileOnly: true 表示 让 ts-loader 只处理编译，不进行类型检查 提高编译速度
              // 类型检查交给 ForkTsCheckerWebpackPlugin
              transpileOnly: true,
              // 支持 .vue 文件中的 TypeScript/TSX
              appendTsSuffixTo:
                [/\.vue$/],
              appendTsxSuffixTo:
                [/\.vue$/],
              // 配置项
              configFile:
                path.resolve(
                  rootPath,
                  'tsconfig.json'
                )
            }
          }
        ],
        exclude:
          /node_modules/
      },
      {
        test: /\.vue$/,
        use: {
          loader: 'vue-loader'
        }
      },
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(
            rootPath,
            './src/'
          )
        ],
        use: {
          loader:
            'babel-loader'
        }
      },
      // 使用 npm i -D url-loader 来处理图片
      {
        test: /\.(jpg|png|jpeg|gif|webp)(\?.+)?$/, // 项目使用的图片后缀 jpp jpeg png gif webp 后续可扩展
        use: {
          loader:
            'url-loader',
          options: {
            limit: 300, // 小于300B的文件转为base64
            esModule: false,
            // 建议添加输出路径 path表示图片的相对路径 name是图片的文件名 ext是文件的后缀名
            // name: "imgs/[path][name].[hash:8].[ext]",
            name: 'img/[name].[hash:8].[ext]'
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader'
        ]
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader', // 将 CSS 转化成 CommonJS 模块
          'sass-loader' // 将 Sass 编译成 CSS
        ]
      },
      {
        test: /\.styl$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'stylus-loader'
        ]
      },
      // 对 字体等文件 进行解析
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.+)?$/,
        type: 'asset/resource', // Webpack5内置的Asset Modules 来处理字体文件
        generator: {
          filename:
            'font/[hash][ext][query]'
        }
      },
      // 视频或其他 都放 assets
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.+)?$/,
        type: 'asset/resource', // Webpack5内置的Asset Modules 来处理字体文件
        generator: {
          filename:
            'assets/[hash][ext][query]'
        }
      }
    ]
  },
  // 配置模块解析的具体行为 方便开发便捷性
  resolve: {
    // 这里配置了后缀 import 导入文件时 不用写后缀
    extensions: [
      '.ts',
      '.tsx',
      '.js',
      '.vue',
      '.jsx',
      '.scss',
      '.less',
      '.css'
    ],
    // 配置路径别名 映射 import xx from '$pages/xx/xx';
    alias: {
      '@': path.resolve(
        rootPath,
        './src'
      )
    }
  },
  // 配置webpack插件  可以自己封装自己的webpack插件（class）
  plugins: [
    //   new BundleAnalyzerPlugin({
    //   // 生成一个静态的 HTML 报告文件，而不是启动一个服务器
    //   analyzerMode: 'static',
    //   // 报告文件的名称
    //   reportFilename: 'bundle-report.html',
    //   // 生成报告后是否自动在浏览器中打开
    //   openAnalyzer: true,
    // }),
    new ForkTsCheckerWebpackPlugin(
      {
        typescript: {
          configFile:
            path.resolve(
              rootPath,
              'tsconfig.json'
            )
        },
        async:
          process.env
            .NODE_ENV ===
          'development'
      }
    ),
    new MiniCssExtractPlugin({
      filename:
        'css/[name]_[contenthash:8].css'
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
    new webpack.ProvidePlugin(
      {
        Vue: 'vue',
        axios: 'axios',
        lodash: 'lodash'
      }
    ),
    /**
     * webpack.DefinePlugin  是用来定义 全局变量的
     * 通过 window.__VUE_OPTIONS_API__访问
     * 编译之后（打包之后）的代码就不存在这个变量了 按照指定的判断条件执行了不同情况的代码
     */
    new webpack.DefinePlugin({
      /**
       * Vue 3: 是否支持 Options API（传统写法）
       * __VUE_OPTIONS_API__ 设为 false 可以减少包体积（如果只用 Composition API）
       */
      __VUE_OPTIONS_API__:
        'true',
      /**
       * __VUE_PROD_DEVTOOLS__ 表示 Vue 3: 生产环境是否启用 DevTools Vue调试工具
       * 开发环境默认为 true，生产环境应设为 false 以提升性能
       */
      __VUE_PROD_DEVTOOLS__:
        'false',
      /**
       * 渲染（Rendering）是 生成DOM结构的过程
       * 水合（Hydration）是 为现有DOM添加交互事件的过程
       * 挂载（Mounting）是创建新DOM并附加交互事件的过程
       * 重新渲染（Re-render）是数据变化后 更新dom的过程
      // 禁用生产环境显示 '水合' 信息
       * __VUE_PROD_HYDRATION_MISMATCH_DETAILS__ 表示
       * 生产环境 发生水合错误时 是否显示详细信息  生产环境为false以减小体积并避免暴露内部细节  
       */
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__:
        'false'
      /**
       * Node.js 风格的环境变量（很多工具库依赖这个）
       * 值必须使用 JSON.stringify包裹 才是一个字符串
       */
      // 'process.env.NODE_ENV': JSON.stringify('development')
    }),
    /**
     * 构建最终的渲染的html文件或tpl文件
     */
    new HtmlWebpackPlugin({
      template: path.resolve(
        rootPath,
        './public/template.html'
      ), // 指定HTML模板
      favicon: path.resolve(
        rootPath,
        './public/favicon.ico'
      ), // 指定 favicon 路径
      title: 'WANGYI',
      // 产物 最终模版 输出路径
      filename: path.resolve(
        rootPath,
        './dist/',
        `index.html`
      ),
      // 要注入的代码块  <script src="xxx" ></script>
      // chunks: [entryName], // entryPage1和入口的key 一样
      minify: {
        // collapseWhitespace: true, // 折叠空白
        removeComments: true, // 移除注释
        removeRedundantAttributes: true, // 移除冗余属性
        removeScriptTypeAttributes: true, // 移除 script 的 type 属性
        removeStyleLinkTypeAttributes: true, // 移除 style/link 的 type 属性
        useShortDoctype: true, // 使用短 doctype
        minifyCSS: true, // 压缩 CSS
        minifyJS: true, // 压缩 JS
        minifyURLs: true, // 压缩 URL
        removeEmptyAttributes: true, // 移除空属性
        keepClosingSlash: true // 保留自闭合标签的斜杠
      }
    })
  ],
  /**
   * 配置打包输出优化 （配置代码分割 模块合并 缓存 TreeShaking 代码压缩等优化策略）
   */
  optimization: {
    // 全局关闭 prefetch
    // prefetchChunks: false,
    /**
     * 把 js 文件 按照 改动和引用次数 区分出3种类型 以达到更好利用浏览器缓存的效果
     * 根据经验 配置webpack 把js代码打包出3种类型
     * 1. vendor: 第三方库node_modules   [基本不会改动 除非依赖版本升级]
     * 2. common: 业务组件代码的公共部分抽取出来 [改动较少]
     * 3. entry.{page}: 不用页面 entry 里的业务组件代码的差异部分 [经常改动]
     */
    splitChunks: {
      // chunks: 'async', 表示 import() 异步引入
      chunks: 'all', // 对同步模块和异步模块都进行分割
      maxAsyncRequests: 10, // 每次异步加载的最大并行请求数
      maxInitialRequests: 10, // 入口点最大并行请求数
      cacheGroups: {
        // import(/* webpackChunkName: "@wangeditor/editor-for-vue" */ '@wangeditor/editor-for-vue'),
        // import(/* webpackChunkName: "@wangeditor/editor" */ '@wangeditor/editor'),
        // import(/* webpackChunkName: "@wangeditor/plugin-md" */ '@wangeditor/plugin-md')

        // 第三方 wangeditor
        // 专门给 wangeditor 设立的分组  把wangeditor踢出vendor分组
        wangeditor: {
          // 指定为异步 配合 import()  重要 重要 重要 重要 重要 重要 重要 重要   index.html中不会直接引入当前js
          // 没有import() 此模块就相当于没有配置
          chunks: 'all',
          name: 'wangeditor', // 打包后的文件名会包含这个名字
          test: /[\\/]node_modules[\\/](@wangeditor|wangeditor)/, // 正则匹配包名
          priority: 50, // 【非常重要】优先级必须比 vendor 高！
          // enforce: true,   // 强制生效，即使体积很小也单独打包
          reuseExistingChunk: true, // 允许复用
          filename:
            'js/[name]_[chunkhash:8].bundle.js' // 打包后的文件名会包含这个名字
        },

        // 第三方依赖库
        vendors: {
          chunks: 'all',
          // 把node_modules中的文件 打包为单独的一个chunk 取名为vendor
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          priority: 10, // 优先级 数字越大 优先级越高
          // enforce: true, // 为true 强制执行 表示 忽略 import的分割
          // enforce: false, // 为false，允许其他规则介入
          reuseExistingChunk: true // 复用已有的公共 chunk
          // filename: '[name].bundle.js', // 会多生成一个js 不知道什么意思
        },
        /**
         * 公共模块
         * 打包为公共模块的规则就是 被2处引用的文件 即视为公共模块 就会打包为common里面
         */
        common: {
          chunks: 'all',
          test: /[\\/](components|utils|common)[\\/]/, // 只匹配这些目录
          name: 'common', // 模块名称
          minChunks: 2, // 被2处引用即归为公共模块
          minSize: 1, // 最小分割文件大小设置为 1字节
          priority: 5, // 优先级 数字越大 优先级越高 比 第三方依赖库 优先级高
          reuseExistingChunk: true, // 复用已有的公共 chunk
          enforce: true // 强制拆分（如果前面条件都满足但依旧不生效，可尝试）
        }
        // xx: {}
      }
    },
    // 将 webpack运行时 生成的代码 单独打包到 runtime.js 比如： runtime~entry.dashboard_9183948e.bundle.js
    // runtimeChunk: true,
    runtimeChunk: {
      name: entrypoint =>
        `runtime_${entrypoint.name}` // 指定输出到 runtime 文件夹
    },
    minimizer: [
      new CssMinimizerWebpackPlugin(), // 压缩css
      // 压缩js
      new TerserWebpackPlugin(
        {
          test: /\.js(\?.*)?$/i, // 匹配需要压缩的文件
          include: /\/src/, // 要包含的文件夹
          exclude:
            /\/node_modules/, // 要排除的文件夹
          exclude: [
            /\/node_modules\/lodash/, // 不压缩 lodash
            /\/src\/legacy\// // 不压缩 legacy 目录
          ],

          // cache: true, // 使用缓存 加速构建过程  webpack5 已经移除了 会报错
          // 多进程并行压缩
          parallel: true, // 默认： true表示 ${os.cpus().length - 1} 个进程 用多少个进程应该随着项目规模调整 因为每个线程初始化启动需要耗时
          parallel: cpu,

          // 提取注释到单独文件
          extractComments: true, // 将注释提取到 LICENSE 文件

          // 或者自定义注释提取
          extractComments: {
            condition:
              /^\**!|@preserve|@license|@cc_on/i,
            filename:
              fileData => {
                return `${fileData.filename}.LICENSE.txt`;
              },
            banner:
              licenseFile => {
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
              pure_funcs: [
                'console.log'
              ], // 移除指定函数
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
        }
      )
    ]
  }
};
