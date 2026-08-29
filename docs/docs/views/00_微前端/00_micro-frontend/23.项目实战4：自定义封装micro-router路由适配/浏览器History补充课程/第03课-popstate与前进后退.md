# 第 03 课：popstate 与前进后退

## `popstate` 是干嘛的

`popstate` 是浏览器发给 JavaScript 的一个通知：

> 当前显示的历史条目已经发生变化，请重新读取 URL 和 `history.state`，更新页面内容。

例如，当前历史栈是：

```text
[/home] → [/orders]
             ↑ 当前
```

用户点击浏览器后退后，浏览器先移动到 `/home`：

```text
[/home] ← [/orders]
   ↑ 当前
```

然后浏览器触发 `popstate`，告诉页面：

```text
当前历史条目已经从 /orders 变成 /home，
请根据新的 URL 和 state 更新页面。
```

JavaScript 可以这样接收通知：

```js
window.addEventListener("popstate", (event) => {
  console.log("当前 URL：", location.href);
  console.log("当前条目的 state：", event.state);

  // 根据新的 URL 和 state 更新页面
  render();
});
```

这里一定要分清：

```text
back/forward/go：负责移动历史条目
popstate：移动完成后负责通知 JavaScript
```

`popstate` 本身不会执行回退，也不会创建或替换历史条目。它只是一个“历史位置已经变化”的事件通知。

## 再看它和 push、replace 的关系

`pushState`、`replaceState` 和 `popstate` 的关系可以直接记成：

```text
pushState：主动新增历史条目，不触发 popstate
replaceState：主动替换当前条目，不触发 popstate
back/forward/go：在已有历史条目之间移动，触发 popstate
```

| 操作           | 对历史做了什么         | 是否触发 `popstate` |
| -------------- | ---------------------- | ------------------- |
| `pushState`    | 新增一个条目并移动过去 | 否                  |
| `replaceState` | 修改当前条目           | 否                  |
| `back()`       | 回到前一个已有条目     | 是                  |
| `forward()`    | 前进到后一个已有条目   | 是                  |
| `go(n)`        | 移动到指定的已有条目   | 是                  |

简单来说：

```text
push/replace 是当前代码主动“写历史”。
popstate 是浏览器“移动历史”之后通知代码。
```

这里常说的“pop”不是一个叫 `history.pop()` 的方法，而是指浏览器从当前条目移动到了另一个历史条目。JavaScript 收到的通知事件叫 `popstate`。

## 用一段流程看懂

假设当前在首页：

```text
[/home]
```

代码执行：

```js
history.pushState({ page: "orders" }, "", "?page=orders");
```

历史变成：

```text
[/home] → [/orders]
             ↑ 当前
```

这是代码自己执行的 push，代码已经知道发生了什么，所以浏览器不会再额外发送 `popstate`。页面如果需要变化，应该在 push 后主动更新：

```js
history.pushState(state, "", url);
render();
```

接着用户点击浏览器后退：

```text
[/home] ← [/orders]
   ↑ 当前
```

这次不是当前代码决定的目标页面，因此浏览器必须发送 `popstate`，通知页面重新读取 URL 和 state。

## 哪些操作会触发 `popstate`

```text
点击浏览器后退
点击浏览器前进
history.back()
history.forward()
history.go(-2)
```

## `event.state` 属于谁

它属于移动后到达的目标条目，不是刚刚离开的条目。

```text
A，state = { page: 'A' }
B，state = { page: 'B' }

从 B 回退到 A
event.state 是 { page: 'A' }
```

## 动手实验

打开[History 可视化实验](./案例/01-History可视化实验/index.html)：

1. push 页面 A；
2. push 页面 B；
3. 确认前两步没有 `popstate`；
4. 点击回退；
5. 对比 `event.state` 和当前 `history.state`。

## 一句话记忆

```text
push/replace 负责写历史，不触发 popstate；
back/forward/go 负责移动历史，移动后触发 popstate。
```
