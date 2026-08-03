import { createChunk } from '../js/index.js';

onmessage = async function (e) {
  const { file, start, end, CHUNK_SIZE } = e.data;
  const result = [];
  for (let i = start; i < end; i++) {
    const prom = createChunk(file, i, CHUNK_SIZE);
    result.push(prom);
  }
  const chunks = await Promise.all(result);
  postMessage(chunks);
};

// 1 ui体验上 先显示上传 实际还没有上传
// 2. 不用等全部分片分好了再上传 可以先部分分片就开始上传
// 3. 计算hash 不用全部 而是 首中末 三个地方取出来计算  用准确性来换取计算 优缺点都要说
