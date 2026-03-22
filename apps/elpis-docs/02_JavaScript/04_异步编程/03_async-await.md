# async/await

## 协程
## 状态机


## 生成器函数
```js
function* test() {

}
```

## 迭代器对象
```js

```


## async函数底层实现
```js

```


async函数 底层实现
```js 
function* test() {
   const a = yield 1;
   return yield a;
}
/* 方式1 ===================================  */
// cosnt iter = test()
// const { value, done } = iter.next()
// console.log('value', value)
// value.then(res => {
//    console.log(res)
// })
// console.log('done', done)
/* 方式1 ===================================  */

/* 方式2.  npm i co -D   可以查看 co库 源码 ================ */
function co(iter) {
   return new Promise((resolve, reject) => {
      function next(data) {
         let { value, done } = iter.next(data) 
         // done如果为true 就是完成了
         if(done) {
            console.log('完成')
            resolve(value)
         }
         // done如果为false 继续递归
         else {
            Promise.resolve(value).then(res => next(res))
         } 
      }
      next();

   })
}
const prom = co(test())
prom.then(res => console.log(res, '333') ) 
/* 方式2.  npm i co -D   可以查看 co库 源码 ================ */

``` 
```js
// async/await 的底层实现原理
async function example() {
  const a = await Promise.resolve(1);
  const b = await Promise.resolve(1);
  return a + b;
}

// 等同于下面的 生成器函数 + 执行器函数

// 生成器函数
function example() {
  return spawn(function* () {
    const a = yield promise1;  // await → yield
    const b = yield promise2;
    return a + b;
  });
}

// 执行器函数
function spawn(generator) {
  return new Promise((resolve, reject) => {
    const gen = generator();
    
    function step(nextFn) {
      let next;
      try {
        next = nextFn();
      } catch (error) {
        return reject(error);
      }
      
      if (next.done) {
        return resolve(next.value);
      }
      
      Promise.resolve(next.value).then(
        value => step(() => gen.next(value)),
        error => step(() => gen.throw(error))
      );
    }
    
    step(() => gen.next());
  });
}

```

## 没有async 使用 function* 
```js
// 在 async/await 出现前，用协程处理异步
function* fetchUserData() {
  try {
    console.log('开始获取用户数据...');
    
    // 看起来像同步代码，实际是异步
    const user = yield fetch('/api/user').then(res => res.json());
    console.log('用户:', user.name);
    
    const posts = yield fetch(`/api/posts/${user.id}`).then(res => res.json());
    console.log('帖子数量:', posts.length);
    
    return { user, posts };
  } catch (error) {
    console.error('错误:', error);
  }
}

// 运行器函数（类似 async 函数的底层实现）
function run(generator) {
  const gen = generator();
  
  function handle(result) {
    if (result.done) {
      return Promise.resolve(result.value);
    }
    
    return Promise.resolve(result.value)
      .then(data => handle(gen.next(data)))   // 成功：恢复协程
      .catch(err => handle(gen.throw(err)));  // 失败：抛出异常
  }
  
  return handle(gen.next());
}

// 使用
run(fetchUserData).then(result => {
  console.log('最终结果:', result);
});
```

大部分异步场景都用 async/await，但 yield 在特定领域（状态机、数据流、协程）仍有不可替代的价值。