import { reactive } from "vue";

export const operatorContext = reactive({
  name: "林乔",
  role: "运营管理员",
  warehouse: "华东仓",
  permission: "approve",
  currency: "CNY",
});

export const microApps = {
  order: {
    name: "order",
    label: "订单中心",
    summary: "订单履约、异常派单和库存占用集中处理。",
    route: "/micro/order",
    url: "http://localhost:5174/list",
    alive: true,
  },
  finance: {
    name: "finance",
    label: "财务中心",
    summary: "收款确认、发票处理和结算风险集中处理。",
    route: "/micro/finance",
    url: "http://localhost:5175/settlement",
    alive: false,
  },
};

const delayedAppNames = new Set();

export function delayNextAppFetch(appName) {
  delayedAppNames.add(appName);
}

export async function fetchMicroResource(input, init) {
  const requestUrl = typeof input === "string" ? input : input.url;
  const requestOrigin = new URL(requestUrl, window.location.href).origin;
  const delayedApp = Object.values(microApps).find(
    (app) => new URL(app.url).origin === requestOrigin,
  );

  if (delayedApp && delayedAppNames.delete(delayedApp.name)) {
    await new Promise((resolve) => window.setTimeout(resolve, 1500));
  }

  return window.fetch(input, init);
}
