/**
 * 在qiankun环境下动态修正webpack的publicPath，确保子应用的异步资源(动态加载的图片，js,import(),代码风格的chunk)能够正确加载
 * 让子应用在qiankun环境中知道自己资源的真正加载路劲，避免出现404
 * 
 * 
 * 子应用独立运行的时候，http://localhost:5174,webpack的publicPath是固定的"/"，所以自己的异步chunk会从http://localhost:5174/xxx.js加载
 * 但是接入到qiankun之后，主应用可能在http://主应用域名,而子应用的HTML Entry配置是//子应用域名/child-app
 * 这个时候子应用的主JS文件实际请求的地址是http://子应用域名/child-app/js/app.js
 * 
 * 如果publicPath还是固定的"/"，那么子应用的异步chunk会从http://主应用域名/xxx.js加载，这个时候就会出现404
 * 
 * qiankun会解析子应用入口HTML，提取出主JS的路径http://子应用域名/child-app,然后写入到__INJECTED_PUBLIC_PATH_BY_QIANKUN__
 * 这样__webpack_public_path__，就在运行时有值了，webpack的异步chunk就会从http://子应用域名/child-app/xxx.js加载
 */
if (window.__POWERED_BY_QIANKUN__) {
  // __webpack_public_path__ webpack内置的变量，在运行时动态的设置publicPath
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}
