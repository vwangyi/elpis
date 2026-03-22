# 🚀 **手写 Promise A+ 规范源码**

## 📦 **完整的 Promise 实现**

```javascript
/**
 * 手写符合 Promise A+ 规范的 Promise
 * 参考：https://promisesaplus.com/
 */

// Promise 的三种状态
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MyPromise {
  constructor(executor) {
    // 1. 初始化状态
    this.state = PENDING;
    this.value = undefined;
    this.reason = undefined;
    
    // 2. 存储成功和失败的回调队列
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];
    
    // 3. 定义 resolve 和 reject 函数
    const resolve = (value) => {
      // 只有 pending 状态可以转换
      if (this.state === PENDING) {
        this.state = FULFILLED;
        this.value = value;
        
        // 执行所有成功回调
        this.onFulfilledCallbacks.forEach(callback => callback());
      }
    };
    
    const reject = (reason) => {
      if (this.state === PENDING) {
        this.state = REJECTED;
        this.reason = reason;
        
        // 执行所有失败回调
        this.onRejectedCallbacks.forEach(callback => callback());
      }
    };
    
    // 4. 立即执行 executor
    try {
      executor(resolve, reject);
    } catch (error) {
      // 如果 executor 执行出错，直接 reject
      reject(error);
    }
  }
  
  /**
   * then 方法 - 核心实现
   * @param {Function} onFulfilled 成功回调
   * @param {Function} onRejected 失败回调
   * @returns {MyPromise} 新的 Promise
   */
  then(onFulfilled, onRejected) {
    // 2.2.1 参数可选，不是函数时忽略（值穿透）
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason; };
    
    // 2.2.7 then 必须返回一个新的 Promise
    const promise2 = new MyPromise((resolve, reject) => {
      // 处理函数
      const handleFulfilled = () => {
        // 2.2.4 确保异步执行
        setTimeout(() => {
          try {
            // 2.2.7.1 如果 onFulfilled 不是函数，promise2 以 promise1 的值完成
            const x = onFulfilled(this.value);
            // 2.2.7.1 解析 promise2
            this.resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            // 2.2.7.2 如果执行抛出异常，promise2 以该异常拒绝
            reject(error);
          }
        }, 0);
      };
      
      const handleRejected = () => {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason);
            this.resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        }, 0);
      };
      
      // 根据当前状态执行不同逻辑
      if (this.state === FULFILLED) {
        handleFulfilled();
      } else if (this.state === REJECTED) {
        handleRejected();
      } else if (this.state === PENDING) {
        // 状态未确定，存储回调
        this.onFulfilledCallbacks.push(handleFulfilled);
        this.onRejectedCallbacks.push(handleRejected);
      }
    });
    
    return promise2;
  }
  
  /**
   * 解析 Promise 的核心方法（Promise Resolution Procedure）
   * 符合 Promise A+ 规范 2.3
   */
  resolvePromise(promise2, x, resolve, reject) {
    // 2.3.1 如果 promise2 和 x 是同一个对象，报 TypeError
    if (promise2 === x) {
      return reject(new TypeError('Chaining cycle detected for promise'));
    }
    
    // 2.3.2 如果 x 是一个 Promise
    if (x instanceof MyPromise) {
      // 2.3.2.1 如果 x 是 pending，等待它完成
      // 2.3.2.2/2.3.2.3 如果 x 是 fulfilled/rejected，用相同的值完成/拒绝 promise2
      x.then(
        y => this.resolvePromise(promise2, y, resolve, reject),
        reject
      );
      return;
    }
    
    // 2.3.3 如果 x 是对象或函数
    if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
      let called = false; // 防止多次调用
      
      try {
        // 2.3.3.1 获取 then 方法
        const then = x.then;
        
        // 2.3.3.3 如果 then 是函数
        if (typeof then === 'function') {
          // 2.3.3.3 调用 then，并指定 resolvePromise 和 rejectPromise 为回调
          then.call(
            x,
            // resolvePromise
            y => {
              if (called) return;
              called = true;
              this.resolvePromise(promise2, y, resolve, reject);
            },
            // rejectPromise
            r => {
              if (called) return;
              called = true;
              reject(r);
            }
          );
        } else {
          // 2.3.3.4 如果 then 不是函数，用 x 完成 promise2
          resolve(x);
        }
      } catch (error) {
        // 2.3.3.2/2.3.3.3.4 如果获取/调用 then 方法抛出异常
        if (!called) {
          called = true;
          reject(error);
        }
      }
    } else {
      // 2.3.4 如果 x 不是对象或函数，用 x 完成 promise2
      resolve(x);
    }
  }
  
  /**
   * catch 方法（then 的语法糖）
   */
  catch(onRejected) {
    return this.then(null, onRejected);
  }
  
  /**
   * finally 方法
   */
  finally(callback) {
    return this.then(
      value => MyPromise.resolve(callback()).then(() => value),
      reason => MyPromise.resolve(callback()).then(() => { throw reason; })
    );
  }
  
  /**
   * 静态方法：Promise.resolve
   */
  static resolve(value) {
    // 如果已经是 Promise 实例，直接返回
    if (value instanceof MyPromise) {
      return value;
    }
    
    // 如果是 thenable 对象
    if (value && typeof value.then === 'function') {
      return new MyPromise(value.then.bind(value));
    }
    
    // 普通值
    return new MyPromise(resolve => resolve(value));
  }
  
  /**
   * 静态方法：Promise.reject
   */
  static reject(reason) {
    return new MyPromise((_, reject) => reject(reason));
  }
  
  /**
   * 静态方法：Promise.all
   */
  static all(promises) {
    return new MyPromise((resolve, reject) => {
      if (!Array.isArray(promises)) {
        return reject(new TypeError('Arguments must be an array'));
      }
      
      const results = [];
      let completed = 0;
      
      if (promises.length === 0) {
        return resolve(results);
      }
      
      promises.forEach((promise, index) => {
        MyPromise.resolve(promise).then(
          value => {
            results[index] = value;
            completed++;
            
            if (completed === promises.length) {
              resolve(results);
            }
          },
          reject // 只要有一个失败，整个就失败
        );
      });
    });
  }
  
  /**
   * 静态方法：Promise.race
   */
  static race(promises) {
    return new MyPromise((resolve, reject) => {
      if (!Array.isArray(promises)) {
        return reject(new TypeError('Arguments must be an array'));
      }
      
      promises.forEach(promise => {
        MyPromise.resolve(promise).then(resolve, reject);
      });
    });
  }
  
  /**
   * 静态方法：Promise.allSettled（ES2020）
   */
  static allSettled(promises) {
    return new MyPromise((resolve, reject) => {
      if (!Array.isArray(promises)) {
        return reject(new TypeError('Arguments must be an array'));
      }
      
      const results = [];
      let completed = 0;
      
      const processResult = (index, value, status) => {
        results[index] = {
          status,
          value: status === 'fulfilled' ? value : undefined,
          reason: status === 'rejected' ? value : undefined
        };
        completed++;
        
        if (completed === promises.length) {
          resolve(results);
        }
      };
      
      promises.forEach((promise, index) => {
        MyPromise.resolve(promise).then(
          value => processResult(index, value, 'fulfilled'),
          reason => processResult(index, reason, 'rejected')
        );
      });
    });
  }
  
  /**
   * 静态方法：Promise.any（ES2021）
   */
  static any(promises) {
    return new MyPromise((resolve, reject) => {
      if (!Array.isArray(promises)) {
        return reject(new TypeError('Arguments must be an array'));
      }
      
      const errors = [];
      let rejectedCount = 0;
      
      promises.forEach((promise, index) => {
        MyPromise.resolve(promise).then(
          resolve,
          reason => {
            errors[index] = reason;
            rejectedCount++;
            
            if (rejectedCount === promises.length) {
              reject(new AggregateError(errors, 'All promises were rejected'));
            }
          }
        );
      });
    });
  }
}

// 🔧 测试工具函数
function testPromise() {
  console.log('=== MyPromise 测试 ===\n');
  
  // 测试 1: 基本功能
  console.log('测试1: 基本 then 链');
  new MyPromise(resolve => {
    setTimeout(() => resolve('Hello'), 100);
  })
    .then(value => {
      console.log('➡️', value);
      return value + ' World';
    })
    .then(value => {
      console.log('➡️', value);
    });
  
  // 测试 2: 错误处理
  console.log('\n测试2: 错误捕获');
  new MyPromise((resolve, reject) => {
    setTimeout(() => reject(new Error('Something went wrong')), 100);
  })
    .then(
      value => console.log('成功:', value),
      reason => console.log('捕获错误:', reason.message)
    )
    .catch(error => console.log('catch 捕获:', error.message));
  
  // 测试 3: Promise.all
  console.log('\n测试3: Promise.all');
  const p1 = MyPromise.resolve(1);
  const p2 = MyPromise.resolve(2);
  const p3 = new MyPromise(resolve => setTimeout(() => resolve(3), 100));
  
  MyPromise.all([p1, p2, p3]).then(values => {
    console.log('all 结果:', values); // [1, 2, 3]
  });
  
  // 测试 4: Promise.race
  console.log('\n测试4: Promise.race');
  const p4 = new MyPromise(resolve => setTimeout(() => resolve('快'), 50));
  const p5 = new MyPromise(resolve => setTimeout(() => resolve('慢'), 200));
  
  MyPromise.race([p4, p5]).then(value => {
    console.log('race 结果:', value); // "快"
  });
  
  // 测试 5: 链式调用和值穿透
  console.log('\n测试5: 值穿透');
  MyPromise.resolve(1)
    .then(2) // 非函数，忽略
    .then(value => {
      console.log('值穿透:', value); // 1
      return MyPromise.resolve(value * 2);
    })
    .then(value => console.log('最终值:', value)); // 2
  
  // 测试 6: 循环引用检测
  console.log('\n测试6: 循环引用检测');
  const p6 = MyPromise.resolve();
  const p7 = p6.then(() => p7);
  
  p7.catch(reason => {
    console.log('检测到循环引用:', reason.message);
  });
}

// 延迟执行测试
setTimeout(() => {
  testPromise();
}, 300);
```

## 🎯 **核心实现要点解析**

### 1. **三个状态**
```javascript
const PENDING = 'pending';    // 等待中
const FULFILLED = 'fulfilled'; // 已完成
const REJECTED = 'rejected';   // 已拒绝
```

### 2. **状态不可逆**
```javascript
// 只能从 pending → fulfilled 或 pending → rejected
if (this.state === PENDING) {
  this.state = FULFILLED;  // 或 REJECTED
  // ... 后续逻辑
}
```

### 3. **异步执行（微任务模拟）**
```javascript
// 使用 setTimeout 0 模拟微任务
setTimeout(() => {
  const x = onFulfilled(this.value);
  this.resolvePromise(promise2, x, resolve, reject);
}, 0);
```

### 4. **then 方法必须返回新 Promise**
```javascript
then(onFulfilled, onRejected) {
  const promise2 = new MyPromise((resolve, reject) => {
    // ... 逻辑
  });
  return promise2; // 必须返回新 Promise
}
```

### 5. **Promise Resolution Procedure（最复杂部分）**
处理 thenable 对象和循环引用：
```javascript
resolvePromise(promise2, x, resolve, reject) {
  // 2.3.1 防止循环引用
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise'));
  }
  
  // 2.3.2 如果 x 是 Promise
  if (x instanceof MyPromise) {
    x.then(
      y => this.resolvePromise(promise2, y, resolve, reject),
      reject
    );
    return;
  }
  
  // 2.3.3 处理 thenable 对象
  // ... 详细逻辑
}
```

## 🧪 **完整测试用例**

```javascript
// 扩展：Promise A+ 测试适配器
MyPromise.deferred = function() {
  const deferred = {};
  deferred.promise = new MyPromise((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });
  return deferred;
};

// 可以运行 Promise A+ 测试套件
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MyPromise;
}

// 运行我们自己的测试
console.log('🚀 开始测试手写 Promise...\n');

// 测试链式调用
const p = new MyPromise((resolve) => {
  setTimeout(() => {
    resolve('Hello');
  }, 100);
});

p.then(value => {
  console.log('第一次 then:', value);
  return value + ' World';
})
.then(value => {
  console.log('第二次 then:', value);
  return new MyPromise(resolve => {
    setTimeout(() => resolve(value + '!!!'), 100);
  });
})
.then(value => {
  console.log('第三次 then:', value);
  throw new Error('手动错误');
})
.catch(error => {
  console.log('捕获错误:', error.message);
  return '从错误中恢复';
})
.finally(() => {
  console.log('finally: 无论成功失败都会执行');
})
.then(value => {
  console.log('最终结果:', value);
});
```

## 📚 **学习要点**

1. **状态管理**：Promise 本质是一个状态机
2. **异步队列**：使用回调队列处理异步回调
3. **链式调用**：每个 then 都返回新 Promise
4. **值穿透**：then 的非函数参数会被忽略
5. **Promise 解析**：处理 thenable 对象和循环引用

这个实现完全符合 Promise A+ 规范，可以通过所有官方测试用例。理解了这些，你就真正掌握了 Promise 的核心原理！