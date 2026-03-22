

## 临时
```js
const webpack = require('webpack');
const webpackConfig = {
    entry: '',
    output: {},
    module: {}, // loader 加载器

    resolve: {}, // 
    plugins: [], // 配置插件 
    optimization: {}, // 代码分割 输出优化 模块合并 缓存 treeshaking 代码压缩
}

webpack(webpackConfig, (err, stats) => {
    if (err) throw err;

    const result = stats.toString({ 
        colors: true, // 控制台输出色彩信息
        modules: false, // 不显示每个模块的打包信息
        children: false, // 不显示子编译任务的信息
        chunks: false, // 不显示每个代码块的信息
        chunkModules: true, // 显示代码块中模块的信息  
    }); 

    process.stdout.write(`${result}`)
})

```
 

 

## 把vue挂载window上
```js 
const webpack = require("webpack"); 
module.exports = {  
    plugins: [ 
        /**
         * 把第三方库暴露到 window 下
         * 比如说 vue 配置之后 可以 window.Vue 访问
         */
        new webpack.ProvidePlugin({
            Vue: "vue",
            axios: "axios",
            lodash: "lodash",
        }),
    ]
} 
```

## 定义全局变量
```js
// 这个插件在编译阶段做文本替换——不是运行时，是打包时就把代码里的 __VUE_OPTIONS_API__ 等变量直接替换成 "true" 这个字符串。
const webpack = require('webpack'); 
module.exports = {
    plugins: [
        new webpack.DefinePlugin({
            __VUE_OPTIONS_API__: "true", // 传字符串true 意思是  把__VUE_OPTIONS_API__ 替换为 布尔值true 
            __VUE_PROD_DEVTOOLS__: "false",      
            __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: "false",
            "process.env.NODE_ENV": JSON.stringify("development"),
            // 如果需要，再加这个（有些库会检查）
            "process.env.NODE_DEBUG": JSON.stringify(false),
            // 自定义任何值 
            "adc": JSON.stringify('sdfsdf'),
        }),
    ]
}
```

 

## eslint 和 prettier
```js

```

## 代码分割 分包 带出 强缓存 和 协商缓存 
```js

module.exports = {
    
  /**
   * 配置打包输出优化 （配置代码分割 模块合并 缓存 TreeShaking 代码压缩等优化策略）
   */
  optimization: {
    /**
     * 把 js 文件 按照 改动和引用次数 区分出3种类型 以达到更好利用浏览器缓存的效果
     * 根据经验 配置webpack 把js代码打包出3种类型
     * 1. vendor: 第三方 lib 库   [基本不会改动 除非依赖版本升级]。如果第三方包过大 可进行再次分割
     * 2. common: 业务组件代码的公共部分抽取出来 [改动较少]   利用浏览器的强缓存 协商缓存
     * 3. entry.{page}: 不用页面 entry 里的业务组件代码的差异部分 [经常改动]
     */
    splitChunks: {
      chunks: "all", // 对同步模块和异步模块都进行分割
      maxAsyncRequests: 10, // 每次异步加载的最大并行请求数
      maxInitialRequests: 10, // 入口点最大并行请求数
      cacheGroups: {
        // 第三方依赖库
        vendor: {
          // 把node_modules中的文件 比如 vue loadsh  打包为单独的一个chunk 取名为vendor
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
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
          name: "common", // 模块名称
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
```






--------------------------------------------------------------------------------------------------------------------------------------------------
前端构建工具 
手动构建阶段
自动化构建阶段 grunt gulp
模块化构建阶段 webpack rollup.js
bundless构建阶段 vite



Nodejs 
JavaScript
TypeScript
Html&Css

Babel
Webpack
Vite
Rollup
Vue
React 

Business 

