window.microApps = window.microApps || {};

window.microApps.order = {
  // mount 负责把订单子应用真正渲染到主应用传进来的容器里。
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
            background: rgba(25, 77, 99, 0.08);
            color: #194d63;
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
            border: 1px solid rgba(25, 77, 99, 0.12);
            background: rgba(25, 77, 99, 0.06);
            color: #194d63;
            padding: 10px 14px;
            border-radius: 14px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 700;
          }

          .route-btn.active {
            color: #eef7fb;
            background: #194d63;
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
            background: rgba(25, 77, 99, 0.05);
            color: #1c2a39;
            line-height: 1.8;
          }

          .child-item.emphasize {
            background: rgba(166, 81, 42, 0.08);
          }
        </style>
        <div class="child-head">
          <div>
            <span class="child-badge">订单子应用脚本</span>
            <h2>订单管理</h2>
          </div>
          <div class="child-entry">
            入口文件：js运行时接入-订单子应用.js
          </div>
        </div>
        <p>这里已经是在主应用壳子里面了。你点下面的业务页签，会看到当前系统路径一起变，这就是它和 iframe 里“路由很难天然同步”最直观的差别之一。</p>
        <div class="route-toolbar">
          <button class="route-btn active" data-route="#/orders/list">订单列表</button>
          <button class="route-btn" data-route="#/orders/refund/1024">退款详情</button>
          <button class="route-btn" data-route="#/orders/logistics/7788">物流追踪</button>
        </div>
        <div class="route-box" id="orderRouteText">当前子应用路由：#/orders/list</div>
        <div class="child-list" id="orderView"></div>
      </section>
    `;

    const routeButtons = container.querySelectorAll('.route-btn');
    const routeText = container.querySelector('#orderRouteText');
    const view = container.querySelector('#orderView');

    // 切换子应用内部路由时，同时把新路径同步给主应用壳子。
    function setRoute(route) {
      routeButtons.forEach((button) => {
        button.classList.toggle('active', button.dataset.route === route);
      });

      routeText.textContent = `当前子应用路由：${route}`;

      if (route === '#/orders/refund/1024') {
        view.innerHTML = `
          <div class="child-item emphasize">退款详情：订单 1024 进入退款审批流程。</div>
          <div class="child-item">这里模拟的是订单子应用里的内部业务页切换，但主应用顶部路径也能马上跟着更新。</div>
        `;
      } else if (route === '#/orders/logistics/7788') {
        view.innerHTML = `
          <div class="child-item">物流详情：运单 7788 当前正在派送中。</div>
          <div class="child-item">运行时接入时，路由同步可以通过回调、共享路由约定等方式自然配合。</div>
        `;
      } else {
        view.innerHTML = `
          <div class="child-item">订单列表：这里显示订单查询、筛选、分页。</div>
          <div class="child-item">售后处理：这里显示售后单和退款入口。</div>
        `;
      }

      shell?.onRouteChange?.(route);
    }

    function resolveInitialRoute() {
      const route = shell?.initialRoute;
      const hasMatchedButton = Array.from(routeButtons).some((button) => button.dataset.route === route);

      return hasMatchedButton ? route : '#/orders/list';
    }

    routeButtons.forEach((button) => {
      button.addEventListener('click', () => {
        setRoute(button.dataset.route);
      });
    });

    // 重新挂载时优先恢复上一次停留的子路由，而不是每次都回默认页。
    setRoute(resolveInitialRoute());
  },

  // unmount 负责把旧子应用从主应用容器里移走，给下一个子应用腾位置。
  unmount(container) {
    container.innerHTML = '';
  },
};