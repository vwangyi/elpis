
## 1. 手写 防抖节流
```js

```
## 2. 手写 instanceof原理
```js

```
## 3. 手写 new操作符原理
```js

```
## 4. 手写 call/bind/apply
```js

``` 
## 5. 考察this指向，输出什么
```js
const a = {
    b: {
        c: function() {
            console.log(this)
            return this
        }
    }
}
console.log(a.b.c() === a.b)
const d = a.b.c;
console.log(d() === window)
``` 

## 6. 考察变量提升，输出什么
```js
var a = 1;
function a() {
    console.log(a);
    let a = 2;
}
console.log(a);
a();
``` 


## 7. 考察this指向 输出什么 
```js
window.a = 100
function fn() {
    return {
        a: 200,
        callback: () => {
            console.log(this.a) 
        }
    }
}
const fn0 = fn();
fn0.callback()
```

## 8. 手写promise

 

## 写防抖
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
## 写节流
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

## 手写 call apply bind 方法 
```js 
// 手写 call apply bind方法 
// 都是伪代码 js底层是c++实现的 

// 1 处理第一个参数为null undefined时 指向 globalThis 为原始值时 转为包装类对象 Object('123')
// 2 通过js的规则 this指向调用者 把真实调用函数挂在第一个参数上来调用 实现this指向第一个参数

function call(ctx, ...args) { 
    // 若第一个参数为null或undefined 则为globalThis 若为其他基础类型则转为对象 
    // Object() 传原始型 得到包装类对象
    ctx = [null, void 0].includes(ctx) ? globalThis : Object(ctx); 
    // 处理 调用函数的this指向 第一个形参 
    const fn = this
    const key = Symbol() // 用symbol来防止第一个参数对象 上有相同的属性  
    Object.defineProperty(ctx, key, {
        value: fn,
        enumerable: false
    }) 
    const result = ctx[key](...args) // 利用js的规则 this指向调用者ctx
    return result

}

function apply(ctx, args) { 
    const fn = this
    if(!Array.isArray(args)) {
        throw new Error('the second argument must be an array')
    }
    fn.myCall(ctx, ...args)
}

function bind(ctx, ...args) { 
    const fn = this
    return function (...args2) {
        if(new.target) {
            return new fn(...args, ...args2)
        }
        return fn.apply(ctx, args.concat(args2))
    }
}

Function.prototype.call1 = call;
Function.prototype.apply1 = apply;
Function.prototype.bind1 = bind;
```


## 变量提升
```js 
var a = 1;
function a() {
    console.log(a);
} 
console.log(a);
```  
## 变量提升
```js
console.log(a);
var a = 1;
function a() {
    console.log(a);
} 
console.log(a);
```

```js
var a = 1; // 原本初始化为函数引用地址 这里重新赋值为1
function a() {
  console.log(a)
  let a = 2;
}
console.log(a); // 打印为1
a(); // 报错
```


## 事件循环

```javascript
// 案例1
console.log('a');

for (var i = 0; i < 5; i++) {
  setTimeout(() => {
    setTimeout(() => {
      console.log(i);
    }, 1000 * i);
  }, 1000 * i);
}

new Promise((resolve, reject) => {
  console.log('c');
  setInterval(() => {
    console.log('d');
  }, 1000);
  setTimeout(() => {
    resolve('e');
  }, 1000)
}).then((res) => {
  console.log(res);
});

console.log('f');

// 案例2
setTimeout(() => {
  new Promise((resolve) => {
    console.log('b');
    resolve('c');
    setTimeout(() => {
      console.log('d');
      setTimeout(() => {
        console.log('f');
      });
    });
  })
  .then((res) => {
    console.log(res);
    setTimeout(() => {
      console.log('e');
    });
  });
  console.log('a');
});
console.log('z');

// 案例3
console.log('a');

new Promise(function (resolve) {
    console.log('b');
    for (var i = 1; i <= 2; i++) {
        setTimeout(() => {
            console.log(i);
        }, i * 1000);
        console.log(i);
    }
    resolve();
})
.then(function () {
    console.log('c');
});

setTimeout(() => {
    console.log('d');
    new Promise(function (resolve) {
        console.log('e');
        resolve();
    })
    .then(function () {
        console.log('f');
    });
}, 2000);
```

 

## 写出创建数组的方式 

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


## sdfsdf
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>

    <div id="box" style="width: 100px;height: 100px;background-color: red;"></div>

    <script>
        const dom = document.querySelector('#box')
        function runjs(t) {
            const start = performance.now();
            while (performance.now() - start < t) {
                // console.log(1); // console.log会导致计时不准
            }
        }
        function handleClick() {
            dom.style.backgroundColor = 'blue'
            requestAnimationFrame(() => {
                console.log('开始渲染')
            })
            requestIdleCallback(() => console.log('主线程空闲')) // 追加到空闲队列
            Promise.resolve().then(() => console.log('清空微任务'))
            setTimeout(() => {
                console.log('宏任务1');
                dom.style.backgroundColor = 'yellow'
                requestAnimationFrame(() => {
                    console.log('开始渲染')
                })
                requestIdleCallback(() => console.log('主线程空闲')) // 追加到空闲队列
                Promise.resolve().then(() => console.log('清空微任务'))
                setTimeout(() => console.log('宏任务2'))
                runjs(3000); // js会阻塞渲染 

            })
            runjs(3000);

        }
        dom.addEventListener('click', handleClick)
        setTimeout(() => {
            console.log('宏任务')
        })
        Promise.resolve().then(() => console.log('清空微任务'))
        requestAnimationFrame(() => {
            console.log('开始渲染')
        })
        console.log('初始化 同步任务');

    </script>
</body>

</html>
```



```js
setTimeout(function () {
  console.log(1);
}, 0);

Promise.resolve().then(function () {
  console.log(2);
});

console.log(3);


```

```js
function a() {
  console.log(1);
  Promise.resolve().then(function () {
    console.log(2);
  });
}
setTimeout(function () {
  console.log(3);
}, 0);

Promise.resolve().then(a);

console.log(5);


```

// 打印顺序是什么：2 1
```js
setTimeout(function () {
  console.log(1);
}, 0);

function delay(duration) {
  var start = Date.now();
  while (Date.now() - start < duration) {}
}
delay(3000);
console.log(2);
```

```js
function a() {
  console.log(1);
  Promise.resolve().then(function () {
    console.log(2);
  });
}

setTimeout(function () {
  console.log(3);
  Promise.resolve().then(a);
  console.log(6);
}, 0);

Promise.resolve().then(function () {
  console.log(4);
});

console.log(5);

// 渲染主线程 执行 按以下顺序执行代码
// 1 同步代码
// 2 异步的微任务
// 3 异步的宏任务的 交互队列
// 4 异步的宏任务的 延时队列

// 渲染主线程 申请内存 存放函数
function a() {
  console.log(1);
  Promise.resolve().then(function () {
    console.log(2);
  });
}

// 渲染主线程 把函数添加到 延时线程 由延时线程计时 并且到时间后(满足调用条件才去排队) 把函数添加到 延时队列排队
setTimeout(function () {
  console.log(3);
  Promise.resolve().then(a);
  console.log(6);
}, 0);

// 渲染主线程 直接把函数添加到 微任务队列
Promise.resolve().then(function () {
  console.log(4);
});

console.log(5);

// 5 4 3 6 1 2

```

# JS事件循环机制 5\*

> js的异步处理
>
> setTimeout / setInterval 宏任务
>
> Promise 微任务

```js
console.log(1);
setTimeout(() => {
  console.log(3);
}, 0);
new Promise(resolve => {
  console.log(4);
  resolve(5);
}).then(res => {
  console.log(res); // 5
});
console.log(2);

// 同步: 1, 4, 2
// 微任务: 5
// 宏任务: 3
```

## 案例1

```js
console.log(1);
setTimeout(() => {
  console.log(3); // 宏0s >>> 3
});
new Promise(resolve => {
  console.log(4);
  setTimeout(() => {
    resolve(5); // 宏0s + 微0s >>> 5
  });
}).then(res => {
  console.log(res); // 5
});
console.log(2);
```

## 案例2

```js
console.log(1);
new Promise(resolve => {
  console.log(4);
  setTimeout(() => {
    resolve(5);
  });
}).then(res => {
  console.log(res);
});
new Promise(resolve => {
  console.log(6);
  setTimeout(() => {
    resolve(7);
  });
}).then(res => {
  console.log(res);
});
console.log(2);

// 1, 4, 6, 2
// 5, 7
```

## 案例3

```js
console.log('a');
for (var i = 0; i < 3; i++) {
  console.log(i);
  setTimeout(() => {
    console.log(i); // 3
  }, i * 1000); // 0, 1, 2秒
}
new Promise(resolve => {
  console.log('b');
  setTimeout(() => {
    resolve('c');
  });
}).then(res => {
  console.log(res);
});
console.log('d');

// 同步: 'a', 0, 1, 2, 'b', 'd'
// 0s宏任务: 3
// 0s微任务+宏任务: c
// 1s: 3
// 2s: 3
```

## 案例4

```js
console.log('a');
for (var i = 0; i < 3; i++) {
  console.log(i);
  setTimeout(() => {
    console.log(i);
  }, i * 1000);
}
new Promise(resolve => {
  console.log('b');
  setInterval(() => {
    console.log('e');
  }, 1000);
  resolve('c');
}).then(res => {
  console.log(res);
  setTimeout(() => {
    console.log('f');
  });
});
console.log('d');

// 0s宏: 3
// 0s微: c
// 0s微+0s宏: f

// 1s宏: 3
// 1s宏: e

// 同步: a, 0, 1, 2, b, d
// 0s: c, 3, f
// 1s: 3, e
// 2s: 3, e
// 3s: e, ...
```

## 案例5

```js
console.log('a');
for (var i = 0; i < 2; i++) {
  console.log(i);

  setTimeout(() => {
    setTimeout(() => {
      console.log(i);
    }, i * 1000); // 2s
  }, i * 1000); // 0s

  new Promise(resolve => {
    console.log('b:', i);
    resolve('c' + i);
  }).then(res => {
    console.log(res);
    console.log(res + i);
  });
}

// 同步: a, 0, b: 0, 1, b: 1
// 0s微: c0, c02, c1, c12
// 0s宏+2s宏: 2
// 1s宏+2s宏: 2
```
