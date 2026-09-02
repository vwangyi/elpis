export default function InvoiceView() {
  return (
    <section className="view-grid">
      <article className="view-card view-card-strong">
        <h2>发票号 I-908</h2>
      </article>

      <article className="view-card">
        <h2>开票信息</h2>
        <ul>
          <li>开票金额：12,800 元</li>
          <li>抬头类型：企业</li>
          <li>审核状态：处理中</li>
        </ul>
      </article>

      <article className="view-card">
        <h2>关联流程</h2>
        <ul>
          <li>校验税号</li>
          <li>确认邮寄地址</li>
          <li>回写开票结果</li>
        </ul>
      </article>
    </section>
  );
}
