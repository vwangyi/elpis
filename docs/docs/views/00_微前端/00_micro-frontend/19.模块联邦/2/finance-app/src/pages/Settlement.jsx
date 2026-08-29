export function Settlement() {
  return (
    <>
      <div className="finance-layout">
        <article className="finance-panel">
          <span>今日回款确认</span>
          <strong>¥ 486,200</strong>
          <p>其中企业转账 72%，线上支付 28%。</p>
        </article>
        <article className="finance-panel">
          <span>待开票金额</span>
          <strong>¥ 92,840</strong>
          <p>华南区域票据等待客户信息复核。</p>
        </article>
      </div>

      <ul className="finance-list" aria-label="财务任务">
        <li><span>深圳南山渠道客户付款水单待确认</span><strong className="finance-tag">收款</strong></li>
        <li><span>杭州门店季度返利进入复核队列</span><strong className="finance-tag">返利</strong></li>
        <li><span>成都直营店发票抬头缺少税号</span><strong className="finance-tag">开票</strong></li>
      </ul>
    </>
  );
}
