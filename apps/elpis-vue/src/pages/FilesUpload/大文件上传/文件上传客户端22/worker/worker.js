import { uploadFile } from './uploadFile.js';

// 接收主线程消息
self.onmessage = async function (e) {
  const { file, CHUNK_SIZE, start, end } = e.data;
  const result = [];
  for (let i = start; i < end; i++) {
    const promiseItem = uploadFile(file, i, CHUNK_SIZE);
    result.push(promiseItem);
  }
  const chunks = await Promise.all(result);
  self.postMessage(chunks); // 传递数据给主线程
};

// 传数据 是 调用 postMessage()
// 接收数据 是 给 onmessage 赋值一个函数

// 主线程 这两个方法挂在 worker实例 上
// 工作线程 这两个方法挂在 self 上
