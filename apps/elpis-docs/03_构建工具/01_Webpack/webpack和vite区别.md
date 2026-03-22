


+ 你说你会 webpack vite 你怎么证明？ 教会别人。
+ webpack 官网：[https://webpack.docschina.org/concepts/](https://webpack.docschina.org/concepts/)



+ 前端构建工具 
    - 手动构建阶段
    - 自动化构建阶段
        * grunt gulp
    - 模块化构建阶段
        * webpack rollup.js
    - bundless构建阶段
        * vite


webpack 是什么



vite 是什么



区别是什么

+ vite
+ vite
    - Vite具有以下特点： - 快速的冷启动 - 即时热模块更新（HMR，Hot Module Replacement） - 真正按需编译
    - Vite由两部分组成： - 一个开发服务器，它基于 原生 ES 模块 提供了丰富的内建功能，如速度快到惊人的 [模块热更新HMR。 - 一套构建指令，它使用 Rollup打包你的代码，并且它是预配置的，可以输出用于生产环境的优化过的静态资源。
    - Vite vs Webpack：https://zhuanlan.zhihu.com/p/568721196
    - 尤雨溪回答vite
        * https://www.zhihu.com/question/477139054/answer/2156019180
    - vite
        * 是什么
            + vite是一个基于rollup 和 esbuild的前端构建工具
            + 我认为vite是一个脚手架
            + esbuild
                - 是什么
                    * ESBuild 是一个用 基于Go 写的构建工具
            + rollup
                - 是什么
                    * rollup是一个基于 NodeJs 写的 构建工具
            + rollup 负责开发环境打包esbuild 负责生产环境构建
+ vite是构建工具还是脚手架？
    - 我认为 vite是一个脚手架 但vite官方想让vite成为构建工具
    - vue-cli 脚手架 底层是webpack
    - create-react-app脚手架 底层构建工具是webpack
    - umijs 脚手架底层构建工具是webpack
    - vite 底层构建工具是 rollup和esbuild。  和webpack没关系了

区别是什么

### 问：webpack 和 vite 的区别
<!-- 这是一张图片，ocr 内容为：VITE底层是用ESBUILD(GO语言写的),比WEBPACK的NODEJS,快10-100倍. 底层原理 VITE支持冷启动可以先打开页面按需编译 冷启动 WEBPACK和VITE的区别 WEBPACK需要全部编译完才打开 因为VITE是支持ES模块的不需要转ES5 热更新HMR VITE的HMR的支持更好一些 生态 WEBPACK的生态稳定LOADER PLUIGIN 丰富一些 -->
![](https://cdn.nlark.com/yuque/0/2025/png/34696752/1756978801382-0d7d0049-53e1-45e1-8bc3-f8ec449c435c.png)

