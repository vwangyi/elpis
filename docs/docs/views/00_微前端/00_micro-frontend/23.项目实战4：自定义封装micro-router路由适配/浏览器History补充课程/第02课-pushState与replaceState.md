# 第 02 课：pushState 与 replaceState

## `pushState`

```js
history.pushState({ page: "orders" }, "", "?page=orders");
```

它完成三件事：

1. 在当前条目后新增历史条目；
2. 把 `{ page: 'orders' }` 保存到新条目；
3. 把地址栏改成新的 URL。

它不会：

- 自动请求新页面；
- 自动渲染组件；
- 自动触发 `popstate`。

页面显示什么，需要当前页面的 JavaScript 自己决定。

## `replaceState`

```js
history.replaceState(
  { page: "orders", filter: "todo" },
  "",
  "?page=orders&filter=todo",
);
```

它修改当前历史条目，不新增记录。适合：

- 补充当前条目的初始化状态；
- 修正 URL；
- 更新筛选条件但不希望用户多按一次回退；
- 页面保存滚动位置或其他辅助信息。

## 对比

| 问题                    | `pushState` | `replaceState` |
| ----------------------- | ----------- | -------------- |
| 是否新增历史条目        | 是          | 否             |
| 是否改变 URL            | 可以        | 可以           |
| 是否保存 state          | 可以        | 可以           |
| 是否请求服务器          | 否          | 否             |
| 是否自动触发 `popstate` | 否          | 否             |

## URL 限制

新 URL 必须与当前页面同源，不能把当前条目直接改成另一个网站：

```js
// 当前页面位于 localhost 时，这样做会抛出安全错误
history.pushState({}, "", "https://example.com");
```

## 动手实验

打开[案例 01：History 可视化实验](./案例/01-History可视化实验/index.html)。

先记录 `history.length`，然后分别执行：

```text
push 页面 A
replace 当前页
push 页面 B
```

重点观察：

```text
replace 后 history.length 是否增加？
push 和 replace 后事件日志里有没有 popstate？
```

## 一句话记忆

```text
push：新增一张历史卡片。
replace：修改当前历史卡片。
```
