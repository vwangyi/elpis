import { createIframeRuntime } from "./iframe-runtime.js";
import { appendEntryStyles, loadEntry } from "./source.js";

/** 组织单个子应用的资源加载、DOM 准备和 iframe 运行环境。 */
export class MiniWujieInstance {
  /** 保存标签参数以及运行过程中需要使用的宿主对象。 */
  constructor({ name, url, baseurl, defaultPath, host, shadowRoot }) {
    this.name = name;
    this.url = url;
    this.baseurl = baseurl;
    this.defaultPath = defaultPath;
    this.host = host;
    this.shadowRoot = shadowRoot;
    this.runtime = null;
    this.destroyed = false;
  }

  /** 加载 HTML Entry，准备页面结构，再启动 iframe 中的子应用脚本。 */
  async start() {
    try {
      const entry = await loadEntry(this.url);

      // 请求完成前标签可能已经被移除，此时不再继续创建运行环境。
      if (this.destroyed) return;

      this.prepareDom(entry);
      this.runtime = await createIframeRuntime({
        app: this,
        moduleScripts: entry.moduleScripts,
      });

      // iframe 创建期间也可能发生卸载，创建完成后需要立即补做清理。
      if (this.destroyed) {
        this.runtime.destroy();
        return;
      }
    } catch (error) {
      if (this.destroyed) return;
      this.renderError(error);
      throw error;
    }
  }

  /** 将 HTML Entry 中的 body 和样式放入子应用的 Shadow DOM。 */
  prepareDom(entry) {
    const head = this.shadowRoot.querySelector("mini-wujie-head");
    const body = this.shadowRoot.querySelector("mini-wujie-body");

    head.replaceChildren();
    body.innerHTML = entry.bodyHtml || '<div id="app"></div>';
    appendEntryStyles(head, entry);
  }

  /** 销毁 iframe 运行环境，并清空当前子应用的 Shadow DOM。 */
  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    this.runtime?.destroy();
    this.runtime = null;
    this.shadowRoot.replaceChildren();
  }

  /** 在 Shadow DOM 中显示加载错误，避免主应用页面整体崩溃。 */
  renderError(error) {
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        .mini-wujie-error {
          display: grid;
          min-height: 360px;
          place-items: center;
          padding: 24px;
          border: 1px dashed #b65b4b;
          border-radius: 8px;
          color: #873b31;
          background: #fff5f2;
        }
      </style>
      <div class="mini-wujie-error">子应用加载失败：${escapeHtml(error.message)}</div>
    `;
  }
}

/** 转义插入模板字符串的内容，避免错误信息被当成 HTML 执行。 */
function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
