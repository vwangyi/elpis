import { initGlobalState } from "qiankun";
import { reactive } from "vue";

// 主应用先声明全局状态的字段边界。
// 后续子应用只能通过 setGlobalState 修改这里已经声明过的一层字段。
const initialState = {
  pendingCount: 3,
  lastUpdatedBy: "main-app",
};

// 这是给主应用页面自己用的响应式状态。
// qiankun 的 globalState 不是 Vue reactive，所以主应用需要同步一份到 Vue 状态里展示。
export const hostGlobalState = reactive({ ...initialState });

// initGlobalState 创建 qiankun 全局状态，并返回主应用侧的操作能力。
// qiankun 后续会把 onGlobalStateChange/setGlobalState/offGlobalStateChange 注入到子应用生命周期 props 里。
export const globalActions = initGlobalState(initialState);

// 主应用自己也订阅全局状态变化。
// fireImmediately = true 表示订阅后立刻执行一次回调，把初始值同步到 hostGlobalState。
globalActions.onGlobalStateChange((state) => {
  hostGlobalState.pendingCount = state.pendingCount;
  hostGlobalState.lastUpdatedBy = state.lastUpdatedBy;
}, true);

// 主应用修改待处理事项数时，也统一走 qiankun 的 setGlobalState。
// 这样主应用、订单子应用、财务子应用都会收到同一份状态变化。
export function updatePendingCount(nextCount, lastUpdatedBy = "main-app") {
  globalActions.setGlobalState({
    pendingCount: Math.max(0, nextCount),
    lastUpdatedBy,
  });
}
