/**
 * Node中叫middleware中间件 Java中叫拦截器
 * 把当前目录下所有中间件都use调用
 */
const glob = require("glob");
const path = require("path");
const { sep } = path;

module.exports = app => {
  const middlewaresPath = path.resolve(process.cwd(), `.${sep}app${sep}middlewares`);
  let fileList = glob.sync(path.resolve(middlewaresPath, `.${sep}**${sep}**.js`));
  fileList = fileList.filter(item => !item.endsWith("index.js"));

  /**
   * middlewares 对象
   * key 是 文件名
   * value 是 导出的函数调用后 返回值 也是一个函数
   */
  const middlewares = fileList.reduce((prev, filePath) => {
    const key = filePath.split(sep).slice(-1)[0].split(".")[0];
    const middleware = require(path.resolve(filePath));
    if (typeof middleware === "function") {
      prev[key] = middleware(app);
    }
    if (typeof prev[key] !== "function") {
      delete prev[key];
    }
    return prev;
  }, {});

  // 这里可能的问题 是 不能保证 每个中间件的执行顺序
  // 如果有后续执行顺序问题 这里就不use 只挂载 然后在入口文件use： app.use(app.middlewares.xxx)
  Object.keys(middlewares).forEach(key => app.use(middlewares[key]));
  app.middlewares = middlewares;
  console.info(`-- [init] load middlewares done --`);
};
