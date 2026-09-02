const { defineConfig } = require('@vue/cli-service')
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const chunkConfig = require("./build/webpack.chunk.js");

const isProduction = process.env.NODE_ENV === 'production'
/* cdn相关处理
const cdn = {
  externals: {
    vue: 'Vue',
    "vue-router": "VueRouter",
    "echarts": "echarts",
    "vue-echarts": "VueECharts",
    "@vueuse/core": "VueUse",
    "element-plus": 'ElementPlus',
  },
  js: [
    "https://cdn.jsdelivr.net/npm/vue@3.3.4/dist/vue.global.min.js",
    "https://cdn.jsdelivr.net/npm/vue-router@4.2.4/dist/vue-router.global.min.js",
    "https://cdn.jsdelivr.net/npm/@vueuse/shared@10.4.1/index.iife.min.js",
    "https://cdn.jsdelivr.net/npm/@vueuse/core@10.4.1/index.iife.min.js",
    "https://cdn.jsdelivr.net/npm/element-plus@2.3.12/dist/index.full.min.js",
    "https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js",
    "https://cdn.jsdelivr.net/npm/vue-echarts@6.6.1/dist/index.umd.min.js"
  ],
  css: [
    "https://cdn.jsdelivr.net/npm/element-plus@2.3.12/dist/index.min.css",
    "https://cdn.jsdelivr.net/npm/vue-echarts@6.6.1/dist/csp/style.min.css"
  ]
}
*/

let configureWebpack = {
  plugins: [
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    isProduction && new BundleAnalyzerPlugin()
  ].filter(Boolean),
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename]
    }
  },
}

if (isProduction) { 
  configureWebpack = {
    ...configureWebpack,
    ...chunkConfig,
    // externals: cdn.externals,
  }
}

module.exports = defineConfig({
  // outputDir: "build",
  // assetsDir: "static",
  // productionSourceMap: false,
  lintOnSave: true,
  transpileDependencies: true,
  // devServer: {
  //   port: process.env.VUE_APP_PORT || 8080,
  //   open: JSON.parse(process.env.VUE_APP_OPEN || 'true'),
  //   setupMiddlewares: require('./mock')
  // },
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "@/assets/styles/variables.scss";`
      }
    }
  },
  configureWebpack,
  chainWebpack: config => { 
    config.delete('devtool')
    config.devServer.set('setupMiddlewares', require('./mock'))

    if (isProduction) { 
      config.optimization.minimizer('terser').tap(args => { 
        Object.assign(args[0].terserOptions.compress, {
          drop_console: true, // 删除console.log
          drop_debugger: true, // 删除debugger
          pure_funcs: ['console.log','console.error','console.info'] // 删除console相关打印语句
        })
        return args;
      })

      config.plugin('html').tap(args => { 
        args[0].title = process.env.VUE_APP_TITLE
        // args[0].cdn = cdn // 注入cdn,这种写法个人并不推荐，ejs注入写法在public/ejs.html
        return args;
      })
    }
  }
})

