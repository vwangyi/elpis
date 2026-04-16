/* 大文件上传 */

// 文件切片
function file2blob(file, size) {
  const blobs = [];
  let start = 0;
  while (start < file.size) {
    blobs.push(file.slice(start, start + size));
    start += size;
  }
  return blobs;
}

function getFileHash(file) {
  return Promise(resolve => {
    const spark = new SparkMD5();
    function _read(i) {
      if (i > blobs.length) {
        resolve(spark.end());
        return; // 读取完成
      }
      const blob = blobs[i];
      const fr = new FileReader();
      // 监听文件读取完成
      fr.onload = e => {
        const bytes = e.target.result;
        spark.append(bytes); // 把读取得到字节数 交给 MD5 计算hash
        _read(i + 1); // 读下一个
      };
      fr.readAsArrayBuffer(blob);
    }
    _read(0);
  });
}

// https://www.douyin.com/video/7203617378331118907
// https://www.douyin.com/video/7390671292048936211
(function () {
  let upload = document.querySelector('#upload7');
  let upload_inp = upload.querySelector('.upload_inp');
  let upload_button_select = upload.querySelector('.upload_button.select');
  let upload_progress = upload.querySelector('.upload_progress');
  let upload_progress_value = upload_progress.querySelector('.value');

  function delay(duration) {
    const start = Date.now();
    while (Date.now() - start < duration) {
      console.log('');
    }
  }

  // 获取文件的hash

  function blob2hash(blob) {
    return new Promise(resolve => {
      const spark = new SparkMD5();
      const fr = new FileReader();
      fr.onload = e => {
        const bytes = e.target.result;
        spark.append(bytes); // 把读取得到字节数 交给 MD5 计算hash
        const res = spark.end();
        console.log('读到的东西', res);
        resolve(res);
      };
      fr.readAsArrayBuffer(blob);
    });
  }

  // 把 File 转为 多个Blob
  async function file2blobs(file, blobSize) {
    const blobs = [];
    let index = 0;
    for (let i = 0; i <= file.size; i += blobSize) {
      const blob = file.slice(i, i + blobSize);
      const suffix = /\.([a-zA-Z0-9]+)$/.exec(file.name)[1];
      const filename = `${await blob2hash(blob)}_${index++}.${suffix}`;
      blobs.push({ file: blob, filename });
    }
    return blobs;
    /**
     * 分片的速度为什么快 ？不管是File 还是 Blob 都只保存了 文件的基本信息（filename size type 位置等等）
     * 文件内容 需要用 FileRender读取出来
     */
  }

  // 请求服务器 问这个文件的 上传情况   这个文件如何表示（用文件指纹 文件hash）

  // 增量hash计算
  function blobs2hash(blobs) {
    return Promise(resolve => {
      const spark = new SparkMD5();
      function _read(i) {
        if (i > blobs.length) {
          resolve(spark.end());
          return; // 读取完成
        }
        const blob = blobs[i];
        const fr = new FileReader();
        // 监听文件读取完成
        fr.onload = e => {
          const bytes = e.target.result;
          spark.append(bytes); // 把读取得到字节数 交给 MD5 计算hash
          _read(i + 1); // 读下一个
        };
        fr.readAsArrayBuffer(blob);
      }
      _read(0);

      /**
       * 不推荐直接计算整个文件的hash 如果文件100个G 把100G读到内存中 内存吃不消
       * 所以用 增量hash计算 （不接收file 接收 blobs）
       *
       * 1 用 FileRender 直接读 file  计算file的hash      2M
       * 2 用 FileRender 直接读 file的分片blobs 增量计算   10M
       * 3 开启多线程 计算 分片hash  100M  （webworker）
       * 4 10G文件
       */
    });
  }

  // 拿到 已经上传的分片数组和 是否上传完毕
  async function upload_already(HASH, suffix) {
    // 获取已经上传的切片信息
    const params = { params: { HASH, suffix } };
    let { code, fileList, intact } = await instance
      .get('/upload_already', params)
      .catch(err => {});
    if (code === 0) {
      return { code, fileList, intact };
      // fileList; // 已经上传的切片数组
      // intact; // 是否上传完毕 0、不完整，断点续传 1、完整，文件秒传
    }
  }

  // 把blobs依次上传到服务器
  async function addBlobs(blobs, count, fileList) {
    console.log('fileList', fileList, blobs[0]);
    const result = [];
    for (let i = 0; i < blobs.length; i++) {
      const blob = blobs[i];
      // 如果已经上传过了 就不用再上传了
      if (fileList.length > 0 && fileList.includes(blob.filename)) {
        console.log('当前分片已经上传过了', blob);
        // 上传成功 更新进度条
        const tmp = (i / count) * 100;
        upload_progress_value.style.width = `${tmp}%`;
        continue;
      }
      const formData = new FormData();
      formData.append('file', blob.file);
      formData.append('filename', blob.filename);
      const data = await instance
        .post('/upload_chunk', formData)
        .then(res => (res.code === 0 ? res : Promise.reject(res)))
        .catch(err => console.log('当前分片上传失败', err));

      // result.push(data)
      console.log('当前分片上传成功', data.servicePath);
      // 上传成功 更新进度条
      const tmp = (i / count) * 100;
      upload_progress_value.style.width = `${tmp}%`;
      if (tmp === 100) {
        delay(1000);
      }
    }
    // return await Promise.all(result)
  }
  // 把所有的切片合并
  async function mergeBlobs(HASH, count) {
    const { code, servicePath } = await instance
      .post(
        '/upload_merge',
        { HASH, count },
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      )
      .catch(() => console.log('切片合并失败'));
    console.log(`所有切片上传成功 ${servicePath} 访问该文件 `);
  }

  // 打开loading
  function openLoading() {
    upload_button_select.classList.add('loading');
    upload_progress.style.display = 'block';
  }
  // 关闭loading
  function closeLoading() {
    upload_button_select.classList.remove('loading');
    upload_progress.style.display = 'none';
    upload_progress_value.style.width = '0%';
  }

  // 获取HASH跟suffix文件类型
  const changeBuffer = file => {
    return new Promise(resolve => {
      let fileReader = new FileReader();
      // 监听文件内容读取完成
      fileReader.onload = ev => {
        let buffer = ev.target.result,
          spark = new SparkMD5.ArrayBuffer(),
          HASH,
          suffix;
        spark.append(buffer);
        HASH = spark.end();
        suffix = /\.([a-zA-Z0-9]+)$/.exec(file.name)[1];
        resolve({
          buffer,
          HASH,
          suffix,
          filename: `${HASH}.${suffix}`
        });
      };
      // 读文件内容
      fileReader.readAsArrayBuffer(file);
    });
  };

  const file2hash = (file, chunkSize) => {
    return new Promise(resolve => {
      // 分片
      const fileChunks = [];
      for (let i = 0, len = file.size; i < len; i += chunkSize) {
        const blob = file.slice(i, i + chunkSize);
        fileChunks.push(blob);
      }
      // 读取文件内容 增量计算hash
      const spark = new SparkMD5();
      function _read(i) {
        if (i >= fileChunks.length) {
          const fileHash = spark.end();
          resolve({ fileHash, fileChunks });
          return;
        }
        const fr = new FileReader();
        // 监听文件读取完成
        fr.onload = e => {
          const bytes = e.target.result;
          spark.append(bytes); // 把读取得到字节数 交给 MD5 计算hash
          _read(i + 1); // 读下一个
        };
        const blob = fileChunks[i];
        fr.readAsArrayBuffer(blob);
      }
      _read(0);
    });
  };

  function useWorker(file, chunkSize) {
    return new Promise(resolve => {
      // cpu核数
      const currentCpuCount = window.navigator.hardwareConcurrency || 4;
      // 分片数量
      const chunksCount = Math.ceil(file.size / chunkSize);
      // 开辟几个worker线程
      const workerCount = Math.min(currentCpuCount, chunksCount);

      // 每个线程需要处理多少个分片
      const workerChunkCount = Math.ceil(chunksCount / workerCount);

      const result = []; // 存放每个线程处理后的结果
      const finishCount = 0; // 记录已经完成的线程数量
      for (let i = 0; i < workerCount; i++) {
        const worker = new Worker('./worker.js', { type: 'module' });
        console.log('Worker', worker);
        const start = i * workerChunkCount; // 每个线程的开始字节
        const end = Math.min((i + 1) * workerChunkCount, chunksCount); // 每个线程的结束字节

        worker.postMessage({ file, chunkSize, start, end });

        worker.onmessage = e => {
          result[i] = e.data;
          worker.terminate(); // 关闭线程
          finishCount++;
          if (finishCount === workerCount) {
            // const fileHash = result.map(item => item.fileHash).join('')
            // const fileChunks = result.map(item => item.fileChunks).flat()
            console.log('resolve', result);
            // resolve({ fileHash, fileChunks })
          }
        };
      }

      // const fileChunks = []
      // worker.postMessage({ file, chunkSize })
      // worker.onmessage = e => {
      //     const { fileHash, fileChunks } = e.data
      //     resolve({ fileHash, fileChunks })
      // }
    });
  }

  upload_inp.addEventListener('change', async function () {
    let file = upload_inp.files[0];
    if (!file) return;
    openLoading(); // 打开loading
    const chunkSize = 1024 * 1024 * 5; // 5M

    const { fileHash, fileChunks } = await file2hash(file, chunkSize);
    // worker
    // const { fileHash, fileChunks } = await useWorker(file, chunkSize);
    const suffix = /\.([a-zA-Z0-9]+)$/.exec(file.name)[1];
    const { code, fileList, intact } = await upload_already(fileHash, suffix);
    if (code === 0 && intact === 1) {
      console.log('文件秒传, 恭喜您，文件上传成功');
      upload_progress_value.style.width = `100%`;
      closeLoading();
      return;
    } else if (code === 0 && intact === 0) {
      // 拿到 文件的分片
      const blobs = fileChunks.map((blob, index) => {
        const filename = `${fileHash}_${index}.${suffix}`;
        return { file: blob, filename };
      });
      // 切片的总数
      const count = Math.ceil(file.size / chunkSize);
      // 断点续传
      console.time('切片上传开始');
      await addBlobs(blobs, count, fileList);
      console.timeEnd('切片上传开始');
      console.log('切片合并完成', fileHash, count);
      // 把文件hash和切片总数 传给后端 后端需要合并
      await mergeBlobs(fileHash, count);
      console.log('切片合并完成');
      closeLoading();
    } else {
      console.log('文件上传失败');
      closeLoading();
    }
  });

  // 选择文件按钮
  upload_button_select.addEventListener('click', function () {
    const classList = upload_button_select.classList;
    const isDisable =
      classList.contains('disable') || classList.contains('loading');
    // 禁用状态下不可点击
    if (isDisable) return;
    upload_inp.click();
  });
})();
