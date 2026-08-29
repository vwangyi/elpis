export const defaultFinancePath = '/finance/bills'

export const financePages = {
  '/finance/bills': {
    title: '账单中心',
    description: '这里展示账单汇总、收支概览和常用对账入口。',
    bullets: ['账单汇总', '收款状态', '对账入口'],
  },
  '/finance/invoice/908': {
    title: '开票处理',
    description: '这里模拟开票处理页，包含审核状态和客户信息。',
    bullets: ['发票号 908', '审核状态：处理中', '关联客户信息'],
  },
  '/finance/refund/1024': {
    title: '退款打款',
    description: '这里模拟财务执行退款打款的页面。',
    bullets: ['退款单号 1024', '打款状态：待执行', '付款渠道：企业网银'],
  },
}