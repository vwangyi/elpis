function worker() {
  function createChunks(file, index, chunkSize) {
    return new Promise(resolve => {
      const start = index * chunkSize;
      const end = start + chunkSize;
      const spark = new SparkMD5.ArrayBuffer();
      const reader = new FileReader();
      const blob = file.slice(start, end);

      // 监听文件读取完成
      fileReader.onload = e => {
        spark.append(e.target.result);
        const result = {
          start,
          end,
          index,
          hash: spark.end(),
          blob
        };
        resolve(result);
      };
      // 读取文件
      reader.readAsArrayBuffer(blob);
    });
  }

  // 开多线程 应用场景： 需要大量计算的CPU密集型任务

  // 每个分片大小占多少字节 和服务器商量好
  const CHUNK_SIZE = 1024 * 1024 * 5; // 5M

  // 记录完成的线程数量
  let finishedCount = 0;

  function cutFile(file) {
    // 切片总数
    const chunkCount = Math.ceil(file.size / CHUNK_SIZE);
    // 线程总数
    const THREAD_COUNT = navigator.hardwareConcurrency || 4; // 不支持 默认为4
    // 每个线程处理的切片数量
    const threadChunkCount = Math.ceil(chunkCount / THREAD_COUNT);

    // 开启多线程来计算每个切片的hash
    for (let i = 0; i < chunkCount; i++) {
      // 创建线程      工作线程的代码不是主线程执行的 所以是单独的一个文件
      // 下面写的 主要是 主线程和工作线程之间的通信
      // 主线程做的是 就是 创建工作线程，监听工作线程的消息
      const worker = new Worker('./worker.js', { type: 'module' });
      const start = i * threadChunkCount;
      let end = (i + 1) * threadChunkCount;
      if (end > chunkCount) {
        end = chunkCount;
      }

      worker.postMessage({ file, start, end, CHUNK_SIZE });

      // 接收线程的消息
      worker.onmessage = function (e) {
        result[i] = e.data; // 用push 顺序可能会乱
        worker.terminate(); // 关闭线程
        finishedCount++;
        if (finishedCount === chunkCount) {
          resolve(result.flat());
        }
      };
    }
  }

  function test() {
    const inpFile = document.querySelector('#inpFile');

    inpFile.addEventListener('change', async function () {
      const file = inpFile.files[0]; // 拿到用户选择的文件
      console.time('上传文件耗时');
      const chunks = await cutFile(file); // 切片
      console.timeEnd('上传文件耗时');
      console.log('chunks', chunks); // 拿到分片结果
    });
  }
}
