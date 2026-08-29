import { defineElement } from "./element.js";

/**
 * 手写 MicroApp 的公开入口。
 *
 * 主应用只需要在启动时调用 SimpleMicroApp.start()，
 * 它会把 <micro-app> 注册成浏览器认识的自定义元素。
 */
export const SimpleMicroApp = {
  /**
   * 启动手写微前端运行时。
   *
   * 作用：注册 <micro-app> 标签，让主应用模板里可以直接使用它加载子应用。
   */
  start() {
    defineElement();
  },
};
