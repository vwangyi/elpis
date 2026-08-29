import type { ResolvedTheme, Theme } from '@supply-chain/design-tokens/theme'

/** 参与平台通信的应用名称，用于标记业务消息的发送方和目标方。 */
export type MicroAppName = 'portalShell' | 'fulfillmentApp' | 'settlementApp'

/** 多个应用需要随时读取的“平台当前值”。 */
export interface PlatformState {
  /** 用户选择的主题：浅色、深色或跟随系统。 */
  theme: Theme
  /** 页面当前真正显示的主题，跟随系统最终也会解析成浅色或深色。 */
  resolvedTheme: ResolvedTheme
  /** 主应用导航区域展示的两个子应用待办数量。 */
  badges: {
    /** 履约中心待处理数量。 */
    fulfillment: number
    /** 结算中心待处理数量。 */
    settlement: number
  }
}

/**
 * 业务消息名称与消息数据的对应表。
 *
 * 名称统一采用“业务域.发生的动作”：前半部分说明谁的业务，后半部分说明发生了什么。
 * TypeScript 会根据消息名称自动检查 payload，避免发送方和接收方对数据结构理解不一致。
 */
export interface BusinessEventPayloadMap {
  /** 履约中心完成订单履约，通知平台和结算中心可以进入后续处理。 */
  'fulfillment.completed': {
    /** 已完成的履约任务 ID。 */
    fulfillmentId: string
    /** 对应订单号，用于通知内容和业务定位。 */
    orderNo: string
  }

  /** 结算中心创建履约核实任务，通知履约中心刷新待核实任务。 */
  'settlement.verification-created': {
    /** 新创建的核实任务 ID。 */
    verificationId: string
    /** 需要核实的履约任务 ID。 */
    fulfillmentId: string
    /** 发起本次核实的结算批次 ID。 */
    settlementBatchId: string
    /** 结算批次编号，用于通知展示。 */
    batchNo: string
    /** 对应订单号，用于通知展示和业务定位。 */
    orderNo: string
  }

  /** 履约中心完成核实任务，通知结算中心刷新对应结算批次。 */
  'fulfillment.verification-resolved': {
    /** 已完成的核实任务 ID。 */
    verificationId: string
    /** 需要重新加载的结算批次 ID。 */
    settlementBatchId: string
    /** 结算批次编号，用于通知展示。 */
    batchNo: string
    /** 对应订单号，用于通知展示和业务定位。 */
    orderNo: string
  }
}

/** 业务消息名称的联合类型，只能取 BusinessEventPayloadMap 中已经登记的键。 */
export type BusinessEventType = keyof BusinessEventPayloadMap

/** 所有业务消息都具有的统一外层结构。 */
export interface BusinessEventEnvelope<
  TType extends BusinessEventType,
  TPayload = BusinessEventPayloadMap[TType],
> {
  /** 消息唯一 ID，可用于日志排查和去重。 */
  id: string
  /** 消息名称，同时决定 payload 的类型。 */
  type: TType
  /** 消息契约版本，便于以后兼容升级。 */
  version: 1
  /** 发送消息的应用。 */
  source: MicroAppName
  /** 可选的目标应用元数据；当前通信器仍按 type 广播，由订阅者决定是否处理。 */
  target?: MicroAppName
  /** 消息发生时间，使用 ISO 时间字符串。 */
  occurredAt: string
  /** 可选的业务关联 ID，用于串联同一条业务链路中的多条消息。 */
  correlationId?: string
  /** 当前消息携带的数据，其结构由 type 决定。 */
  payload: TPayload
}

/** 根据消息名称生成准确的消息类型联合，订阅时可以自动推导 payload。 */
export type BusinessEvent<TType extends BusinessEventType = BusinessEventType> = {
  [K in TType]: BusinessEventEnvelope<K>
}[TType]

/** 创建消息时可以省略由通信包自动生成的 ID、时间和版本。 */
export type BusinessEventInput<TType extends BusinessEventType> = Omit<
  BusinessEventEnvelope<TType>,
  'id' | 'occurredAt' | 'version'
> & {
  id?: string
  occurredAt?: string
}

export type StateListener = (
  /** 修改后的当前状态。 */
  state: Readonly<PlatformState>,
  /** 本次修改之前的状态，便于比较哪些字段发生了变化。 */
  previousState: Readonly<PlatformState>,
) => void

/** 三个应用共同依赖的通信接口，不包含 Vue 或 React 的任何类型。 */
export interface MicroBridge {
  /** 读取平台当前状态。 */
  getState(): Readonly<PlatformState>
  /** 修改平台状态中的部分字段。 */
  setState(patch: Partial<PlatformState>): void
  /** 订阅平台状态；返回值用于取消订阅。 */
  subscribeState(listener: StateListener): () => void
  /** 发布一条一次性业务消息。 */
  publish(event: BusinessEvent): void
  /** 按消息名称订阅；返回值用于取消订阅。 */
  subscribe<TType extends BusinessEventType>(
    type: TType,
    listener: (event: BusinessEvent<TType>) => void,
  ): () => void
  /** 订阅所有业务消息，主应用用它统一生成平台通知和刷新角标。 */
  subscribeAll(listener: (event: BusinessEvent) => void): () => void
}
