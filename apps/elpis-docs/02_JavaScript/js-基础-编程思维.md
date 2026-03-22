# 编程思维-面向对象

- 编程思维一个项目中可以有多种编程范式 取决于实际场景灵活运用

## 面向对象编程OOP

```js
// 定义一个类来表示计数器
class Counter {
    count = 0; 
    constructor() {
        this.count = 0;
    }
    increment() {
        this.count++;
    } 
    decrement() {
        this.count--;
    } 
    getValue() {
        return this.count;
    }
}

// 使用计数器类
const counter = new Counter();
counter.increment();
counter.increment();
counter.decrement();
console.log(counter.getValue());  // 输出 1

```



## 面向过程编程

```js
// 使用全局变量来存储计数器的值
let count = 0;

// 定义一系列函数来操作计数器的值
function increment() {
    count++;
}

function decrement() {
    count--;
}

function getValue() {
    return count;
}

// 使用全局函数来操作计数器的值
increment();
increment();
decrement();
console.log(getValue());  // 输出 1
```

## 面向函数编程
● 面向函数编程 全是 纯函数（纯函数就是没有副作用的函数）

```js
// 定义一系列纯函数来操作计数器的值，并使用参数和返回值来传递数据
function increment(count) {
    return count + 1;
}

function decrement(count) {
    return count - 1;
}

// 注意：这里没有直接获取值的函数，因为我们可以直接查看当前的计数值

// 使用函数来操作计数器的值，并通过变量来传递和存储结果
let count = 0;
count = increment(count);
count = increment(count);
count = decrement(count);
console.log(count);  // 输出 1
```