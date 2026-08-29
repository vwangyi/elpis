import React from "react";
import { createRoot } from "react-dom/client";
import "./settlement-overview.css";

function SettlementOverview({ operator, currency, onOpenTask }) {
  const money = new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });
  const tasks = [
    { task: "深圳渠道付款水单待确认", tag: "收款" },
    { task: "杭州门店季度返利待复核", tag: "返利" },
    { task: "成都直营店开票资料待补充", tag: "开票" },
  ];

  return (
    <section className="federated-settlement-overview">
      <div className="federated-settlement-kpis">
        <article><span>今日回款确认</span><strong>{money.format(486200)}</strong><small>企业转账占 72%</small></article>
        <article><span>待开票金额</span><strong>{money.format(92840)}</strong><small>5 个客户资料不完整</small></article>
      </div>
      <p className="federated-settlement-context">
        <span>当前负责人</span><strong>{operator} · {currency}</strong>
      </p>
      <ul className="federated-settlement-list">
        {tasks.map((item) => (
          <li key={item.task}>
            <span>{item.task}</span><b>{item.tag}</b>
            <button type="button" onClick={() => onOpenTask?.(item)}>处理</button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function mountSettlementOverview(container, initialProps) {
  if (!container) throw new Error("财务远程模块缺少挂载容器");
  const root = createRoot(container);
  let currentProps = initialProps;

  const render = () => root.render(<SettlementOverview {...currentProps} />);
  render();

  return {
    update(nextProps) {
      currentProps = { ...currentProps, ...nextProps };
      render();
    },
    unmount() {
      root.unmount();
    },
  };
}
