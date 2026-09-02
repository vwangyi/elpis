export const MICRO_ROUTER_STATE_KEY = '__MICRO_ROUTER__'

type StateRecord = Record<string, unknown>

function isStateRecord(value: unknown): value is StateRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function getStateRecord(value: unknown): StateRecord {
  return isStateRecord(value) ? value : {}
}

/**
 * 读取当前浏览器历史条目中某个微应用自己的 state 槽位。
 * 主应用的 state 仍保留在顶层，避免改变主应用路由库的读取方式。
 */
export function readScopedState<T>(history: History, appName: string): T | null {
  const sharedState = getStateRecord(history.state)
  const microStates = getStateRecord(sharedState[MICRO_ROUTER_STATE_KEY])
  return (microStates[appName] as T | undefined) ?? null
}

/**
 * 将微应用 state 合并回真实 history.state，而不是覆盖其他路由库的数据。
 */
export function mergeScopedState(
  history: History,
  appName: string,
  scopedState: unknown,
): StateRecord {
  const sharedState = getStateRecord(history.state)
  const microStates = getStateRecord(sharedState[MICRO_ROUTER_STATE_KEY])

  return {
    ...sharedState,
    [MICRO_ROUTER_STATE_KEY]: {
      ...microStates,
      [appName]: scopedState,
    },
  }
}

export function writeScopedState(
  history: History,
  appName: string,
  scopedState: unknown,
  url: string | URL | null,
  replace: boolean,
) {
  const nextState = mergeScopedState(history, appName, scopedState)
  history[replace ? 'replaceState' : 'pushState'](nextState, '', url)
}
