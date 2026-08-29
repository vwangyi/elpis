// [路由处理2:] 配置 basename 后，财务子应用内部页面表也只记录内部路径。
export const defaultFinancePath = "/bills";

export const financePages = {
  "/bills": {
    title: "账单中心",
  },
  "/invoice/908": {
    title: "开票处理",
  },
  "/refund/1024": {
    title: "退款打款",
  },
};
