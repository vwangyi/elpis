export const MICRO_APP_STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  READY: "ready",
  ERROR: "error",
  TIMEOUT: "timeout",
};

// 为每个子应用创建一份独立运行状态，主应用页面和 qiankun 回调都读写这份状态。
function createInitialStatus(config) {
  return {
    label: config.label, // 子应用的业务名称，用于拼接“财务系统加载中”等页面文案。
    defaultPath: config.defaultPath, // 子应用的默认业务路由，重试或返回该应用时作为目标地址。
    status: MICRO_APP_STATUS.IDLE, // 当前运行状态，值只能是 idle、loading、ready、error、timeout 之一。
    message: "", // 给用户看的主提示，例如“财务系统暂时不可用”。
    detail: "", // 对主提示的补充说明，通常保存具体错误原因或超时说明。
    error: null, // 原始错误对象或错误标记，供调试、监控上报和错误分类使用。
    retryCount: 0, // 用户已经发起的重试次数，每次 prepareRetry() 时加 1。
    lastFailedAt: "", // 最近一次进入 error 状态的时间，方便展示或上报故障发生时刻。
    dismissed: false, // 用户是否关闭了当前兜底提示；关闭提示不代表子应用已经恢复。
    timeoutId: null, // 加载超时计时器编号，用于成功、失败或重试时取消旧计时器。
    readyTimerId: null, // 最短 loading 展示计时器编号，防止延迟进入 ready 的旧任务继续执行。
    loadingStartedAt: 0, // 本次开始加载的时间戳，用来计算 loading 已经展示了多久。
  };
}

// 把不同来源的错误统一转成页面可展示的文本。
function getErrorDetail(error) {
  if (!error) return "";
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return error.message || error.reason?.message || String(error);
}

// 创建主应用侧的子应用运行状态仓库。
// 集中保存所有子应用的状态，并提供加载、成功、失败、超时、重试等状态修改方法。
export function createMicroAppStatusStore({
  apps,
  timeoutMs = 12000,
  minLoadingMs = 700,
  now = Date.now,
  setTimer = window.setTimeout.bind(window),
  clearTimer = window.clearTimeout.bind(window),
  stateFactory = (value) => value,
}) {
  // state 是主应用后续一直读写的子应用状态表，例如 state.finance.status。
  // stateFactory 决定这张状态表用什么形式创建：在 Vue 项目里传 reactive，让页面能跟着状态变化自动更新；测试里不传时就是普通对象。
  const state = stateFactory(
    Object.fromEntries(
      Object.entries(apps).map(([appName, config]) => [
        appName,
        createInitialStatus(config),
      ]),
    ),
  );
  // 清理加载超时计时器。加载成功、失败、重试时都不能留下旧计时器继续改状态。
  function clearAppTimer(appName) {
    const appStatus = state[appName];
    if (!appStatus?.timeoutId) return;
    clearTimer(appStatus.timeoutId);
    appStatus.timeoutId = null;
  }

  // 清理“最短 loading 展示时间”计时器，避免旧的 ready 回调覆盖新的失败或重试状态。
  function clearReadyTimer(appName) {
    const appStatus = state[appName];
    if (!appStatus?.readyTimerId) return;
    clearTimer(appStatus.readyTimerId);
    appStatus.readyTimerId = null;
  }

  // 把子应用标记为可用，并清掉页面上的 loading 和错误信息。
  function setReady(appStatus) {
    appStatus.status = MICRO_APP_STATUS.READY;
    appStatus.message = "";
    appStatus.detail = "";
    appStatus.error = null;
    appStatus.dismissed = false;
    appStatus.readyTimerId = null;
  }

  // qiankun loader(true) 时调用：进入 loading，并启动超时保护。
  function markLoading(appName) {
    const appStatus = state[appName];
    if (!appStatus) return;

    clearAppTimer(appName);
    clearReadyTimer(appName);
    appStatus.status = MICRO_APP_STATUS.LOADING;
    appStatus.message = `${appStatus.label}加载中`;
    appStatus.detail = "";
    appStatus.error = null;
    appStatus.dismissed = false;
    appStatus.loadingStartedAt = now();
    appStatus.timeoutId = setTimer(() => {
      appStatus.status = MICRO_APP_STATUS.TIMEOUT;
      appStatus.message = `${appStatus.label}加载时间过长`;
      appStatus.detail = "服务仍在连接中，可以继续等待，或先处理其他业务。";
      appStatus.error = "timeout";
      appStatus.timeoutId = null;
    }, timeoutMs);
  }

  // qiankun loader(false) 时调用：加载结束，但为了课堂可观察性，会保证 loading 至少展示 minLoadingMs。
  function markReady(appName) {
    const appStatus = state[appName];
    if (!appStatus) return;

    clearAppTimer(appName);
    clearReadyTimer(appName);

    const visibleDuration = now() - appStatus.loadingStartedAt;
    const remainingDuration = Math.max(0, minLoadingMs - visibleDuration);
    if (remainingDuration > 0) {
      appStatus.readyTimerId = setTimer(
        () => setReady(appStatus),
        remainingDuration,
      );
      return;
    }

    setReady(appStatus);
  }

  // 子应用加载失败、运行时异常或业务错误上报时调用：进入 error，并记录错误详情和失败时间。
  function markFailed(appName, error) {
    const appStatus = state[appName];
    if (!appStatus) return;

    clearAppTimer(appName);
    clearReadyTimer(appName);
    appStatus.status = MICRO_APP_STATUS.ERROR;
    appStatus.message = `${appStatus.label}暂时不可用`;
    appStatus.detail = getErrorDetail(error);
    appStatus.error = error || "unknown error";
    appStatus.dismissed = false;
    appStatus.lastFailedAt = new Date().toLocaleTimeString();
  }

  // 用户点击“重新加载”前调用：清掉旧错误和计时器，并累计重试次数。
  function prepareRetry(appName) {
    const appStatus = state[appName];
    if (!appStatus) return;

    clearAppTimer(appName);
    clearReadyTimer(appName);
    appStatus.status = MICRO_APP_STATUS.IDLE;
    appStatus.message = "";
    appStatus.detail = "";
    appStatus.error = null;
    appStatus.dismissed = false;
    appStatus.retryCount += 1;
  }

  // 用户只是关闭当前兜底提示，不代表子应用已经恢复；下一次 loading 或 error 会重新展示。
  function dismissCurrentStatus(appName) {
    const appStatus = state[appName];
    if (!appStatus) return;

    appStatus.dismissed = true;
  }

  return {
    state,
    markLoading,
    markReady,
    markFailed,
    prepareRetry,
    dismissCurrentStatus,
  };
}
