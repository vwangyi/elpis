import assert from 'node:assert/strict'
import test from 'node:test'

import { isLocationInBase, toBrowserLocation, toInternalLocation } from '../src/core/path.ts'
import { createMicroRouteStore } from '../src/core/route-store.ts'
import {
  MICRO_ROUTER_STATE_KEY,
  mergeScopedState,
  readScopedState,
} from '../src/core/scoped-state.ts'

class FakeHistory {
  length = 1
  scrollRestoration: ScrollRestoration = 'auto'
  state: unknown = { current: '/settlement', position: 3 }

  pushState(state: unknown) {
    this.state = state
    this.length += 1
  }

  replaceState(state: unknown) {
    this.state = state
  }

  back() {}
  forward() {}
  go() {}
}

class FakeStorage implements Storage {
  private readonly values = new Map<string, string>()

  get length() {
    return this.values.size
  }

  clear() {
    this.values.clear()
  }

  getItem(key: string) {
    return this.values.get(key) ?? null
  }

  key(index: number) {
    return [...this.values.keys()][index] ?? null
  }

  removeItem(key: string) {
    this.values.delete(key)
  }

  setItem(key: string, value: string) {
    this.values.set(key, value)
  }
}

test('native 路径只在平台边界添加和移除应用前缀', () => {
  assert.equal(
    toInternalLocation('/fulfillment/orders?id=1#detail', '/fulfillment'),
    '/orders?id=1#detail',
  )
  assert.equal(toInternalLocation('/fulfillment', '/fulfillment'), '/')
  assert.equal(
    toBrowserLocation('/orders?id=1#detail', '/fulfillment'),
    '/fulfillment/orders?id=1#detail',
  )
  assert.equal(toBrowserLocation('/', '/fulfillment/'), '/fulfillment/')
  assert.equal(isLocationInBase('/fulfillment/orders?status=pending', '/fulfillment'), true)
  assert.equal(isLocationInBase('/fulfillment-center', '/fulfillment'), false)
})

test('不同应用的 state 分槽保存，同时保留主应用 state', () => {
  const history = new FakeHistory() as unknown as History

  history.replaceState(mergeScopedState(history, 'fulfillmentApp', { position: 1 }), '')
  history.replaceState(mergeScopedState(history, 'settlementApp', { idx: 2 }), '')

  assert.deepEqual(readScopedState(history, 'fulfillmentApp'), { position: 1 })
  assert.deepEqual(readScopedState(history, 'settlementApp'), { idx: 2 })
  assert.equal((history.state as Record<string, unknown>).current, '/settlement')
  assert.deepEqual(
    (history.state as Record<string, Record<string, unknown>>)[MICRO_ROUTER_STATE_KEY],
    {
      fulfillmentApp: { position: 1 },
      settlementApp: { idx: 2 },
    },
  )
})

test('最后路由只保存属于当前应用 base 的安全地址', () => {
  const storage = new FakeStorage()
  const store = createMicroRouteStore({
    apps: [
      { appName: 'fulfillmentApp', base: '/fulfillment' },
      { appName: 'settlementApp', base: '/settlement' },
    ],
    storage,
  })

  store.remember('fulfillmentApp', '/fulfillment/orders?page=2')
  store.remember('settlementApp', '/fulfillment/orders')

  assert.equal(store.resolve('fulfillmentApp', '/fulfillment'), '/fulfillment/orders?page=2')
  assert.equal(store.resolve('settlementApp', '/settlement'), '/settlement')

  store.clear('fulfillmentApp')
  assert.equal(store.resolve('fulfillmentApp', '/fulfillment'), '/fulfillment')
})
