/**
 * controllers 其实就是 路由对应的处理方法 从路由里面剥离出来而已
 */
const glob = require("glob");
const path = require("path");
const { sep } = path;

module.exports = app => {
  const controllerPath = path.resolve(process.cwd(), `.${sep}app${sep}controllers`);
  let fileList = glob.sync(path.resolve(controllerPath, `.${sep}**${sep}**.js`));
  fileList = fileList.filter(item => !item.endsWith("index.js"));

  /**
   * controllers 对象
   * key 是 文件名
   * value 是 导出的类实例化的对象
   */
  const controllers = fileList.reduce((prev, filePath) => {
    const key = filePath.split(sep).slice(-1)[0].split(".")[0];
    const controller = require(path.resolve(filePath));
    const ControllerModel = typeof controller === "function" ? controller(app) : null;
    if (typeof ControllerModel === "function") {
      prev[key] = new ControllerModel();
    }
    return prev;
  }, {});
  app.controllers = controllers;
  console.info(`-- [init] load controllers done --`);
};
