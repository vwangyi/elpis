import { appInstanceMap, MicroAppInstance } from "./app.js";

/**
 * <micro-app> 自定义元素。
 *
 * 它是主应用和子应用之间的“承载标签”：
 * - name 表示子应用名称，用来区分不同实例；
 * - url 表示子应用 HTML Entry 地址；
 * - baseurl 表示主应用分配给子应用的路由前缀。
 */
class MicroAppElement extends HTMLElement {
  /**
   * 声明需要监听的属性。
   *
   * 当这些属性发生变化时，浏览器会自动调用 attributeChangedCallback，
   * 我们就可以重新加载对应的子应用。
   */
  static get observedAttributes() {
    return ["name", "url", "baseurl"];
  }

  /**
   * 标签被插入页面时触发。
   *
   * 作用：读取标签属性，创建 MicroAppInstance，并开始加载子应用。
   * 这就是类 MicroApp 方案的控制点：主应用不直接调用子应用 mount，
   * 而是让 <micro-app> 标签自己接管加载流程。
   */
  connectedCallback() {
    if (this.app) return;

    const name = this.getAttribute("name");
    const url = this.getAttribute("url");
    const baseurl = this.getAttribute("baseurl") || "/";

    if (!name || !url) {
      this.renderError("缺少 name 或 url，无法加载子应用。", null);
      return;
    }

    this.renderLoading(name);

    // 每一个 <micro-app> 标签，对应一个内部应用实例。
    // container 传入当前标签本身，后续 HTML、样式和脚本都会挂到这里面。
    const app = new MicroAppInstance({ name, url, baseurl, container: this });
    this.app = app;
    // 缓存子应用实例
    appInstanceMap.set(name, app);

    app.load().catch((error) => {
      this.renderError(`子应用 ${name} 加载失败。`, error);
    });
  }

  /**
   * 标签从页面移除时触发。
   *
   * 作用：清理当前子应用渲染出来的 DOM。
   * 如果标签上带了 destroy 属性，还会从实例缓存中删除它。
   */
  disconnectedCallback() {
    this.app?.unmount({ destroy: this.hasAttribute("destroy") });
    this.app = null;
  }

  /**
   * 被监听的属性变化时触发。
   *
   * 参数：
   * - attrName：变化的属性名；
   * - oldValue：变化前的值；
   * - newValue：变化后的值。
   *
   * 作用：当 name、url 或 baseurl 改变时，卸载旧子应用，再按新属性重新加载。
   */
  attributeChangedCallback(attrName, oldValue, newValue) {
    if (!this.isConnected || oldValue === newValue) return;

    if (attrName === "name" || attrName === "url" || attrName === "baseurl") {
      this.app?.unmount({ destroy: true });
      this.app = null;
      this.connectedCallback();
    }
  }

  /**
   * 渲染加载状态。
   *
   * 参数 name：当前正在加载的子应用名称。
   */
  renderLoading(name) {
    this.innerHTML = `<micro-app-loading>正在连接 ${name} 子应用...</micro-app-loading>`;
  }

  /**
   * 渲染错误状态。
   *
   * 参数：
   * - message：展示给页面看的错误文案；
   * - error：原始错误对象，方便开发时在控制台排查。
   */
  renderError(message, error) {
    console.error(message, error);
    this.innerHTML = `<micro-app-error>${message}</micro-app-error>`;
  }
}

/**
 * 注册 <micro-app> 标签。
 *
 * customElements.define 同一个标签名只能调用一次，
 * 所以这里先判断是否已经注册，避免热更新或重复 start 时报错。
 */
export function defineElement() {
  if (!window.customElements.get("micro-app")) {
    window.customElements.define("micro-app", MicroAppElement);
  }
}
