if (window.__POWERED_BY_QIANKUN__) {
  // [路由处理2:] qiankun 挂载时由主应用注入真实资源地址，webpack 异步资源会从用户子应用自己的域名加载。
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}
