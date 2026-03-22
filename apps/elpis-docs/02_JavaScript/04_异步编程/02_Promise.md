# Promise

## Promise是什么

- 是什么

```js
  ○ 是什么
    ■ Promise 是 es6 新增用来处理异步操作的对象，Promise 有 3 个状态，等待 、成功和失败，状态一经改变就不可逆。
  ○ 优缺点
    ■ promise的好处是 可以链式调用 解决es5的回调地狱问题
    ■ promise的缺点是 无法取消
  ○ 讲应用
    ■ 应用场景是可以封装网络请求 文件操作 等耗时长的异步任务
    ■ 使用Promise.all 进行并发请求
    - 并发请求可以使用 Promise.all()
    - Promise.race 
    - promise 如何取消

    // promise 最早是社区中使用 promiseA+规范  官方没有  民间库 比如 blueBird 比如 jquery页实现了 promise
    
    // 也就是说 promise是 民间已经用烂了的功能 后来被官方。放进 es规范中了 
 
``` 
## 创建Promise

```js 
// 传一个 同步函数  可以接收到 resolve, reject
const prom = new Promise((resolve, reject) => {

  resolve('ok') // 调用resolve()
  // 状态 由pending 变为 fulfilled 成功状态
  // 结果值 从 null 变为 resolve 传递的值

  reject('err') // 调用reject()
  // 状态 由pending 变为 rejected 失败状态
  // 结果值 从 null 变为 reject 传递的值

  throw '错误' // throw '错误'
  // 状态 由pending 变为 rejected 失败状态
  // 结果值 从 null 变为 reject 传递的值
})



// 成功的promise
const prom1 = new Promise((resolve, reject) => resolve(1));
const prom2 = Promise.resolve(1);
const prom3 = (async () => 1)(); // async函数 返回值 默认就是promise
const prom5 = Promise.all([]);

// 失败的promise
const prom4 = Promise.reject(2);
const prom5 = new Promise((resolve, reject) => reject(2));
const prom3 = (async () => {
  throw 2;
})();
const prom6 = new Promise((resolve, reject) => {
  throw 2;
});

``` 
## 并发 Promise.all Promise.allSettled
https://www.cnblogs.com/dirgo/p/19194161
```js
const prom = Promise.all()  // 也可以不是数组 但必须是iterator接口
# 等待所有promise实例 完成
# 所有的promise实例成功 返回的就是 成功的promise 且结果值是所有promise结果值组成的数组
# 只要有一个promise实例失败  返回的是 新的 失败状态的promise 且结果值为 第一个失败的promise的结果值



Promise.all() 是 只要有一个失败 那就是失败
Promise.allSettled 是不管成功或失败 都会执行完毕

```

## Promise.race()
```js

const prom = Promise.race()   返回第一个完成的promise实例的成功状态和结果值
Promise.race([Promise实例1, Promise实例2, Promise实例3])
# 等待第一个完成的promise
# 返回第一个完成的promise实例
```

## Promise.withResolvers()
```js

let { promise, resolve, reject } = Promise.withResolvers();
// 等价于  
let resolve, reject;
const promise = new Promise((res, rej) => {
  resolve = res;
  reject = rej;
});

await promise;


```

## prom.then()
```js 
// 传2个 异步回调 第一个回调当promise成功后执行  第二个回调当promise失败后执行
prom.then( () => {}, () => {}  ) 
then

.then() 返回一定是promise实例
3种情况
1 .then里面的函数本就返回一个promise实例 那就原样把这个promise返回
2 返回一个 非promise 比如 123  那么then方法返回的是 成功状态的promise 且结果值为123
3 throw 'err' 抛出一个错误  那么then方法 返回的是 失败状态的promise 且结果值为 err

.then的第一个回调 可以接收到 成功状态的结果值
.then的第二个回调 可以接收到 失败状态的结果值

```
## prom.catch()
```js 
prom.catch( () => {} )

# .catch的第一个回调  可以接收到 失败状态的结果值
   prom.catch(err => {
            console.log('catch', err)
            // return err  // 会走成功
            // throw err // 继续走失败 
            // return Promise.reject(err) // 继续走失败 
            
        })
// async函数 返回的一定是 promise对象  (和then方法的返回值一样) 返回值promise对象的状态和结果 由 async函数的返回值决定 (和then的返回规则一样)

// 在then方法函数的内部 同样是这三种情况
async function fn(){
  // 1. 如果返回值是一个非promise 那么async函数 最终返回的是 成功的promise 且结果值为 123
  return 123 

  // 2. 如果返回值本就是一个promise  那就原样返回 这个promise就是函数最终返回的promise
  return new Promise((resolve, reject)=>{
      resolve('ok'); //  async的promise对象的状态成功 结果值ok
      reject('error'); //  async的promise对象的状态失败 结果值error
  })
  // 3. 如果返回值 是抛出一个错误 那函数的返回值 就是一个失败的promise 且结果值就是抛出的错误 'no'
  throw 'no' 
}

await表达式
  await表达式 必须 写在async函数中  async函数可以没有await
> await 等价于 .then 
> await表达式 后面的所有东西都是 异步微  (在本函数作用域中)
> await右侧的表达式 一般是promise对象  也可以是其他值(但没啥意义 await 不是一个promise时 (await 可不写)) 

> 如果右侧为 成功的promise实例 则await表达式 返回的就是promise成功的值
> 如果右侧为 失败的promise实例 就会报错 则需要 try catch 捕获这个错误 或者 .catch(err => console.log(err))

  try {
    // 尝试运行的代码
  } catch(err) {
    // 捕获的错误
    console.log(err)
  }
  async function fn() {
    const a = await 123
    console.log(a)   //  123
  }
  console.log(fn())  // promise实例
```
## prom.finally()
```js 
// 传一个 异步回调 当promise 成功或失败 后执行  不管请求成功或失败 loading 都应该隐藏
prom.finally( () => {} )

```