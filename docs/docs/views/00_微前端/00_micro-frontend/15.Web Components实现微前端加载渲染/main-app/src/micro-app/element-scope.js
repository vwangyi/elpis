/**
 * 创建子应用看到的 window 代理对象。
 *
 * 参数 app：当前 MicroAppInstance。
 * 返回值：Proxy 包装后的 window。
 *
 * 作用：子应用代码访问 window.document、window.__MICRO_APP_BASE_URL__ 等属性时，
 * 可以拿到微前端运行时准备好的隔离对象或注入信息。
 */
export function createScopedWindow(app) {
  const rawDocument = window.document;
  const scopedDocument = createScopedDocument(app.container, rawDocument);
  let proxyWindow;

  proxyWindow = new Proxy(window, {
    get(target, key) {
      // 保证 window.window、window.self、globalThis 都指向代理对象，
      // 这样子应用从不同入口取到的仍然是同一套隔离环境。
      if (key === "window" || key === "self" || key === "globalThis") {
        return proxyWindow;
      }

      // document 是最关键的隔离点：
      // 子应用 document.querySelector 优先在自己的 micro-app 容器里查找。
      if (key === "document") {
        return scopedDocument;
      }

      if (key === "__MICRO_APP_BASE_URL__") {
        // 子应用有自己的路由时，需要知道主应用分配给它的路由前缀。
        return app.baseurl;
      }

      if (key === "__MICRO_APP_NAME__") {
        // 真实框架通常也会给子应用注入当前应用名，便于通信和调试。
        return app.name;
      }

      // 其他 window 属性仍然从真实 window 上读取，保证常用浏览器 API 可以继续使用。
      const value = Reflect.get(target, key);
      return bindNativeFunction(value, target);
    },
    set(target, key, value) {
      // 本手写版没有做完整沙箱，子应用写 window.xxx 时仍会写到真实 window。
      Reflect.set(target, key, value);
      return true;
    },
  });

  return proxyWindow;
}

/**
 * 创建子应用看到的 document 代理对象。
 *
 * 参数：
 * - container：当前 <micro-app> 容器；
 * - rawDocument：浏览器真实 document。
 *
 * 作用：让常见 DOM 查询优先限制在当前子应用容器内，
 * 避免多个子应用都有 #app 时互相查错节点。
 */
function createScopedDocument(container, rawDocument) {
  return new Proxy(rawDocument, {
    get(target, key) {
      if (key === "querySelector") {
        // 优先查当前 micro-app，查不到再退回真实 document。
        // 退回能力是为了让示例更容易运行，但真实框架会更谨慎。
        return (selector) =>
          container.querySelector(selector) || target.querySelector(selector);
      }

      if (key === "querySelectorAll") {
        // 如果当前子应用里能查到结果，就只返回子应用内部结果。
        return (selector) => {
          const scopedResult = container.querySelectorAll(selector);
          return scopedResult.length
            ? scopedResult
            : target.querySelectorAll(selector);
        };
      }

      if (key === "getElementById") {
        // getElementById 也要先限制在当前容器，解决多个子应用都写 id="app" 的情况。
        return (id) =>
          container.querySelector(`#${CSS.escape(id)}`) ||
          target.getElementById(id);
      }

      if (key === "head") {
        // 子应用 document.head 指向 micro-app-head，方便脚本动态插入样式。
        return container.querySelector("micro-app-head") || target.head;
      }

      if (key === "body") {
        // 子应用 document.body 指向 micro-app-body，避免直接操作主应用 body。
        return container.querySelector("micro-app-body") || target.body;
      }

      const value = Reflect.get(target, key);
      return bindNativeFunction(value, target);
    },
  });
}

/**
 * 绑定原生函数的 this。
 *
 * 参数：
 * - value：从 window/document 上读取到的属性值；
 * - target：属性所属的真实对象。
 *
 * 意义：很多浏览器原生方法要求 this 必须是原对象，
 * 例如 document.createElement 直接拿出来调用会报 Illegal invocation。
 *
 * 注意：构造函数和 class 不能随便 bind，否则 Array.from 等静态方法会丢失，
 * 所以这里会识别构造函数并原样返回。
 */
function bindNativeFunction(value, target) {
  if (typeof value !== "function") return value;

  const valueText = Function.prototype.toString.call(value);
  const isConstructor =
    /^function\s+[A-Z]/.test(valueText) || /^class\s+/.test(valueText);

  return isConstructor ? value : value.bind(target);
}
