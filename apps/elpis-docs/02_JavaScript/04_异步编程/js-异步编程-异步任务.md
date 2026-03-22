# 异步任务
- https://html.spec.whatwg.org/multipage/webappapis.html#perform-a-microtask-checkpoint 
- https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame

## 录音
```js

什么是异步任务？ 不能立即执行的任务 比如 网络 定时器 
● 定时器 setTimeout setInterval
● 网络 xhr fetch 
● 交互任务 addEventListener 

w3c官网： 给浏览器定标准的 
es官网： 给标准 
 

 Event Loop
js是单线程的 而浏览器是一个多进程多线程的应用程序

你要知道js是单线程的 一次只能做一件事  而主线程需要处理任务是很多的，
  那就只能通过排队来实现，也就是事件循环。
    既然是排队就有谁先谁后的问题 
任务分为同步任务和异步任务 先执行 同步任务，然后再执行异步， 
  异步任务中 先清空异步微任务 队列 再执行异步宏任务 也就是说执行宏任务之前微任务一定没有。 
    
这是W 3C规定的。至于多个宏任务之间谁先谁后的问题由浏览器自行决定 w3c不管。

 

```
## 创建异步任务
```js

const intervlaId = setInterval(() => {}, 0)
const timeoutId = setTimeout(() => {}, 0)

// 浏览器在下一次重绘之前，调用用户提供的回调函数。
const 写 = requestAnimationFrame(() => {})

// 另外 网络请求 addEventListener交互事件 都属于 异步任务
```


## 清楚异步任务
```js 
clearInterval(intervlaId)  
clearTimeout(timeoutId)  
```
