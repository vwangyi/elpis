export const manifest = {
  order: {
    label: '订单子应用',
    entry: 'http://localhost:5174/src/micro-entry.js',
    defaultPath: '/orders/list',
    description: '订单团队自己的独立 Vue 3 SPA，里面有自己的内部页面切换。',
  },
  finance: {
    label: '财务子应用',
    entry: 'http://localhost:5175/src/micro-entry.jsx',
    defaultPath: '/finance/bills',
    description: '财务团队自己的独立 React 18 SPA，挂进主应用以后也只负责自己的业务区。',
  },
}