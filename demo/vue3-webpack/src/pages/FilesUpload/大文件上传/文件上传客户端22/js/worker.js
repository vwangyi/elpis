import SparkMD5 from 'spark-md5';

function createChunk(file, index, chunkSize) {
  return new Promise(resolve => {
    const start = index * chunkSize;
    const end = start + chunkSize >= file.size ? file.size : start + chunkSize;
    const spark = new SparkMD5();
    const blob = file.slice(start, end);
    const reader = new FileReader();
    reader.onload = e => {
      spark.append(e.target.result);
      const chunk = {
        index,
        start,
        end,
        hash: spark.end(),
        blob
      };
      resolve(chunk);
    };
    reader.readAsArrayBuffer(blob);
  });
}

// console.log('SparkMD5', SparkMD5)

onmessage = async e => {
  console.log('worker', e);
  const { file, chunkSize, start, end } = e.data;
  const result = [];
  for (let i = start; i < end; i++) {
    const prom = createChunk(file, i, chunkSize);
    result.push(prom);
  }

  const chunks = await Promise.all(result);
  // 向主线程发送消息
  postMessage(chunks);
};
