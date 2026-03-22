# Worker
- 


## 创建Worker
```js
  // 红宝书 第27章

/* 创建 worker线程 */ 
 
const Worker = window.Worker


// 实例的方法 或 原型方法
worker.onerror = function () {}
worker.onmessage = function () {}
worker.onmessageerror = function () {}
worker.postMessage = function () {}
worker.terminate() // 关闭woker线程



// 如何创建self实例对象
// worker线程上 可以直接 拿到 self 全局对象。类似主线程的window

// 如何操作数据 self
self.importScript() // worker线程加载js脚步 也可以使用 esmodel的import xx from 'xx'
self.name 
self.postMessage() 
self.onmessage = function () {}
self.onmessagerror = function () {}
self.close() // 关闭自己 关闭worker线程


// Worker 是html5的一个新特性

// Worker 是一个独立的线程，可以在主线程中创建 
// 应用场景
// 1 复杂计算：当涉及到大量计算或复杂的数据处理时，可以将这些操作放在 Web Worker 中进行，避免阻塞主线程。例如，图像处理、音频处理、视频处理等。

// 2 后台下载：当需要下载大量数据时，可以使用 Web Worker 在后台进行数据的下载和处理，以避免阻塞用户界面。例如，从服务器获取大量数据并进行处理之后再展示给用户。

// 3 数据处理：当需要对大量数据进行处理或者排序时，可以使用 Web Worker 将处理逻辑放在后台线程中进行，提高处理的效率。

// 4 实时通信：可以使用 Web Worker 来处理实时通信的逻辑。在主线程可以与 Web Worker 进行通信，从而实现实时的数据交换。 
                        
// 原文链接：https://blog.csdn.net/qq_33539839/article/details/131885078



// 如果浏览器支持 webWorker
if (window.Worker) {  
   /**
    * 把类实例化为对象
    * 让主线程创建一个工作线程
    * 创建一个worker对象
    */
   const worker = new window.Worker('worker.js');  


   /**
    * 主线程和工作线程之间的通信: 当js脚本运行在工作线程上 就拿不到主线程的window对象 相反可以拿到工作线程的self全局对象
    * 1 主线程通过 worker实例对象.postMessage() 方法向工作线程发送消息
    * 2 工作线程通过 self.onmessage 事件监听器接收消息
    */




   // 向 Worker 线程发送消息
   worker.postMessage('Hello World');
   // 监听 Worker 线程的消息
   worker.onmessage = function (event) {
      console.log('Received message ' + event.data);
   };
   // 监听 Worker 线程的错误
   worker.onerror = function (error) {
      console.log('Error: ' + error.message);
   };
   // 关闭 Worker 线程
   worker.terminate();
} else { 
   // 浏览器不支持 webWorker
   console.log('Your browser does not support Web Workers.');
}

```


 