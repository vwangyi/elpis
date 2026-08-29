window.microApps = window.microApps || {};

window.microApps.finance = {
  // mount 负责把财务子应用挂到主应用当前传进来的容器里。
  mount(container, shell) {
    container.innerHTML = `
      <section class="child-panel">
        <style>
          .child-panel {
            padding: 26px;
            border-radius: 24px;
            border: 1px solid rgba(28, 42, 57, 0.08);
            background: rgba(255, 255, 255, 0.94);
          }

          .child-head {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 14px;
            margin-bottom: 10px;
          }

          .child-badge {
            display: inline-flex;
            align-items: center;
            padding: 8px 12px;
            border-radius: 999px;
            background: rgba(166, 81, 42, 0.1);
            color: #a6512a;
            font-size: 12px;
            font-weight: 700;
          }

          .child-entry {
            color: #65707c;
            font-size: 13px;
            text-align: right;
            line-height: 1.6;
          }

          .child-panel h2 {
            margin: 0 0 10px;
            font-size: 28px;
            color: #1c2a39;
          }

          .child-panel p {
            margin: 0 0 14px;
            color: #65707c;
            line-height: 1.8;
          }

          .route-toolbar {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin: 18px 0 14px;
          }

          .route-btn {
            appearance: none;
            border: 1px solid rgba(166, 81, 42, 0.16);
            background: rgba(166, 81, 42, 0.06);
            color: #a6512a;
            padding: 10px 14px;
            border-radius: 14px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 700;
          }

          .route-btn.active {
            color: #fff6f0;
            background: #a6512a;
          }

          .route-box {
            margin-bottom: 16px;
            padding: 14px 16px;
            border-radius: 18px;
            background: rgba(28, 42, 57, 0.04);
            color: #1c2a39;
            font-family: "SFMono-Regular", Menlo, monospace;
            font-size: 13px;
          }

          .child-list {
            display: grid;
            gap: 12px;
          }

          .child-item {
            padding: 16px;
            border-radius: 18px;
            background: rgba(166, 81, 42, 0.08);
            color: #1c2a39;
            line-height: 1.8;
          }

          .child-item.emphasize {
            background: rgba(25, 77, 99, 0.08);
          }
        </style>
        <div class="child-head">
          <div>
            <span class="child-badge">财务子应用脚本</span>
            <h2>财务管理</h2>
          </div>
          <div class="child-entry">
            入口文件：js运行时接入-财务子应用.js
          </div>
        </div>
        <p>这个财务模块和订单模块共用同一个主应用壳子。你点下面的财务页签时，不需要 iframe 通信桥，主应用就能直接同步当前路径。</p>
        <div class="route-toolbar">
          <button class="route-btn active" data-route="#/finance/bills">账单中心</button>
          <button class="route-btn" data-route="#/finance/invoice/908">开票处理</button>
          <button class="route-btn" data-route="#/finance/refund/1024">退款打款</button>
        </div>
        <div class="route-box" id="financeRouteText">当前子应用路由：#/finance/bills</div>
        <div class="child-list" id="financeView"></div>
      </section>
    `;

    const routeButtons = container.querySelectorAll('.route-btn');
    const routeText = container.querySelector('#financeRouteText');
    const view = container.querySelector('#financeView');

    // 财务子应用内部切路由时，直接把结果同步给主应用当前页。
    function setRoute(route) {
      routeButtons.forEach((button) => {
        button.classList.toggle('active', button.dataset.route === route);
      });

      routeText.textContent = `当前子应用路由：${route}`;

      if (route === '#/finance/invoice/908') {
        view.innerHTML = `
          <div class="child-item emphasize">开票处理：发票 908 正在审核中。</div>
          <div class="child-item">主应用壳子不用额外 postMessage，就能直接知道当前财务页面已经切到了哪个路由。</div>
        `;
      } else if (route === '#/finance/refund/1024') {
        view.innerHTML = `
          <div class="child-item">退款打款：订单 1024 的退款付款单待执行。</div>
          <div class="child-item">这也是运行时接入更容易做统一路由体验的一点。</div>
        `;
      } else {
        view.innerHTML = `
          <div class="child-item">账单中心：展示账单汇总、收款状态、对账情况。</div>
          <div class="child-item">财务概览：展示近 7 天入账和待开票数据。</div>
        `;
      }

      shell?.onRouteChange?.(route);
    }

    function resolveInitialRoute() {
      const route = shell?.initialRoute;
      const hasMatchedButton = Array.from(routeButtons).some((button) => button.dataset.route === route);

      return hasMatchedButton ? route : '#/finance/bills';
    }

    routeButtons.forEach((button) => {
      button.addEventListener('click', () => {
        setRoute(button.dataset.route);
      });
    });

    // 重新挂载时优先恢复上一次停留的子路由，而不是每次都回默认页。
    setRoute(resolveInitialRoute());
  },

  // unmount 负责把旧的财务界面从主应用容器中清掉。
  unmount(container) {
    container.innerHTML = '';
  },
};