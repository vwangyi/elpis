import { createScopedWindow } from "./element-scope.js";
import { appendStyles, loadHtml, runScripts } from "./source.js";

/**
 * 子应用实例缓存。
 *
 * key 是子应用 name，value 是对应的 MicroAppInstance。
 * 真实框架会用类似结构记录应用状态，方便复用、卸载和调试。
 */
export const appInstanceMap = new Map();

/**
 * 一个 MicroAppInstance 表示一个正在被 <micro-app> 承载的子应用。
 *
 * 它不要求子应用导出 mount/unmount，
 * 而是由加载器自己完成：拉取 HTML、解析资源、挂载 DOM、执行脚本、卸载清理。
 */
export class MicroAppInstance {
  /**
   * 参数：
   * - name：子应用名称；
   * - url：子应用 HTML Entry 地址；
   * - baseurl：主应用分配给子应用的路由前缀；
   * - container：承载子应用的 <micro-app> DOM 元素。
   */
  constructor({ name, url, baseurl, container }) {
    this.name = name;
    this.url = url;
    this.baseurl = baseurl;
    this.container = container;
    // 每次 load 都会生成一个唯一 ID，为了避免动态 `import()` 有模块缓存问题。
    // 浏览器把每次重新加载都看成一次新的 module 请求，从而重新执行子应用入口
    this.loadId = `${name}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    this.status = "created";
    // 存放css和js资源的解析结果
    this.source = null;
    this.proxyWindow = createScopedWindow(this);
  }

  /**
   * 加载子应用。
   *
   * 作用：先通过 HTML Entry 拉取并解析子应用资源，
   * 成功后进入 mount；失败时记录错误状态并向外派发 error 事件。
   */
  async load() {
    this.status = "loading";

    // 通知外部：这个子应用实例已经创建，开始进入加载流程。
    // 主应用可以在 <micro-app @created="..."> 中接收这个事件。
    this.container.dispatchEvent(createLifeCycleEvent("created", this));

    try {
      await loadHtml(this);
      this.mount();
    } catch (error) {
      this.status = "error";

      // 通知外部：加载或挂载过程中出错了。
      // 错误对象会放到 event.detail.error 里，方便主应用做提示或上报。
      this.container.dispatchEvent(
        createLifeCycleEvent("error", this, { error }),
      );
      throw error;
    }
  }

  /**
   * 挂载子应用。
   *
   * 作用：把解析后的 DOM 放进 <micro-app>，补回样式，然后执行子应用脚本。
   * 注意：这里的 mount 是加载器内部动作，不是子应用暴露给主应用的生命周期函数。
   */
  mount() {
    if (!this.source || this.status === "unmounted") return;

    // 使用 DocumentFragment 批量搬运节点，减少多次直接操作真实 DOM。
    const fragment = document.createDocumentFragment();
    const cloneHtml = this.source.html.cloneNode(true);

    for (const child of Array.from(cloneHtml.childNodes)) {
      fragment.appendChild(child);
    }

    this.container.replaceChildren(fragment);

    // HTML Entry 解析阶段会先拿走 link/style，
    // 挂载 DOM 后再把处理过的样式插回 micro-app-head。
    const microAppHead = this.container.querySelector("micro-app-head");
    if (microAppHead) {
      appendStyles(microAppHead, this.source);
    }

    // 通知外部：HTML、CSS 等资源已经准备好，即将执行子应用脚本。
    this.container.dispatchEvent(createLifeCycleEvent("beforemount", this));

    // 执行子应用脚本
    runScripts(this);

    this.status = "mounted";

    // 通知外部：子应用脚本已经执行，页面已经进入挂载完成状态。
    this.container.dispatchEvent(createLifeCycleEvent("mounted", this));
  }

  /**
   * 卸载子应用。
   *
   * 参数 destroy：是否同时删除实例缓存。
   * 作用：清空 <micro-app> 内部 DOM，并派发 unmount 事件。
   */
  unmount({ destroy = false } = {}) {
    this.status = "unmounted";
    this.container.replaceChildren();

    // 通知外部：当前子应用已经从 <micro-app> 容器里清理掉。
    this.container.dispatchEvent(createLifeCycleEvent("unmount", this));

    if (destroy) {
      appInstanceMap.delete(this.name);
    }
  }
}

/**
 * 创建微应用生命周期事件。
 *
 * 参数：
 * - name：事件名，例如 created、beforemount、mounted、unmount；
 * - app：当前子应用实例；
 * - extraDetail：额外事件信息，例如错误对象。
 *
 * 作用：让主应用可以通过 addEventListener 观察子应用加载过程。
 */
function createLifeCycleEvent(name, app, extraDetail = {}) {
  return new CustomEvent(name, {
    bubbles: false,
    detail: {
      name: app.name,
      url: app.url,
      baseurl: app.baseurl,
      ...extraDetail,
    },
  });
}
