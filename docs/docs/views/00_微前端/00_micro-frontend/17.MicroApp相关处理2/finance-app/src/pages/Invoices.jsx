export function Invoices() {
  return (
    <>
      <div className="finance-layout">
        <article className="finance-panel">
          <span>待开票客户</span>
          <strong>18</strong>
          <p>其中 5 个客户缺少完整开票资料。</p>
        </article>

        <article className="finance-panel">
          <span>红冲申请</span>
          <strong>3</strong>
          <p>需要财务经理复核后进入处理队列。</p>
        </article>
      </div>

      <ul className="finance-list" aria-label="发票任务">
        <li>
          <span>南京渠道客户增值税专票待开具</span>
          <strong className="finance-tag">专票</strong>
        </li>
        <li>
          <span>成都直营店发票抬头信息待确认</span>
          <strong className="finance-tag">资料</strong>
        </li>
      </ul>
    </>
  );
}
