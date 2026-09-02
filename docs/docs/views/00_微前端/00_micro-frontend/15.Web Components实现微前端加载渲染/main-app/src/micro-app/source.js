/**
 * 拉取远程资源文本。
 *
 * 参数 url：要请求的 HTML、CSS 或 JS 地址。
 * 返回值：资源内容字符串。
 */
export function fetchSource(url) {
  return fetch(url).then((response) => {
    if (!response.ok) {
      throw new Error(`资源加载失败：${url}`);
    }
    return response.text();
  });
}

/**
 * 把子应用中的相对资源地址补成绝对地址。
 *
 * 参数：
 * - assetUrl：HTML 里写的资源地址，例如 ./app.js 或 /app.css；
 * - appUrl：子应用入口 HTML 地址。
 *
 * 意义：子应用 HTML 被主应用加载后，不能再按主应用地址解析资源，
 * 必须按子应用自己的入口地址解析。
 */
export function resolveAssetUrl(assetUrl, appUrl) {
  if (!assetUrl || /^(data:|blob:|javascript:|#)/i.test(assetUrl)) {
    return assetUrl;
  }

  const pageUrl = globalThis.location?.href || "http://localhost/";
  const entryUrl = new URL(appUrl, pageUrl);

  // 以 / 开头的资源，应该回到子应用所在域名下查找。
  if (assetUrl.startsWith("/")) {
    return `${entryUrl.origin}${assetUrl}`;
  }

  return new URL(assetUrl, entryUrl.href).href;
}

/**
 * 把普通 HTML 的 head/body 改成可嵌入主应用的标签。
 *
 * 参数 html：子应用 index.html 的原始字符串。
 * 意义：一个页面只能有一个真正的 head/body，
 * 所以子应用的 head/body 需要转成 micro-app-head/micro-app-body。
 */
export function formatMicroAppHtml(html) {
  return html
    .replace(/<head([^>]*)>/i, "<micro-app-head$1>")
    .replace(/<\/head>/i, "</micro-app-head>")
    .replace(/<body([^>]*)>/i, "<micro-app-body$1>")
    .replace(/<\/body>/i, "</micro-app-body>");
}

/**
 * 从格式化后的 HTML DOM 中提取外部资源。
 *
 * 参数：
 * - root：临时 DOM 容器；
 * - appName：子应用名称，用于生成样式隔离前缀；
 * - appUrl：子应用入口地址，用于解析相对资源路径。
 *
 * 返回值：links、styles、scripts 三类资源清单。
 * 作用：先把 link/style/script 从 DOM 中拿走，后面再按微前端规则处理和执行。
 */
export function extractSourceDom(root, { appName, appUrl }) {
  const links = [];
  const styles = [];
  const scripts = [];
  const resourceNodes = Array.from(
    root.querySelectorAll("link, style, script"),
  );

  for (const node of resourceNodes) {
    if (node instanceof HTMLLinkElement) {
      const rel = node.getAttribute("rel");
      const href = node.getAttribute("href");

      // link stylesheet 需要先记录地址，后续 fetch 回 CSS 文本再做样式前缀处理。
      if (rel === "stylesheet" && href) {
        links.push({ url: resolveAssetUrl(href, appUrl) });
      }

      node.remove();
      continue;
    }

    if (node instanceof HTMLStyleElement) {
      // 内联 style 可以立刻做选择器作用域改写。
      styles.push({ code: scopeCssText(node.textContent || "", appName) });
      node.remove();
      continue;
    }

    if (node instanceof HTMLScriptElement) {
      const src = node.getAttribute("src");
      const type = node.getAttribute("type") || "classic";

      // script 只先收集，不在解析 HTML 时执行，避免执行时机失控。
      scripts.push(
        src
          ? { url: resolveAssetUrl(src, appUrl), type }
          : { code: node.textContent || "", type },
      );
      node.remove();
    }
  }

  return { links, styles, scripts };
}

/**
 * 加载并解析子应用 HTML Entry。
 *
 * 参数 app：当前 MicroAppInstance。
 * 作用：完成“请求 HTML -> 转换 head/body -> 提取资源 -> 预加载 CSS/JS”的链路，
 * 最终把解析结果放到 app.source 上，等待 mount 使用。
 */
export async function loadHtml(app) {
  // 拉取子应用html文本
  const html = await fetchSource(app.url);
  // 格式化html文本
  const formattedHtml = formatMicroAppHtml(html);
  const htmlDom = document.createElement("div");
  htmlDom.innerHTML = formattedHtml;

  const source = extractSourceDom(htmlDom, {
    appName: app.name,
    appUrl: app.url,
  });

  console.log("loadHtml source", source);

  await Promise.all([loadLinkStyles(source, app), loadScripts(source, app)]);

  app.source = {
    html: htmlDom,
    styles: source.styles,
    links: source.links,
    scripts: source.scripts,
  };

  console.log("loadHtml app.source", app.source);
}

/**
 * 加载外部 CSS 文件。
 *
 * 参数：
 * - source：extractSourceDom 得到的资源清单；
 * - app：当前子应用实例。
 *
 * 作用：把 link stylesheet 的内容取回来，并加上当前子应用的选择器前缀。
 */
async function loadLinkStyles(source, app) {
  await Promise.all(
    source.links.map(async (link) => {
      const code = await fetchSource(link.url);
      link.code = scopeCssText(code, app.name);
    }),
  );
}

/**
 * 预加载传统 script 脚本。
 *
 * 参数 source：extractSourceDom 得到的资源清单。
 * 作用：classic script 需要取回代码文本，后续放到代理 window 环境里执行。
 * module script 保留原地址，让浏览器按原生 module 规则加载。
 */
async function loadScripts(source) {
  await Promise.all(
    source.scripts.map(async (script) => {
      if (!script.code && script.url && script.type !== "module") {
        script.code = await fetchSource(script.url);
      }
    }),
  );
}

/**
 * 把处理后的样式插回子应用 DOM。
 *
 * 参数：
 * - microAppHead：子应用模拟出来的 head 容器；
 * - source：已经解析好的资源对象。
 */
export function appendStyles(microAppHead, source) {
  for (const style of [...source.styles, ...source.links]) {
    if (!style.code) continue;

    const styleElement = document.createElement("style");
    styleElement.textContent = style.code;
    microAppHead.appendChild(styleElement);
  }
}

/**
 * 执行子应用脚本。
 *
 * 参数 app：当前子应用实例。
 * 作用：按脚本类型分别处理 classic script 和 module script。
 */
export function runScripts(app) {
  for (const script of app.source.scripts) {
    if (script.type === "module") {
      runModuleScript(script, app);
    } else {
      runClassicScript(script, app);
    }
  }
}

/**
 * 执行传统 script。
 *
 * 参数：
 * - script：脚本资源对象，可能来自 src，也可能来自内联 script；
 * - app：当前子应用实例。
 *
 * 作用：把脚本放进代理 window 中运行，让 document/window 访问尽量落到当前 micro-app 内。
 */
function runClassicScript(script, app) {
  const code = `${script.code || ""}\n//# sourceURL=${script.url || `${app.name}-inline.js`}`;

  // 这里故意不要求子应用暴露 mount/unmount。普通 script 会像在页面里一样直接执行。
  new Function("window", "self", "globalThis", `with(window){;${code}\n}`)(
    app.proxyWindow,
    app.proxyWindow,
    app.proxyWindow,
  );
}

/**
 * 执行 module script。
 *
 * 参数：
 * - script：模块脚本资源对象；
 * - app：当前子应用实例。
 *
 * 说明：Vite 框架子应用通常使用 type="module" 入口。
 * module 代码不能被 with(window) 包起来执行，所以这里用一段包装模块先注入运行时信息，
 * 再通过 import() 加载子应用真正的入口文件。
 */
function runModuleScript(script, app) {
  window.__MICRO_APP_BASE_URL__ = app.baseurl;
  window.__MICRO_APP_NAME__ = app.name;
  window.__MICRO_APP_CONTAINER__ = app.container;

  const scriptElement = document.createElement("script");
  scriptElement.type = "module";

  const setupCode = `
window.__MICRO_APP_BASE_URL__ = ${JSON.stringify(app.baseurl)};
window.__MICRO_APP_NAME__ = ${JSON.stringify(app.name)};
`;

  scriptElement.textContent = script.url
    ? `${setupCode}
import(${JSON.stringify(createModuleImportUrl(script.url, app))});`
    : `${setupCode}
${script.code || ""}`;

  app.container.appendChild(scriptElement);
}

function createModuleImportUrl(scriptUrl, app) {
  const pageUrl = globalThis.location?.href || "http://localhost/";
  const moduleUrl = new URL(scriptUrl, pageUrl);

  moduleUrl.searchParams.set("__micro_app_entry__", app.loadId || app.name);

  return moduleUrl.href;
}

/**
 * 给一段 CSS 加上当前子应用的作用域前缀。
 *
 * 参数：
 * - cssText：原始 CSS 文本；
 * - appName：子应用名称。
 *
 * 返回值：改写后的 CSS 文本，例如 .card -> micro-app[name="order"] .card。
 */
export function scopeCssText(cssText, appName) {
  return scopeCssBlock(cssText, `micro-app[name="${appName}"]`).trim();
}

/**
 * 递归处理 CSS 规则块。
 *
 * 参数：
 * - cssText：当前要处理的 CSS 片段；
 * - prefix：要添加的选择器前缀。
 *
 * 作用：普通选择器加前缀；@media/@supports 递归处理内部规则；
 * @font-face/@keyframes 等其他 @ 规则保持原样。
 */
function scopeCssBlock(cssText, prefix) {
  let index = 0;
  let result = "";

  while (index < cssText.length) {
    const nextOpen = cssText.indexOf("{", index);
    if (nextOpen === -1) {
      result += cssText.slice(index);
      break;
    }

    const selector = cssText.slice(index, nextOpen).trim();
    const closeIndex = findMatchingBrace(cssText, nextOpen);
    const body = cssText.slice(nextOpen + 1, closeIndex).trim();

    if (selector.startsWith("@media") || selector.startsWith("@supports")) {
      result += `${selector} { ${scopeCssBlock(body, prefix)} }`;
    } else if (selector.startsWith("@")) {
      result += `${selector} { ${body} }`;
    } else {
      result += `${prefixSelectors(selector, prefix)} { ${body} }`;
    }

    index = closeIndex + 1;

    if (/\S/.test(cssText.slice(index))) {
      result += "\n";
    }
  }

  return result;
}

/**
 * 找到与某个左花括号匹配的右花括号。
 *
 * 参数：
 * - cssText：完整 CSS 文本；
 * - openIndex：左花括号的位置。
 *
 * 意义：CSS 里可能有嵌套规则，不能只找第一个 }。
 */
function findMatchingBrace(cssText, openIndex) {
  let depth = 0;

  for (let index = openIndex; index < cssText.length; index += 1) {
    if (cssText[index] === "{") depth += 1;
    if (cssText[index] === "}") depth -= 1;
    if (depth === 0) return index;
  }

  return cssText.length - 1;
}

/**
 * 给选择器列表加作用域前缀。
 *
 * 参数：
 * - selectorText：原始选择器文本，可能包含逗号分隔的多个选择器；
 * - prefix：micro-app[name="xxx"] 形式的前缀。
 *
 * 特殊处理：
 * - html/body/:root 改成作用到 micro-app 容器本身；
 * - * 改成 micro-app[name="xxx"] *，避免影响整个主应用。
 */
function prefixSelectors(selectorText, prefix) {
  return selectorText
    .split(",")
    .map((selector) => {
      const normalized = selector.trim();

      if (/^(html|body|:root)$/.test(normalized)) {
        return prefix;
      }

      if (normalized === "*") {
        return `${prefix} *`;
      }

      return `${prefix} ${normalized}`;
    })
    .join(", ");
}
