import { MiniWujieInstance } from "./app.js";

/**
 * 用 Shadow DOM 承载子应用页面，用 iframe 提供独立运行环境。
 */
class MiniWujieElement extends HTMLElement {
  /** 为每个 mini-wujie 标签创建独立的 DOM 和样式边界。 */
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  /** 标签进入页面时读取配置，并启动对应的子应用实例。 */
  connectedCallback() {
    // 防止同一个标签重复连接时创建多个子应用实例。
    if (this.app) return;

    const name = this.getAttribute("name");
    const url = this.getAttribute("url");
    const baseurl = this.getAttribute("baseurl") || "/";
    const defaultPath = this.getAttribute("default-path") || baseurl;

    if (!name || !url) {
      this.renderConfigurationError();
      return;
    }

    this.renderShell(name);

    this.app = new MiniWujieInstance({
      name,
      url,
      baseurl,
      defaultPath,
      host: this,
      shadowRoot: this.shadowRoot,
    });

    this.app.start().catch((error) => {
      console.error(`[mini-wujie:${name}]`, error);
    });
  }

  /** 标签离开页面时销毁子应用，释放 iframe 和相关代理。 */
  disconnectedCallback() {
    this.app?.destroy();
    this.app = null;
  }

  /** 创建存放子应用样式、DOM 和加载状态的 Shadow DOM 结构。 */
  renderShell(name) {
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; min-height: 620px; }
        mini-wujie-head { display: none; }
        mini-wujie-body { display: block; min-height: 620px; }
        .mini-wujie-loading {
          display: grid;
          min-height: 360px;
          place-items: center;
          border: 1px dashed #aeb8aa;
          border-radius: 8px;
          color: #627064;
          background: rgba(255, 255, 255, 0.72);
        }
      </style>
      <mini-wujie-head></mini-wujie-head>
      <mini-wujie-body>
        <div class="mini-wujie-loading">正在为 ${escapeHtml(name)} 创建 iframe 运行环境...</div>
      </mini-wujie-body>
    `;
  }

  /** 缺少必要标签属性时显示配置错误。 */
  renderConfigurationError() {
    this.shadowRoot.innerHTML = `
      <style>:host { display:block; padding:24px; color:#873b31; }</style>
      <p>缺少 name 或 url，无法创建最小无界实例。</p>
    `;
  }
}

/** 注册 mini-wujie 自定义标签，重复调用时不会重复注册。 */
export function defineElement() {
  if (!window.customElements.get("mini-wujie")) {
    window.customElements.define("mini-wujie", MiniWujieElement);
  }
}

/** 转义插入模板字符串的内容，避免应用名称被解析成 HTML。 */
function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
