import { reactive } from "vue";

const defaultContext = {
  name: "本地运营人员",
  role: "订单专员",
  warehouse: "本地仓",
  permission: "read",
};

export const hostContext = reactive({
  ...defaultContext,
});

export const operationNotice = reactive({
  id: 0,
  content: "暂无新的运营通知",
});

export function connectHost() {}

export function disconnectHost() {}

export function reportExceptionReview(count) {
  window.dispatchEvent(
    new CustomEvent("order:exception-reviewed", {
      detail: { count, operator: hostContext.name },
    }),
  );
}
