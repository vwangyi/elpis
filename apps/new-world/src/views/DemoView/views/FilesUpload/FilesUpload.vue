<script setup>
import { ref, onMounted } from 'vue';
// md5是一种哈希算法，可以根据文件内容生成固定长度的字符串用来唯一标识这个文件。
import MD5 from 'spark-md5';

const CHUNK_SIZE = 1024 * 1024 * 5; // 5MB 假设每个分片是5MB
// 获取当前设备的线程数量
const threadCount = navigator.hardwareConcurrency || 2;

// 2. 创建分片函数
/**
 *
 * @param file 文件
 * @param index 下标
 * @param chunkSize 每个分片大小是多少兆
 * @returns Promise<{start: number, end: number, index: number, hash: string, blob: Blob}>  
 *  返回一个Promise对象，里面包含了分片的起始位置、结束位置、下标、hash值和分片的Blob对象
 * hash值是当前分片的MD5值 是一个唯一标识
 */
function createChunk(file, index, chunkSize) {
  return new Promise(resolve => {
    const start = index * chunkSize;
    const end = Math.min(start + chunkSize, file.size);

    const md5 = new MD5.ArrayBuffer();
    const reader = new FileReader();
    const blob = file.slice(start, end);
    reader.onload = e => {
      md5.append(e.target.result);
      resolve({
        start,
        end,
        index,
        hash: md5.end(),
        blob
      });
    };
    reader.readAsArrayBuffer(blob);
  });
}

// 1. 拿到文件对象
async function handleFile(event) {
  const file = event.target.files[0];
  console.time('time');

  // 计算分片的总数
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

  // for (let i = 0; i < totalChunks; i++) {
  //   const res = await createChunk(file, i, CHUNK_SIZE);
  //   result.push(res)
  // }
  // 计算每个线程需要处理多少个分片
  const threadChunkCount = Math.ceil(totalChunks / threadCount);
  let finishCount = 0; // 用于记录完成的线程数量
  // 拿到计算后的结果
  const result = [];
  // 给每个线程分配任务
  for (let i = 0; i < threadCount; i++) {
    const start = i * threadChunkCount;
    const end = Math.min((i + 1) * threadChunkCount, totalChunks);
    const url = new URL('./workers/chunk.worker.js', import.meta.url);
    const worker = new Worker(url, {
      type: 'module'
    });
    worker.postMessage({
      file,
      start,
      end,
      CHUNK_SIZE
    });
    worker.onmessage = e => {
      worker.terminate(); // 结束
      console.log(`拿到计算后的结果`, i, e.data);
      result[i] = e.data; // 将计算后的结果存储到对应的索引位置
      finishCount++;
      if (finishCount >= threadCount) {
        console.log('Finalresult', result.flat(Infinity)); // 所有线程都完成后，输出最终结果
        console.timeEnd('time');
      }
    };
  }
}
</script>
<template>
  <div>
    <input
      type="file"
      @change="handleFile"
    />
  </div>
</template>
