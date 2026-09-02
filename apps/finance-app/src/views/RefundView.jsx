export default function RefundView() {
  return (
    <section className="view-grid">
      <article className="view-card view-card-strong">
        <h2>退款单 F-1024</h2>
      </article>

      <article className="view-card">
        <h2>打款信息</h2>
        <ul>
          <li>退款金额：699 元</li>
          <li>付款渠道：企业网银</li>
          <li>打款状态：待执行</li>
        </ul>
      </article>

      <article className="view-card">
        <h2>后续动作</h2>
        <ul>
          <li>提交复核</li>
          <li>通知订单系统回写结果</li>
          <li>归档财务凭证</li>
        </ul>
      </article>
    </section>
  );
}
