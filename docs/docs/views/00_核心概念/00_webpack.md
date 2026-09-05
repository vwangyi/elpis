

## 路径别名
路径别名是 通过resolve.alias 设置配置对象。key是@ value是src路径，表示 @映射为src路径
 比如 @: path.resolve(__dirname, 'src')

resolve.extensions: ['.js'] 可以省略后缀 

## 开发服务器
开发服务器就是 开发环境下本地启动服务，  需要下载webpack-dev-server webpack-cli webpack库 
通过 npx webpack serve 启动 
通过 devServer 有默认值 是可选配置


## history路由 
开发环境中 webpack5配置devServer.historyApiFallback为true
生产环境  nginx中配置 xxx 


## HMR原理 热膜替换

hmr是什么

webpack5配置devServer.hot为true


## 跨域问题

1. webpack5配置 devServer.proxy 数组 ,比如包含 /api开头的请求都走代理

## 源码映射
通过devtool配置，devtool: 'eval-cheap-module-source-map',

开发环境使用 生产环境少用 容易泄漏源码 


## 代码分割

通过 pnpm add -D webpack-bundle-analyzer 查看 最大的包 然后 采用 CDN 分包等



- 是什么
- 代码分割是 把js拆分成多个文件实现按需加载。而不是一次性加载所有js。


- 好处是
- 减少首屏加载时间，比如 不能在入口文件一次性引入antd，而是用到某个组件再按需引入。
- 按需加载，当用户点击后才加载 通过 调用import()函数
- 缓存第三方库基建代码 比如 vue antd组件库，业务代码会变动，基建代码不会变动。


- 多入口 entry: {}
- 单入口 splitChunks
- 动态导入 {异步导入、import()}


代码分割的使用场景
    路由懒加载：SPA 中每个路由对应一个 chunk。
    第三方库分离：把 React、Vue、ECharts 等单独打包。
    异步组件：比如弹窗、图表等非首屏组件。
    公共模块抽取：多个页面共用的工具函数、组件


总结：
    Webpack 代码分割就是把代码拆成多个文件，实现按需加载。主要通过三种方式：多入口配置、SplitChunksPlugin 抽取公共代码、动态 import() 语法。它的核心目的是优化首屏性能、提高缓存利用率。实际项目中，我通常会用动态 import 做路由懒加载，再用 splitChunks 把 node_modules 里的第三方库拆成 vendor 包。


文件哈希 

当文件内容一变，文件名的哈希就跟着变，浏览器就需要重新请求整个文件，而 对于 第三方库 不会经常升级修改，用户浏览器不会频繁请求第三方库的代码



## 减少打包体积 

- 按需引入 而不是 全量引入

- CDN 



## 树摇 tree shaking
默认开启



## babal是什么

babel-loader



## webpack
webpack时基于Nodejs的构建工具 像一个编译器，把开发时态的业务代码 编译为 运行时态的产物代码，最终可以让浏览器直接运行。


产物代码 既没有 esm 也没有commonjs 而是一个普通函数


安装 webpack和webpack-cli，虽然是cli命令 仍然推荐局部安装 npm i -D webpack webpack-cli  得到 webpack命令行命令

dev: "webpack --mode dev"
build: "webpack --mode prod"


webpack处理了 比如 模块化兼容性 ，比如 commonjs 导出 用 esm导入 可以直接用 
因为 webpack会处理兼容性，但是建议业务项目中统一用一种esm


## entry

entry默认值是 ./src/index.js
默认出口是 ./dist/main.js




## webpack编译原理
1. 初始化参数。执行 npm run dev 执行 webpack配置文件 导出一个最终配置对象
2. 编译阶段。创建编译器


- module 模块：webpack中每个文件就是一个模块
- chunk：多个模块组成一个chunk 
- bundle：最终输出的产物文件
- hash算法：是 将任意长度字符串 转换为 固定长度的字符串, 比如 sha256、md4、md5。
- hash值：
## AST抽象语法树 



