const path = require("path");
const os = require("os");
const EslintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

os.cpus().length; // 获取当前系统的CPU核心数 线程数一般设置为核心数-1 因为还要留一个核心给主线程处理其他任务

module.exports = {
  // entry: './src/main.js', // 相对启动目录 npm run xxx 的路径
  entry: {
    main: "./src/main.js",
    app: "./src/app.js",
  },
  // 出口
  output: {
    path: path.resolve(__dirname, "./dist"), // 输出文件路径 绝对路径
    filename: "js/[name]_[chunkhash:8].bundle.js", // 输出文件名  [name]是entry的key [chunkhash:8]是8位的hash值
    clean: true, // 每次构建前 把 output.path 目录下的文件清空

    chunkFilename: "js/[name]_[chunkhash:8].chunk.js", // 代码分割后 输出文件名 使用import()动态引入的模块会被分割成单独的chunk  chunkFilename指定这些chunk的输出文件名
    assetModuleFilename: "assets/[name]_[hash:8][ext][query]", // 资源模块 输出文件名  其他资源统一放在assets目录下
  },

  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.vue$/,
            use: { loader: "vue-loader" },
          },
          {
            test: /\.jsx?$/,
            exclude: /node_modules/, // 排除 node_modules 目录下的文件
            use: [
              {
                loader: "thread-loader", // 开启多线程处理babel-loader
                options: {
                  workers: 2, // 设置线程数，默认为os.cpus().length - 1
                },
              },
              {
                loader: "babel-loader", // 使用babel-loader处理js文件
                options: {
                  // presets: ['@babel/preset-env'], // 预设在babel.config.js中使用了 这里就不用了
                  cacheDirectory: true, // 启用babel-loader缓存，提高构建速度
                  cacheCompression: false, // 关闭缓存文件压缩，提升性能，因为压缩需要额外的CPU资源
                  plugins: ["@babel/plugin-transform-runtime"], // 使用transform-runtime插件，减少冗余代码，提高性能
                },
              },
            ],
          },
          {
            test: /\.jsx?$/,
            include: [path.resolve(process.cwd(), "./app/view")],
            use: { loader: "babel-loader" },
          },
          // 使用 npm i -D url-loader 来处理图片
          {
            test: /\.(jpg|png|jpeg|gif|webp)(\?.+)?$/, // 项目使用的图片后缀 jpp jpeg png gif webp 后续可扩展
            use: {
              loader: "url-loader",
              options: {
                limit: 300, // 小于300B的文件转为base64
                esModule: false,
                // 建议添加输出路径 path表示图片的相对路径 name是图片的文件名 ext是文件的后缀名
                // name: "imgs/[path][name].[hash:8].[ext]",
                name: "img/[name].[hash:8].[ext]",
              },
            },
          },
          {
            test: /\.css$/,
            use: [MiniCssExtractPlugin.loader, "css-loader"],
          },
          {
            test: /\.less$/,
            use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"],
          },
          {
            test: /\.s[ac]ss$/i,
            use: [
              MiniCssExtractPlugin.loader,
              "css-loader", // 将 CSS 转化成 CommonJS 模块
              "sass-loader", // 将 Sass 编译成 CSS
            ],
          },
          {
            test: /\.styl$/,
            use: [MiniCssExtractPlugin.loader, "css-loader", "stylus-loader"],
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
            type: "asset/resource", // Webpack5内置的Asset Modules 来处理字体文件
            generator: {
              filename: "font/[hash][ext][query]",
            },
          },
          // 视频或其他 都放 assets
          {
            test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.+)?$/,
            type: "asset/resource", // Webpack5内置的Asset Modules 来处理字体文件
            generator: {
              filename: "assets/[hash][ext][query]",
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new EslintWebpackPlugin({
      context: path.resolve(__dirname, "./src"), // 指定需要 lint 的文件目录
      // extensions: ["js", "vue", "jsx"], // 指定需要 lint 的文件类型
      exclude: "node_modules", // 排除 node_modules 目录
      cache: true, // 启用 eslint-loader 缓存，提高构建速度
      cacheLocation: path.resolve(
        __dirname,
        "./node_modules/.cache/eslintcache",
      ), // 指定 eslint-loader 缓存文件的存储位置
      threads: 2, // 开启多线程处理 eslint-loader，提升性能，线程数一般设置为CPU核心数-1
    }),

    new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "./public/index.html"), // 模板文件路径
    }),


  ],
  // optimization 优化
  optimization: {
    splitChunks: {
        chunks: "all", // 代码分割的范围  all async initial
        minSize: 20000, // 代码分割的最小体积 20KB
        miniRemainingsize: 0, // 代码分割后剩余的最小体积 0KB
        minChunks: 1, // 代码分割的最小引用次数 1次
        maxAsyncRequests: 30, // 按需加载时的最大并行请求数 30
        maxInitialRequests: 30, // 入口点的最大并行请求数 30
        automaticNameDelimiter: "~", // 自动生成的 chunk 名称之间的分隔符 ~
        name: true, // 是否使用自动生成的 chunk 名称

        // cacheGroups 缓存组
        cacheGroups: {
            // vendors： 把 node_modules 目录下的模块单独打包到 vendors 分组中
            vendors: {
                test: /[\\/]node_modules[\\/]/, // 匹配 node_modules 目录下的模块
                priority: -10, // 优先级，数值越大优先级越高
                reuseExistingChunk: true, // 如果当前 chunk 包含已从主 bundle 中拆分出的模块，则它将被重用，而不是生成一个新的模块
            },
            // default：把满足条件的模块打包到 default 分组中
            default: {
                minChunks: 2, // 模块至少被引用两次才会被分割到 default 组
                priority: -20, // 优先级，数值越大优先级越高
                reuseExistingChunk: true, // 如果当前 chunk 包含已从主 bundle 中拆分出的模块，则它将被重用，而不是生成一个新的模块
            },
        },
    },
    minimizer: [
        new CssMinimizerPlugin(), // 压缩CSS
        '...', // 继承webpack内置的js压缩插件（TerserPlugin）
        new TerserWebpackPlugin({
            parallel: true, // 开启多线程压缩，提升性能，线程数一般设置为CPU核心数-1
        }),
        new MiniCssExtractPlugin({
            filename: "css/[name]_[contenthash:8].css", // 输出的CSS文件名
            chunkFilename: "css/[name]_[contenthash:8].chunk.css", // 代码分割后 输出的CSS文件名
        }),
    ],

  },
  mode: "production", // 模式 production development none
};
