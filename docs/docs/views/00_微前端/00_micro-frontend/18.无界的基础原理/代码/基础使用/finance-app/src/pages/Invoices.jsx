import { useState } from "react";

export function Invoices() {
  const [selectedTask, setSelectedTask] = useState("南京渠道客户增值税专票待开具");

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

      <ul className="finance-list invoice-tasks" aria-label="发票任务">
        <li>
          <button type="button" onClick={() => setSelectedTask("南京渠道客户增值税专票待开具")}>南京渠道客户增值税专票待开具</button>
          <strong className="finance-tag">专票</strong>
        </li>
        <li>
          <button type="button" onClick={() => setSelectedTask("成都直营店发票抬头信息待确认")}>成都直营店发票抬头信息待确认</button>
          <strong className="finance-tag">资料</strong>
        </li>
      </ul>

      <p className="selected-task">当前处理：{selectedTask}</p>
    </>
  );
}
