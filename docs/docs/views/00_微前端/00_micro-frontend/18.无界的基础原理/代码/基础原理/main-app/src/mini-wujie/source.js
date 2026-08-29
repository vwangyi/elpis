/** 请求子应用 HTML Entry，并返回拆分后的 DOM、样式和脚本。 */
export async function loadEntry(appUrl) {
  const response = await fetch(appUrl);
  if (!response.ok) {
    throw new Error(`HTML Entry 请求失败：${appUrl}`);
  }

  return parseEntryHtml(await response.text(), appUrl);
}

/** 将 HTML Entry 拆成 body、内联样式、外链样式和模块脚本。 */
export function parseEntryHtml(html, appUrl) {
  const parser = new DOMParser();
  const documentNode = parser.parseFromString(html, "text/html");

  const inlineStyles = Array.from(documentNode.querySelectorAll("style"))
    .map((style) => style.textContent || "")
    .filter(Boolean);

  const styleLinks = Array.from(
    documentNode.querySelectorAll('link[rel="stylesheet"][href]'),
  ).map((link) => resolveAssetUrl(link.getAttribute("href"), appUrl));

  const moduleScripts = Array.from(
    documentNode.querySelectorAll('script[type="module"]'),
  )
    .map((script) => {
      const src = script.getAttribute("src");
      return src
        ? { src: resolveAssetUrl(src, appUrl), code: "" }
        : { src: "", code: script.textContent || "" };
    })
    .filter((script) => script.src || script.code.trim());

  // 这些资源会被分别放入 Shadow DOM 或 iframe，不能留在 body 中重复执行。
  for (const node of documentNode.querySelectorAll("script, style, link")) {
    node.remove();
  }

  return {
    bodyHtml: documentNode.body.innerHTML.trim(),
    inlineStyles,
    styleLinks,
    moduleScripts,
  };
}

/** 将 HTML Entry 中的外链样式和内联样式加入 Shadow DOM。 */
export function appendEntryStyles(head, entry) {
  for (const href of entry.styleLinks) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    head.appendChild(link);
  }

  for (const code of entry.inlineStyles) {
    const style = document.createElement("style");
    style.textContent = code;
    head.appendChild(style);
  }
}

/** 将相对资源地址转换为基于子应用入口的绝对地址。 */
export function resolveAssetUrl(assetUrl, appUrl) {
  if (!assetUrl || /^(data:|blob:|javascript:|#)/i.test(assetUrl)) {
    return assetUrl;
  }

  const entryUrl = new URL(appUrl, window.location.href);

  // 以 / 开头的资源属于子应用域名，不能错误地使用主应用域名。
  return assetUrl.startsWith("/")
    ? `${entryUrl.origin}${assetUrl}`
    : new URL(assetUrl, entryUrl.href).href;
}
