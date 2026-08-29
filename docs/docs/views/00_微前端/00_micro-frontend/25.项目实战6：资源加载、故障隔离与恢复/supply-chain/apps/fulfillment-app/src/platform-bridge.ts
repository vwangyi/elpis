import {
  connectThemeToBridge,
  createStandaloneBridge,
  type MicroBridge,
} from '@supply-chain/micro-bridge'

let bridge: MicroBridge = createStandaloneBridge()
let disconnectTheme: (() => void) | null = null

export function activatePlatformBridge(nextBridge?: MicroBridge) {
  disconnectTheme?.()
  bridge = nextBridge ?? createStandaloneBridge()
  disconnectTheme = connectThemeToBridge(bridge)
}

export function deactivatePlatformBridge() {
  disconnectTheme?.()
  disconnectTheme = null
  bridge = createStandaloneBridge()
}

export function getPlatformBridge() {
  return bridge
}
