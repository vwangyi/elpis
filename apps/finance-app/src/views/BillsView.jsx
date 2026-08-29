export default function BillsView() {
  return (
    <section className="view-grid">
      <article className="view-card finance-lifecycle-card lifecycle-style-marker">
        <h2>本月账单概览</h2>
        <p>回款进度 76%，本月异常账单 5 笔。</p>
      </article>

      <article className="view-card notice-card">
        <h2>待处理</h2>
        <ul>
          <li>待确认账单 12 笔</li>
          <li>待核销收款 8 笔</li>
          <li>待对账记录 5 条</li>
        </ul>
      </article>

      <article className="view-card">
        <h2>常用操作</h2>
        <ul>
          <li>导出收支日报</li>
          <li>进入对账流程</li>
          <li>查看异常提醒</li>
        </ul>
      </article>
    </section>
  );
}
