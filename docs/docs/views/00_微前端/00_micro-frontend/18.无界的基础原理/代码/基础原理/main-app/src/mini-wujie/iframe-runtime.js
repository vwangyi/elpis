/** 创建子应用 iframe，安装运行时代理，并在 iframe window 中执行入口脚本。 */
export async function createIframeRuntime({ app, moduleScripts }) {
  const iframe = document.createElement("iframe");
  iframe.name = `mini-wujie-${app.name}`;
  iframe.dataset.miniWujieSandbox = app.name;
  iframe.setAttribute("aria-hidden", "true");
  iframe.tabIndex = -1;
  iframe.src = "/sandbox.html";

  // iframe 只提供独立的 window，不承载可见页面。
  iframe.style.display = "none";
  app.host.appendChild(iframe);

  await waitForIframe(iframe);

  const frameWindow = iframe.contentWindow;
  const frameDocument = iframe.contentDocument;
  if (!frameWindow || !frameDocument) {
    throw new Error("iframe 运行环境创建失败");
  }

  // 在子应用 Router 创建之前，先把 iframe 的地址校准成子应用应该看到的地址
  // iframe 最初加载的是 iframe.src = "/sandbox.html"
  // 所以 iframe 加载完成后，它自己的地址默认是 http://localhost:5173/sandbox.html
  // 但子应用真正需要看到的地址可能是 http://localhost:5173/micro/order/list

  // getInitialPath 会根据当前主应用的地址栏，判断 iframe 需要显示的子应用路由
  // 如果当前地址栏属于该子应用，则使用当前地址栏，否则使用配置的默认页面
  frameWindow.history.replaceState({}, "", getInitialPath(app));

  injectRuntimeValues(frameWindow, app);

  // 两个 patch 都返回清理函数，销毁时用于恢复 iframe 原始方法。

  // 代理 iframe history，将子应用路由同步到主应用地址栏
  const restoreHistory = patchIframeHistory(frameWindow, app);

  // 代理 iframe document，让子应用操作 Shadow DOM 中的真实页面
  const restoreDocument = patchIframeDocument(frameDocument, app.shadowRoot);

  for (const script of moduleScripts) {
    await runModuleScript(frameDocument, script, app.name);
  }

  return {
    destroy() {
      restoreHistory();
      restoreDocument();
      iframe.remove();
    },
  };
}

/** 当前地址属于该子应用时用于刷新恢复，否则使用配置的默认页面。 
 * 比如刷新 `/micro/order/exceptions` 时，
 * iframe 仍然从异常处理页(/micro/order/exceptions)启动，而不是重新回到订单列表
*/
function getInitialPath(app) {
  const { pathname, search, hash } = window.location;
  const isCurrentApp =
    pathname === app.baseurl || pathname.startsWith(`${app.baseurl}/`);

  return isCurrentApp ? `${pathname}${search}${hash}` : app.defaultPath;
}

/** 代理 iframe history，将子应用路由同步到主应用地址栏。 */
// 主应用 window.location window.history
// iframe子应用  frameWindow.location frameWindow.history

/*
1. 修改iframe地址：
iframe：
micro/order/list ---> micro/order/exceptions

2. syncUrl 读取iframe地址
childUrl = micro/order/exceptions

3. 对比主应用地址栏
mainUrl = micro/order/list

4. 如果不一致，修改主应用地址栏
window.history.replaceState({}, "", childUrl);
主应用： micro/order/list ---> micro/order/exceptions

5.主动派发主应用popstate事件，通知主应用路由更新

6. 主应用 vue router 更新内部路由
*/


function patchIframeHistory(frameWindow, app) {
  const frameHistory = frameWindow.history;

  // 保存并绑定原方法，代理内部仍要先完成 iframe 自身的路由切换。
  const rawPushState = frameHistory.pushState.bind(frameHistory);
  const rawReplaceState = frameHistory.replaceState.bind(frameHistory);

  /** 将 iframe 当前地址写入主应用，并通知主应用 Router 更新状态。 
   *  读取 iframe 当前地址
   *     ↓
   *  写入主应用地址栏
   *     ↓
   *  通知主应用 Router 更新页面状态
   * 
  */
  function syncUrl() {
    // 旧 iframe 销毁期间不能覆盖已经切换完成的新应用地址。
    // const isCurrentApp =
    //   window.location.pathname === app.baseurl ||
    //   window.location.pathname.startsWith(`${app.baseurl}/`);
    // if (!isCurrentApp) return;

    // 读取 iframe 当前地址
    const { pathname, search, hash } = frameWindow.location;
    // 重新组合成完整的子应用地址
    const childUrl = `${pathname}${search}${hash}`;
    // 读取主应用当前地址
    const mainUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;

    // 如果已经一致就结束,避免重复修改地址,减少不必要的路由更新；防止同步逻辑来回触发;
    if (childUrl === mainUrl) return;

    // 修改主应用地址栏
    window.history.replaceState(
      window.history.state, // 保留主应用原有的 history state
      "", // 历史遗留参数，通常传空字符串
      childUrl, // 新地址
    );

    // 通知主应用 Router 更新内部保存的当前路由。
    // 浏览器地址栏已经改变，但 replaceState 不会自动触发 popstate。
    window.dispatchEvent(
      new PopStateEvent("popstate", { state: window.history.state }),
    );
  }

  // history.pushState() 和 history.replaceState();
  // 本身不会触发 popstate，所以需要在代理中手动同步地址栏。
  frameHistory.pushState = (...args) => {
    // 先修改 iframe 地址，再读取新地址同步到主应用。
    const result = rawPushState(...args);
    syncUrl();
    return result;
  };

  frameHistory.replaceState = (...args) => {
    const result = rawReplaceState(...args);
    syncUrl();
    return result;
  };

  // back、forward 和 go 会触发 popstate，iframe window 监听 popstate 后同步到主应用。
  // 这句监听代码是为了补齐“前进、后退”这类路由变化
  frameWindow.addEventListener("popstate", syncUrl);

  // 返回清理函数，而不是立即恢复；子应用销毁时才会调用它。
  return () => {
    frameHistory.pushState = rawPushState;
    frameHistory.replaceState = rawReplaceState;
    frameWindow.removeEventListener("popstate", syncUrl);
  };
}

/** 向 iframe window 注入子应用启动所需的名称、路由和挂载容器。 */
function injectRuntimeValues(frameWindow, app) {
  // 子应用在主应用中的路由前缀
  frameWindow.__MICRO_APP_BASE_URL__ = app.baseurl;

  // 保存是主应用中的shadowRoot, 子应用入口通过它找到真正的挂载节点
  // 子应用 JS 在 iframe 中运行，但页面 DOM 不在 iframe 中，而在主应用的 Shadow Root 中
  frameWindow.__MICRO_APP_CONTAINER__ = app.shadowRoot;

  // 当前运行的子应用，预留变量，没有使用
  frameWindow.__MICRO_APP_NAME__ = app.name;

  // 运行时上下文,把多个零散信息集中到一个命名空间下面，预留变量没有使用
  frameWindow.__MINI_WUJIE__ = {
    name: app.name, // 子应用名称
    host: app.host, // 子应用宿主节点,也就是当前的 <mini-wujie> Web Component 元素
    shadowRoot: app.shadowRoot, // 指 <mini-wujie> 的 Shadow Root
  };
}

/** 代理 iframe document，让子应用操作 Shadow DOM 中的真实页面。 */
function patchIframeDocument(frameDocument, shadowRoot) {
  const mainDocument = shadowRoot.ownerDocument;
  const shadowHead = shadowRoot.querySelector("mini-wujie-head");
  const shadowBody = shadowRoot.querySelector("mini-wujie-body");
  const frameHead = frameDocument.head;
  const frameBody = frameDocument.body;

  // 保存原始方法：代理需要回退查询，销毁时也需要恢复现场。
  const rawQuerySelector = frameDocument.querySelector.bind(frameDocument);
  const rawQuerySelectorAll = frameDocument.querySelectorAll.bind(frameDocument);
  const rawGetElementById = frameDocument.getElementById.bind(frameDocument);
  const rawCreateElement = frameDocument.createElement.bind(frameDocument);
  const rawCreateElementNS = frameDocument.createElementNS.bind(frameDocument);
  const rawCreateTextNode = frameDocument.createTextNode.bind(frameDocument);
  const rawCreateComment = frameDocument.createComment.bind(frameDocument);
  const rawHeadAppendChild = frameHead.appendChild.bind(frameHead);
  const rawBodyAppendChild = frameBody.appendChild.bind(frameBody);
  const rawBodyInsertBefore = frameBody.insertBefore.bind(frameBody);

  // 子应用节点优先从自己的 Shadow DOM 查询，找不到再查询 iframe。
  frameDocument.querySelector = (selector) =>
    shadowRoot.querySelector(selector) || rawQuerySelector(selector);

  frameDocument.querySelectorAll = (selector) => {
    const scopedResult = shadowRoot.querySelectorAll(selector);
    return scopedResult.length ? scopedResult : rawQuerySelectorAll(selector);
  };

  frameDocument.getElementById = (id) =>
    shadowRoot.querySelector(`#${escapeCss(id)}`) || rawGetElementById(id);

  // 普通 DOM 直接由主 document 创建，放入 Shadow DOM 后事件可以正常工作。
  // script 必须保留在 iframe document 中创建，才能在 iframe window 中执行。
  frameDocument.createElement = (tagName, options) =>
    tagName.toLowerCase() === "script"
      ? rawCreateElement(tagName, options)
      : mainDocument.createElement(tagName, options);
  frameDocument.createElementNS = (...args) =>
    mainDocument.createElementNS(...args);
  frameDocument.createTextNode = (...args) =>
    mainDocument.createTextNode(...args);
  frameDocument.createComment = (...args) =>
    mainDocument.createComment(...args);

  // Vite 动态插入的样式必须进入 Shadow DOM，才能作用于子应用页面。
  frameHead.appendChild = (node) => {
    if (node.tagName === "STYLE") {
      return shadowHead.appendChild(node);
    }

    if (node.tagName === "LINK" && node.rel === "stylesheet") {
      return shadowHead.appendChild(node);
    }

    // script 等非样式节点仍放入 iframe head。
    return rawHeadAppendChild(node);
  };

  // 弹窗等插入 document.body 的节点转到子应用自己的显示区域。
  frameBody.appendChild = (node) => shadowBody.appendChild(node);
  frameBody.insertBefore = (node, referenceNode) =>
    shadowBody.insertBefore(node, referenceNode);

  // 子应用销毁后恢复全部原始方法，避免代理继续持有 Shadow DOM。
  return () => {
    frameDocument.querySelector = rawQuerySelector;
    frameDocument.querySelectorAll = rawQuerySelectorAll;
    frameDocument.getElementById = rawGetElementById;
    frameDocument.createElement = rawCreateElement;
    frameDocument.createElementNS = rawCreateElementNS;
    frameDocument.createTextNode = rawCreateTextNode;
    frameDocument.createComment = rawCreateComment;
    frameHead.appendChild = rawHeadAppendChild;
    frameBody.appendChild = rawBodyAppendChild;
    frameBody.insertBefore = rawBodyInsertBefore;
  };
}

/** 创建 module script，并等待子应用入口执行完成。 */
function runModuleScript(frameDocument, script, appName) {
  return new Promise((resolve, reject) => {
    const element = frameDocument.createElement("script");
    element.type = "module";

    if (script.src) {
      const url = new URL(script.src);

      // 避免切换回来时复用上一次模块实例，确保子应用重新执行入口。
      url.searchParams.set("__mini_wujie_entry__", `${appName}-${Date.now()}`);
      element.src = url.href;
    } else {
      element.textContent = script.code;
    }

    element.addEventListener("load", resolve, { once: true });
    element.addEventListener(
      "error",
      () => reject(new Error(`module 脚本执行失败：${script.src || appName}`)),
      { once: true },
    );

    frameDocument.head.appendChild(element);

    // 内联模块没有稳定的 load 事件，放入任务队列后视为完成。
    if (!script.src) queueMicrotask(resolve);
  });
}

/** 等待同源空白页加载完成，之后才能安全访问 contentWindow。 */
function waitForIframe(iframe) {
  return new Promise((resolve, reject) => {
    iframe.addEventListener("load", resolve, { once: true });
    iframe.addEventListener(
      "error",
      () => reject(new Error("sandbox.html 加载失败")),
      { once: true },
    );
  });
}

/** 转义 id 后再拼接选择器，兼容 id 中的特殊字符。 */
function escapeCss(value) {
  return globalThis.CSS?.escape
    ? globalThis.CSS.escape(value)
    : String(value).replace(/[^a-zA-Z0-9_-]/g, "\\$&");
}
