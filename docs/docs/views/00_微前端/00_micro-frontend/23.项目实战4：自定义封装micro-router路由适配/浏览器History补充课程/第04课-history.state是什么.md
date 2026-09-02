# 第 04 课：history.state 是什么

## 基本用法

每个历史条目都可以携带一份自己的 state：

```js
history.pushState(
  {
    page: "order-detail",
    orderId: "1001",
  },
  "",
  "?page=order-detail&id=1001",
);
```

当前条目的 state 可以这样读取：

```js
console.log(history.state);
```

## 每张历史卡片都有自己的 state

```text
页面 A                    页面 B
state = { page: 'A' }     state = { page: 'B' }
```

从 B 回退到 A 后：

```js
window.addEventListener("popstate", (event) => {
  console.log(event.state);
  // { page: 'A' }
});
```

`event.state` 和此时的 `history.state` 都属于回退后到达的页面 A。

## state 和 URL 的职责不同

```text
URL：刷新、复制链接和服务端都可能看到
state：当前标签页中某个历史条目的附加数据
```

不应只把关键页面信息放在 state 中：

```js
// 不推荐：复制 URL 后可能无法知道订单编号
history.pushState({ orderId: "1001" }, "", "?page=order-detail");

// URL 本身就能说明打开哪个订单
history.pushState({ from: "list" }, "", "?page=order-detail&id=1001");
```

## `replaceState` 会替换整个 state

```js
history.replaceState({ page: "orders", filter: "todo" }, "");
history.replaceState({ page: "orders" }, "");

console.log(history.state);
// 只剩 { page: 'orders' }
```

第二次写入不会自动与第一次合并，原来的 `filter` 已经消失。

如果确实需要保留旧字段，要主动合并：

```js
history.replaceState(
  {
    ...history.state,
    filter: "done",
  },
  "",
);
```

## state 需要能够被浏览器复制

普通对象、数组、字符串和数字都可以保存。函数、DOM 元素等不能被正常复制的数据可能导致 `DataCloneError`：

```js
history.pushState(
  {
    // 不要把函数放进 state
    onClick() {},
  },
  "",
  "?page=orders",
);
```

state 适合保存体积较小的页面辅助信息，不应该把它当成大型数据仓库。

## 动手实验

打开[History 可视化实验](./案例/01-History可视化实验/index.html)：

1. push 页面 A，观察页面 A 的 state；
2. push 页面 B，观察页面 B 的 state；
3. 回退到页面 A，确认 state 也恢复成页面 A 的数据；
4. replace 当前页，观察 state 被替换，但历史数量不增加。

## 一句话记忆

```text
history.state 是写在当前历史卡片上的附加数据；
回退或前进到另一张卡片时，state 也会跟着切换。
```
