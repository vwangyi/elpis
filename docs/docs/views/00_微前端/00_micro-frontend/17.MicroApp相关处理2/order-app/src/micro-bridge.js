import { reactive } from "vue";

export const hostContext = reactive({
  operator: "独立运行",
  warehouse: "本地仓",
  permission: "read",
});

export const globalContext = reactive({
  theme: "light",
  riskMode: false,
  user: "本地用户",
});

export const appState = reactive({ value: "mounted" });

function receiveData(data) {
  Object.assign(hostContext, data);
}

function receiveGlobalData(data) {
  Object.assign(globalContext, data);
}

function receiveAppState(event) {
  appState.value = event.detail.appState;
}

export function connectMicroApp() {
  if (!window.microApp) return;
  window.microApp.addDataListener(receiveData, true);
  window.microApp.addGlobalDataListener(receiveGlobalData, true);
  window.addEventListener("appstate-change", receiveAppState);
}

export function disconnectMicroApp() {
  if (!window.microApp) return;
  window.microApp.removeDataListener(receiveData);
  window.microApp.removeGlobalDataListener(receiveGlobalData);
  window.removeEventListener("appstate-change", receiveAppState);
}

export function reportToHost(message) {
  window.microApp?.dispatch({ message, source: "order" });
}
