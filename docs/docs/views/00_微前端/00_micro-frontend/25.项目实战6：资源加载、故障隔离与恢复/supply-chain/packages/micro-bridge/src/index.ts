// 包的公共入口：应用只能从这里使用工厂函数、主题连接器和通信契约。
export { createBusinessEvent, createMicroBridge } from './bridge.ts'

// 子应用独立运行时使用的备用通信桥。
export { createStandaloneBridge } from './standalone.ts'

// 将各应用的主题模块连接到同一个平台状态。
export { connectThemeToBridge } from './theme-sync.ts'

// 只导出类型，不把 Vue、React 等框架实现带入通信包。
export type {
  BusinessEvent,
  BusinessEventEnvelope,
  BusinessEventInput,
  BusinessEventPayloadMap,
  BusinessEventType,
  MicroAppName,
  MicroBridge,
  PlatformState,
  StateListener,
} from './contracts.ts'
