# 防抖节流

问：防抖节流
● 防抖是多次触发只执行最后一次
● 节流是多次触发在指定时间内只执行一次。
● 都是用于 优化高频触发场景，区别是 
● 防抖的使用场景是 输入框触发联想，节流的使用场景是 滚动条触发
● 



- 什么是防抖
- 什么是节流

## 防抖

防抖是：在指定时间内，多次触发都会重新计时，只执行最后一次。

```js
function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args) // 仿执行、仿this、仿传参
    }, delay)
  }
}
```

## 防抖应用场景

- 搜索框输入触发联想



## 节流

节流是 多次触发在指定时间内只执行一次。

```js
function throttle(fn, time) {
  let flag = null; // 节流阀 为真 表示关闭状态 为假表示开启状态
  return function (...args) { 
    // flag为假表示 开启节流阀
    if (!flag) {
      fn.apply(this, args); // 当开启节流阀 立即执行一次
      // 执行后 立即关闭节流阀，一段时间后才打开节流阀
      flag = setTimeout(() => flag = null, time); 
    }
  };
}
```



## 节流应用场景

- 滚动条频繁滚动触发



相同点：都是用于高频触发场景

不同点：具体场景不同
