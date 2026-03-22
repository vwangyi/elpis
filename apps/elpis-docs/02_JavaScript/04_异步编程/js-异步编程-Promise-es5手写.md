# 手写Promise （构造函数版）

```js
// 声明Promise构造函数
function Promise(executor) {
  // 实例对象添加属性
  this.PromiseState = "pending";
  this.PromiseResult = null;
  // 声明属性用于保存回调
  this.callbacks = [];
  // 保存this
  const self = this; // self _this that

  //resolve函数：修改状态为成功和结果值属性
  function resolve(data) {
    // 不是pending状态 就不能执行下面代码
    if (self.PromiseState !== "pending") return;
    // 修改对象状态PromiseState
    self.PromiseState = "fulfilled"; //resolved
    // 修改对象结果值
    self.PromiseResult = data;
    setTimeout(() => {
      //调用成功的回调 ：这里怎么调用then里面的函数？保存在Promise实例对象上
      self.callbacks.forEach((item) => {
        item.onResolved(data);
      });
    });
  }
  //reject函数
  function reject(data) {
    if (self.PromiseState !== "pending") return;
    // 修改对象状态PromiseState
    self.PromiseState = "rejected";
    // 修改对象结果值PromiseResult
    self.PromiseResult = data;

    //调用失败的回调
    setTimeout(() => {
      self.callbacks.forEach((item) => {
        item.onRejected(data);
      });
    });
  }

  try {
    // 同步调用 执行器函数
    executor(resolve, reject);
  } catch (error) {
    reject(error);
  }
}

// then方法 成功的方法
Promise.prototype.then = function (onResolved, onRejected) {
  let self = this;

  // 如果传入的两个参数 不是函数就赋值一个新函数  失败函数把收到的值抛出去 throw reason  成功函数把收到的值返回
  if (typeof onRejected !== "function") {
    onRejected = (reason) => {
      throw reason;
    };
  }
  if (typeof onResolved !== "function") {
    onResolved = (value) => value;
  }

  // 这是then()方法的返回结果新的promise对象   promise对象包含状态和结果值两个属性

  // then方法 返回一个新的promise实例对象
  return new Promise((resolve, reject) => {
    // 封装函数
    function callback(type) {
      try {
        //拿到then指定的第一个函数返回结果，根据结果对象类型修改状态和结果值
        let result = type(self.PromiseResult);
        // 如果是promise实例 就通过then方法 来修改状态和结果值
        if (result instanceof Promise) {
          // 如果是Promise对象 通过调用then方法 修改状态和修改结果值
          result.then(
            (v) => {
              resolve(v);
            },
            (r) => {
              reject(r);
            },
          );
        } else {
          // 如果不是promise对象 就直接调resolve函数 把状态设置为成功、结果值设置为第一函数的返回值
          resolve(result);
        }
      } catch (error) {
        // 如果是throw抛出错误 直接调用reject() 修改状态为失败和结果值
        reject(error);
      }
    }

    if (this.PromiseState === "fulfilled") {
      setTimeout(() => {
        callback(onResolved);
      });
    }

    if (this.PromiseState === "rejected") {
      setTimeout(() => {
        callback(onRejected);
      });
    }

    //为pending状态时候 保存指定的回调
    if (this.PromiseState === "pending") {
      // 把then的回调函数保存在callback
      this.callbacks.push({
        onResolved() {
          callback(onResolved);
        },
        onRejected() {
          callback(onRejected);
        },
      });
    }
  });
};

// catch 失败的方法
Promise.prototype.catch = function (onRejected) {
  return this.then(undefined, onRejected);
};

// 添加resolve()方法
Promise.resolve = function (value) {
  return new Promise((resolve, reject) => {
    if (value instanceof Promise) {
      value.then(
        (v) => {
          resolve(v);
        },
        (r) => {
          reject(r);
        },
      );
    } else {
      resolve(value);
    }
  });
};

// 添加Promise.reject 方法
Promise.reject = function (reason) {
  // 不管传什么值 都是返回失败状态的promise 且结果值为传入的值
  // 哪怕传一个成功的promise 返回的也是 失败状态的promise
  // 且结果值为这个传入的成功promise的结果值

  return new Promise((resolve, reject) => {
    reject(reason);
  });
};
//添加Promise.all方法
Promise.all = function (Promises) {
  return new Promise((resolve, reject) => {
    let count = 0;
    let arr = [];
    for (let i = 0; i < Promises.length; i++) {
      Promises[i].then(
        (v) => {
          // 记录成功次数
          count++;
          // 把当前promise对象成功的结果存到数组项里面
          arr[i] = v;
          if (count === Promises.length) {
            resolve(arr);
          }
        },
        (r) => {
          reject(r);
        },
      );
    }
  });
};
//添加Promise.race方法
Promise.race = function (promises) {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < promises.length; i++) {
      promises[i].then(
        (v) => {
          // 修改返回对象状态为成功
          resolve(v);
        },
        (r) => {
          // 修改返回对象状态为失败
          reject(r);
        },
      );
    }
  });
};
```
