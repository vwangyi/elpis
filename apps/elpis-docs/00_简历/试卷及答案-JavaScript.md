#

每个心智模型 都可能是 会说会写 说写都要会 有些只需要说 有些只需要写

## 写出创建数组的方式 至少5种 越多越好

## 创建 [1,2,3] 4种方式

```js
new Array(1，2，3)
[1, 2, 3]
new Array(3).fill(0).map((_,i) => i+1)
Array.of(1,2,3)
```

## 把假数组转真数组

```js
// Array.from() Array.fromAsync() 可以将 可迭代对象 或 类数组对象 转为 浅拷贝后的数组实例。

[...new Set([1, 2, 3, 4])];
Array.from({ length: 3 });
Array.from("hello");
// 类数组：只有长度和下标
```

## 写出数组的遍历方式 至少4种

## 数组映射

## 数组筛选

## 数组升序排列

## 写出5种创建数组的方式 以及 14种操作数组的方法（代码写出来）

## 14种操作数组的方法 (数组常用方法)（说出来 录音）

## 创建字符串的方式 和 操作方法

## 手写 new操作符 （考察js继承）

```js
/**
 
 new操作符 就是
 */

function createObject(Class, ...args) {
  const obj = Object.create(Class.prototype);
  const result = Class.apply(obj, args);
  return result instanceof Object ? result : obj;
}
```

## 瀑布流布局 （把方法论说出来）

```js


const list = [] // 内存的数据结构





1. 瀑布流是什么： 宽度一样 高度不一样， 每次都是往高度最小的一列追加元素。

调研业界有什么方案。

2 定义渲染的数据结构 ：是一个二维数组
// 渲染数据结构
const list = [
    [], [], [], [], []
]

// 拿到网络请求拿到的一个 一维数组
每次滚动， 都把数据 push到对应列 里面去


```
