import { reactive } from "vue";

const defaultContext = {
  name: "本地运营人员",
  role: "订单专员",
  warehouse: "本地仓",
  permission: "read",
};

export const hostContext = reactive({
  ...defaultContext,
  ...(window.$wujie?.props || {}),
});

export const operationNotice = reactive({
  id: 0,
  content: "暂无新的运营通知",
});

function receiveWarehouse(warehouse) {
  hostContext.warehouse = warehouse;
}

function receiveOperationNotice(notice) {
  operationNotice.id = notice.id;
  operationNotice.content = notice.content;
}

export function connectHost() {
  window.$wujie?.bus.$on("host:warehouse-changed", receiveWarehouse);
  window.$wujie?.bus.$on("host:operation-notice", receiveOperationNotice);
}

export function disconnectHost() {
  window.$wujie?.bus.$off("host:warehouse-changed", receiveWarehouse);
  window.$wujie?.bus.$off("host:operation-notice", receiveOperationNotice);
}

export function reportExceptionReview(count) {
  window.$wujie?.bus.$emit("order:exception-reviewed", {
    count,
    operator: hostContext.name,
  });
}
