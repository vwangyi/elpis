import { reactive } from 'vue'

export type MicroAppRuntimeStatus =
  'idle' | 'loading' | 'mounted' | 'inactive' | 'error' | 'timeout'

export type MicroAppFailureKind = 'resource' | 'lifecycle' | 'runtime' | 'unknown'

export interface MicroAppRuntimeState {
  appName: string
  label: string
  status: MicroAppRuntimeStatus
  attempt: number
  retryCount: number
  startedAt: number | null
  durationMs: number | null
  failureKind: MicroAppFailureKind | null
  message: string
  detail: string
  technicalDetail: string
}

const initialApps = [
  ['fulfillmentApp', '履约中心'],
  ['settlementApp', '结算中心'],
] as const

export const microAppRuntime = reactive<Record<string, MicroAppRuntimeState>>(
  Object.fromEntries(
    initialApps.map(([appName, label]) => [
      appName,
      {
        appName,
        label,
        status: 'idle',
        attempt: 0,
        retryCount: 0,
        startedAt: null,
        durationMs: null,
        failureKind: null,
        message: '',
        detail: '',
        technicalDetail: '',
      } satisfies MicroAppRuntimeState,
    ]),
  ),
)

function stateOf(appName: string) {
  const state = microAppRuntime[appName]
  if (!state) throw new Error(`Unknown micro app: ${appName}`)
  return state
}

function finishDuration(state: MicroAppRuntimeState) {
  state.durationMs = state.startedAt === null ? null : Date.now() - state.startedAt
}

export function beginMicroAppAttempt(appName: string, retry = false) {
  const state = stateOf(appName)
  state.attempt += 1
  if (retry) state.retryCount += 1
  state.status = 'loading'
  state.startedAt = Date.now()
  state.durationMs = null
  state.failureKind = null
  state.message = `${state.label}正在加载`
  state.detail = '正在准备业务页面，请稍候。'
  state.technicalDetail = ''
  return state.attempt
}

export function isCurrentMicroAppAttempt(appName: string, attempt: number) {
  return stateOf(appName).attempt === attempt
}

export function markMicroAppMounted(appName: string, attempt: number) {
  const state = stateOf(appName)
  if (state.attempt !== attempt) return
  finishDuration(state)
  state.status = 'mounted'
  state.failureKind = null
  state.message = ''
  state.detail = ''
  state.technicalDetail = ''
}

export function markMicroAppInactive(appName: string, attempt?: number) {
  const state = stateOf(appName)
  if (attempt !== undefined && state.attempt !== attempt) return
  if (state.status === 'mounted' || state.status === 'loading' || state.status === 'timeout') {
    state.status = 'inactive'
  }
}

export function markMicroAppTimeout(appName: string, attempt: number, timeoutMs: number) {
  const state = stateOf(appName)
  if (state.attempt !== attempt || state.status !== 'loading') return
  finishDuration(state)
  state.status = 'timeout'
  state.failureKind = null
  state.message = `${state.label}响应较慢`
  state.detail = '暂时无法进入该业务，请稍后重试，或先返回其他页面。'
  state.technicalDetail = `加载超过 ${Math.round(timeoutMs / 100) / 10} 秒`
}

export function markMicroAppFailed(
  appName: string,
  attempt: number,
  failureKind: MicroAppFailureKind,
  error: unknown,
) {
  const state = stateOf(appName)
  if (state.attempt !== attempt) return
  finishDuration(state)
  state.status = 'error'
  state.failureKind = failureKind
  state.message = `暂时无法打开${state.label}`
  switch (failureKind) {
    case 'resource':
      state.detail = '暂时无法连接该业务系统，请确认服务恢复后重试。'
      break
    case 'lifecycle':
      state.detail = '业务页面初始化失败，请稍后重试。'
      break
    case 'runtime':
      state.detail = '业务页面运行异常，请重新加载。'
      break
    default:
      state.detail = '业务页面暂时不可用，请稍后重试。'
  }
  state.technicalDetail = error instanceof Error ? error.message : String(error)
}

export function markActiveMicroAppRuntimeFailure(
  appName: string,
  failureKind: MicroAppFailureKind,
  error: unknown,
) {
  const state = stateOf(appName)
  markMicroAppFailed(appName, state.attempt, failureKind, error)
}

export function resetMicroAppRuntime() {
  for (const state of Object.values(microAppRuntime)) {
    state.status = 'idle'
    state.startedAt = null
    state.durationMs = null
    state.failureKind = null
    state.message = ''
    state.detail = ''
    state.technicalDetail = ''
  }
}
