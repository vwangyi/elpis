# Promise.all() 


```js

const prom = Promise.all()  // 也可以不是数组 但必须是iterator接口
# 等待所有promise实例 完成
# 所有的promise实例成功 返回的就是 成功的promise 且结果值是所有promise结果值组成的数组
# 只要有一个promise实例失败  返回的是 新的 失败状态的promise 且结果值为 第一个失败的promise的结果值


// 也可以不是数组 但必须是iterator接口
const prom = Promise.race()   返回第一个完成的promise实例的成功状态和结果值
Promise.race([Promise实例1, Promise实例2, Promise实例3])
# 等待第一个完成的promise
# 返回第一个完成的promise实例

 


```

```js

let { promise, resolve, reject } = Promise.withResolvers();
await promise()
等价于下面代码 
let resolve, reject;
const promise = new Promise((res, rej) => {
  resolve = res;
  reject = rej;
});

await promise()
```
