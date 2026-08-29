import { defineElement } from "./element.js";

export const MiniWujie = {
  /** 启动最小运行时，让浏览器能够识别 mini-wujie 标签。 */
  start() {
    defineElement();
  },
};
