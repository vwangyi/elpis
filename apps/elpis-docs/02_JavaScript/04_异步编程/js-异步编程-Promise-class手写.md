# 手写Promise （Class版）

```js
class Promise {
  constructor(executor) {
    // 实例对象添加属性
    this.PromiseState = "pending"; // pending | fulfilled | rejected; 
    this.PromiseResult = null;
    // 声明属性用于保存回调
    this.callbacks = [];
    const _this = this;

    //resolve函数：修改状态为成功和结果值属性
    function resolve(data) {


      // 如果状态已经修改则不调用 resolve函数
      if (_this.PromiseState !== "pending") {
        return;
      }
      // 修改对象的状态为 成功
      _this.PromiseState = "fulfilled";
      // 修改对象的值为 data
      _this.PromiseResult = data;
      setTimeout(() => {
        // 调用成功的回调 ：这里怎么调用then里面的函数？保存在Promise实例对象上
        _this.callbacks.forEach((item) => {
          item.onResolved(data);
        });
      });
    }
    //reject函数
    function reject(data) {
      if (_this.PromiseState !== "pending") return;
      // 修改对象的状态为 失败
      _this.PromiseState = "rejected";
      // 修改对象的值为 data
      _this.PromiseResult = data;
      //调用失败的回调
      setTimeout(() => {
        _this.callbacks.forEach((item) => {
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

  then(onResolved, onRejected) {
    let _this = this;
    // 判断回调函数参数  异常穿透
    if (typeof onRejected !== "function") {
      // 给回调添加默认值
      onRejected = (reason) => {
        throw reason;
      };
    }
    // 判断回调函数参数  异常穿透
    if (typeof onResolved !== "function") {
      // 给回调添加默认值
      onResolved = (value) => value;
    }
    // 这是then()方法的返回结果新的promise对象  promise对象包含状态和结果值两个属性
    return new Promise((resolve, reject) => {
      // 封装函数
      function callback(type) {
        try {
          //拿到then指定的第一个函数返回结果，根据结果对象类型修改状态和结果值
          let result = type(_this.PromiseResult);

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
  }
  catch(onRejected) {
    return this.then(undefined, onRejected);
  }
  static resolve(value) {
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
  }
  static reject(reason) {
    return new Promise((resolve, reject) => {
      reject(reason);
    });
  }
  static all(promises) {
    return new Promise((resolve, reject) => {
      let count = 0;
      let arr = [];
      for (let i = 0; i < promises.length; i++) {
        promises[i].then(
          (v) => {
            // 记录成功次数
            count++;
            // 把当前promise对象成功的结果存到数组项里面
            arr[i] = v;
            if (count === promises.length) {
              resolve(arr);
            }
          },
          (r) => reject(r),
        );
      }
    });
  }
  static race(promises) {
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
  }
}
```
