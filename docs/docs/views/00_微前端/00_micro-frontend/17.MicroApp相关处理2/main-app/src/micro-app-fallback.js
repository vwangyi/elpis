import { reactive } from "vue";

export const microAppFailures = reactive({});
const delayedAppNames = new Set();

export function delayNextMicroAppFetch(appName) {
  delayedAppNames.add(appName);
}

export function consumeMicroAppFetchDelay(appName) {
  if (!delayedAppNames.has(appName)) return false;
  delayedAppNames.delete(appName);
  return true;
}

function getFailureMessage(error) {
  if (typeof error === "string") return error;
  return error?.message || error?.reason || "子应用资源加载或执行失败";
}

export function reportMicroAppFailure(event) {
  const appName = event?.detail?.name || "unknown";
  const failure = {
    appName,
    message: getFailureMessage(event?.detail?.error),
    failedAt: new Date(),
  };

  microAppFailures[appName] = failure;
  return failure;
}

export function clearMicroAppFailure(appName) {
  delete microAppFailures[appName];
}
