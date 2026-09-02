import { useSyncExternalStore } from "react";

// React 子应用内部保存的当前全局状态快照。
// 它是普通 JS 变量，不是 React state，所以变更后需要主动通知 React 重新渲染。
let snapshot = {
  pendingCount: 0,
  lastUpdatedBy: "独立运行",
};

// 这两个方法来自 qiankun 注入到子应用 mount(props) 的 props。
// 独立运行时没有主应用，所以它们会保持为 null。
let setGlobalState = null;
let offGlobalStateChange = null;

// React 组件通过 useSyncExternalStore 订阅这个外部 store。
// listeners 里保存的是 React 传进来的“重新渲染通知函数”。
const listeners = new Set();

function emitChange() {
  // snapshot 变化后，逐个通知使用了 useSharedGlobalState 的 React 组件重新取值并渲染。
  listeners.forEach((listener) => listener());
}

function syncSnapshot(state = {}) {
  // 创建新对象，而不是原地修改 snapshot。
  // React 读取外部 store 时更容易根据新引用判断快照已经变化。
  snapshot = {
    ...snapshot,
    ...(typeof state.pendingCount === "number"
      ? { pendingCount: state.pendingCount }
      : null),
    ...(state.lastUpdatedBy ? { lastUpdatedBy: state.lastUpdatedBy } : null),
  };
  emitChange();
}

export function bindGlobalState(props = {}) {
  // 保存 qiankun 给子应用的修改/清理能力，后面页面点击按钮时会用到 setGlobalState。
  setGlobalState = props.setGlobalState || null;
  offGlobalStateChange = props.offGlobalStateChange || null;

  // 子应用入口处只订阅一次 qiankun 全局状态。
  // 收到变化后先同步到本应用自己的 snapshot，再通知 React 组件更新。
  props.onGlobalStateChange?.((state) => {
    syncSnapshot(state);
  }, true);
}

export function unbindGlobalState() {
  // 财务子应用被卸载时，清理 qiankun 全局状态监听，避免离场应用继续响应变化。
  offGlobalStateChange?.();
  setGlobalState = null;
  offGlobalStateChange = null;
}

export function changePendingCount(delta) {
  const nextCount = Math.max(0, snapshot.pendingCount + delta);

  if (setGlobalState) {
    // 嵌入主应用时，修改 qiankun 全局状态，让主应用和其他子应用都收到变化。
    setGlobalState({
      pendingCount: nextCount,
      lastUpdatedBy: "finance-app",
    });
    return;
  }

  // 独立运行时没有 qiankun 全局状态，直接更新本地 snapshot，保证页面按钮仍然可用。
  syncSnapshot({
    pendingCount: nextCount,
    lastUpdatedBy: "finance-app",
  });
}

export function useSharedGlobalState() {
  return useSyncExternalStore(
    (listener) => {
      // React 把 listener 交给我们；外部 snapshot 变化时调用它，React 就会重新渲染组件。
      listeners.add(listener);
      // 返回清理函数。组件卸载时 React 会调用它，移除当前组件的监听。
      return () => listeners.delete(listener);
    },
    // React 每次渲染时，通过这个函数读取当前 snapshot。
    () => snapshot,
    // 服务端渲染兜底；本示例没有 SSR，返回同一份 snapshot 即可。
    () => snapshot,
  );
}
