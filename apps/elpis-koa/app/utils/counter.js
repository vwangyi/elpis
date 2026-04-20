/**
 * 面向对象编程
 * 定义一个类来表示计数器 使用计数器类 
    const counter = new Counter();
    counter.increment();
    counter.increment();
    counter.decrement();
    counter.getValue();  // 输出 1
 */
export class Counter {
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
  reset() {
    this.count = 0;
  }
}

/**
 * 面向过程编程
 *  
    increment();
    increment();
    decrement();
    console.log(getValue());  // 输出 1
 */
// 使用全局变量来存储计数器的值
let count = 0;

// 定义一系列函数来操作计数器的值
function increment1() {
  count++;
}

function decrement1() {
  count--;
}

function getValue1() {
  return count;
}

/**
 * 面向函数编程
 * 面向函数编程 全是 纯函数（纯函数就是没有副作用的函数）
 * @example
 * 注意：这里没有直接获取值的函数，因为我们可以直接查看当前的计数值
 * 使用函数来操作计数器的值，并通过变量来传递和存储结果
    let count1 = 0;
    count = increment(count);
    count = increment(count);
    count = decrement(count);
    console.log(count);  // 输出 1
 */
// 定义一系列纯函数来操作计数器的值，并使用参数和返回值来传递数据
function increment2(count) {
  return count + 1;
}

function decrement2(count) {
  return count - 1;
}
