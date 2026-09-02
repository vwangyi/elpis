import type {
  BusinessEvent,
  BusinessEventInput,
  BusinessEventType,
  MicroBridge,
  PlatformState,
  StateListener,
} from './contracts.ts'

export interface CreateMicroBridgeOptions {
  /** 通信桥创建时保存的第一份平台状态。 */
  initialState: PlatformState
  /** 单个订阅者执行失败时的统一错误出口。 */
  onError?: (error: unknown, context: BusinessEvent | { type: 'state-change' }) => void
}

type EventListener = (event: BusinessEvent) => void

function cloneState(state: PlatformState): PlatformState {
  // 对外只返回副本，避免应用绕过 setState 直接修改通信桥内部状态。
  return { ...state, badges: { ...state.badges } }
}

function stateChanged(left: PlatformState, right: PlatformState) {
  // 状态没有真正变化时不通知，避免主题同步形成无意义的重复更新。
  return (
    left.theme !== right.theme ||
    left.resolvedTheme !== right.resolvedTheme ||
    left.badges.fulfillment !== right.badges.fulfillment ||
    left.badges.settlement !== right.badges.settlement
  )
}

export function createBusinessEvent<TType extends BusinessEventType>(
  input: BusinessEventInput<TType>,
): BusinessEvent<TType> {
  // 业务代码只提供业务字段；公共字段由这里统一补齐。
  return {
    ...input,
    id: input.id ?? crypto.randomUUID(),
    occurredAt: input.occurredAt ?? new Date().toISOString(),
    version: 1,
  } as BusinessEvent<TType>
}

export function createMicroBridge(options: CreateMicroBridgeOptions): MicroBridge {
  // state 是平台当前值的唯一保存位置。
  let state = cloneState(options.initialState)
  // 共享状态只有一组订阅者；业务消息则按照消息名称分别保存订阅者。
  const stateListeners = new Set<StateListener>()

  const eventListeners = new Map<BusinessEventType, Set<EventListener>>()
  // 主应用需要监听全部消息，用于统一显示通知和刷新角标。
  const allEventListeners = new Set<EventListener>()

  const reportError = (error: unknown, context: BusinessEvent | { type: 'state-change' }) =>
    options.onError?.(error, context)

  return {
    getState() {
      // 返回快照而不是内部对象，调用方修改返回值不会污染真实状态。
      return cloneState(state)
    },

    setState(patch) {
      const previousState = cloneState(state)

      // patch 只包含本次要修改的字段，其余字段继续沿用旧状态。
      const nextState: PlatformState = {
        ...state,
        ...patch,
        badges: patch.badges ? { ...patch.badges } : { ...state.badges },
      }
      if (!stateChanged(state, nextState)) return

      state = nextState
      const snapshot = cloneState(state)

      // 使用数组副本遍历，允许监听器在回调中安全地取消订阅。
      for (const listener of [...stateListeners]) {
        try {
          listener(snapshot, previousState)
        } catch (error) {
          // 一个应用的监听器报错，不能阻止其他应用继续接收状态。
          reportError(error, { type: 'state-change' })
        }
      }
    },

    subscribeState(listener) {
      stateListeners.add(listener)

      // 订阅时立即发送当前快照，稍后加载的子应用也能马上获得正确主题。
      const snapshot = cloneState(state)
      try {
        listener(snapshot, snapshot)
      } catch (error) {
        reportError(error, { type: 'state-change' })
      }

      // 调用返回函数即可取消本次订阅，子应用卸载时必须执行。
      return () => stateListeners.delete(listener)
    },

    publish(event: BusinessEvent) {
      // 当前通信器只处理第 1 版消息，未知版本不会交给旧代码执行。
      if (event.version !== 1) return
      const listeners = eventListeners.get(event.type) ?? new Set<EventListener>()

      // 同时通知指定类型订阅者和监听全部消息的主应用订阅者。
      for (const listener of [...listeners, ...allEventListeners]) {
        try {
          listener(event)
        } catch (error) {
          // 单个接收方失败不会中断后面的接收方。
          reportError(error, event)
        }
      }
    },

    subscribe(type, listener) {
      // 相同消息名称的订阅者放在同一个 Set 中，publish 时可以按名称查找。
      const listeners = eventListeners.get(type) ?? new Set<EventListener>()
      listeners.add(listener as EventListener)
      eventListeners.set(type, listeners)
      return () => {
        listeners.delete(listener as EventListener)
        // 没有订阅者后删除空集合，避免长期运行时积累无用消息名称。
        if (listeners.size === 0) eventListeners.delete(type)
      }
    },

    subscribeAll(listener) {
      allEventListeners.add(listener)
      // subscribeAll 与 subscribe 保持相同的“订阅后返回取消函数”约定。
      return () => allEventListeners.delete(listener)
    },
  }
}
