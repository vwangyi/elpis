webpack.config.js 是抽取 webpack.dev.js 和 webpack.prod.js 的公共部分

webpack.dev.js 是webpack配置 且使用webpack-dev-server这个第三方插件 启动服务器 通过 npm run xxx启动

webpack.prod.js 是webpack配置 生产环境配置 通过 npm run xxx启动

server.dev.js 是 没使用webpack-dev-server这个第三方插件 而是用 express启动的服务器 通过 npm run server:dev 启动
