import test from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import {
  extractSourceDom,
  formatMicroAppHtml,
  resolveAssetUrl,
  runScripts,
  scopeCssText,
} from "./source.js";

const { window } = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://localhost:5173/",
});

globalThis.window = window;
globalThis.document = window.document;
globalThis.HTMLLinkElement = window.HTMLLinkElement;
globalThis.HTMLScriptElement = window.HTMLScriptElement;
globalThis.HTMLStyleElement = window.HTMLStyleElement;

test("resolveAssetUrl keeps absolute URLs and resolves root-relative assets from app origin", () => {
  assert.equal(
    resolveAssetUrl(
      "http://localhost:5174/assets/app.js",
      "http://localhost:5174/",
    ),
    "http://localhost:5174/assets/app.js",
  );
  assert.equal(
    resolveAssetUrl("/assets/app.js", "http://localhost:5174/order/list"),
    "http://localhost:5174/assets/app.js",
  );
});

test("resolveAssetUrl resolves relative assets from the child app entry path", () => {
  assert.equal(
    resolveAssetUrl("./assets/app.css", "http://localhost:5174/sub/index.html"),
    "http://localhost:5174/sub/assets/app.css",
  );
});

test("formatMicroAppHtml maps html head and body into micro-app scoped elements", () => {
  const html = `<!doctype html><html><head><title>Order</title></head><body><div id="app"></div></body></html>`;

  assert.equal(
    formatMicroAppHtml(html),
    `<!doctype html><html><micro-app-head><title>Order</title></micro-app-head><micro-app-body><div id="app"></div></micro-app-body></html>`,
  );
});

test("extractSourceDom removes executable resources and records them in order", () => {
  const root = document.createElement("div");
  root.innerHTML = formatMicroAppHtml(`
    <html>
      <head>
        <link rel="stylesheet" href="/assets/order.css">
        <style>.panel { color: red; }</style>
      </head>
      <body>
        <div id="app"></div>
        <script src="/assets/vendor.js"></script>
        <script>window.orderLoaded = true</script>
      </body>
    </html>
  `);

  const source = extractSourceDom(root, {
    appName: "order",
    appUrl: "http://localhost:5174/",
  });

  assert.deepEqual(
    source.links.map((item) => item.url),
    ["http://localhost:5174/assets/order.css"],
  );
  assert.equal(source.styles.length, 1);
  assert.deepEqual(
    source.scripts.map((item) => item.url || item.code.trim()),
    ["http://localhost:5174/assets/vendor.js", "window.orderLoaded = true"],
  );
  assert.equal(root.querySelectorAll("link, script").length, 0);
});

test("scopeCssText prefixes normal selectors and keeps keyframes unchanged", () => {
  const css = `.panel, .card:hover { color: red; }
@media (max-width: 600px) { .panel { color: blue; } }
@keyframes spin { from { opacity: 0; } to { opacity: 1; } }`;

  assert.equal(
    scopeCssText(css, "order"),
    `micro-app[name="order"] .panel, micro-app[name="order"] .card:hover { color: red; }
@media (max-width: 600px) { micro-app[name="order"] .panel { color: blue; } }
@keyframes spin { from { opacity: 0; } to { opacity: 1; } }`,
  );
});

test("runScripts wraps module entries with micro app runtime globals", () => {
  const container = document.createElement("micro-app");
  const app = {
    name: "order",
    baseurl: "/micro/order",
    loadId: "order-test-load",
    container,
    source: {
      scripts: [{ type: "module", url: "http://localhost:5174/src/main.js" }],
    },
  };

  runScripts(app);

  const script = container.querySelector("script[type='module']");

  assert.ok(script);
  assert.equal(script.src, "");
  assert.match(
    script.textContent,
    /window\.__MICRO_APP_BASE_URL__ = "\/micro\/order"/,
  );
  assert.match(script.textContent, /window\.__MICRO_APP_NAME__ = "order"/);
  assert.equal(window.__MICRO_APP_CONTAINER__, container);
  assert.match(
    script.textContent,
    /import\("http:\/\/localhost:5174\/src\/main\.js\?__micro_app_entry__=order-test-load"\)/,
  );
});
