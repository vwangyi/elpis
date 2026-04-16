/* 大文件上传 */

// https://www.douyin.com/video/7203617378331118907
// https://www.douyin.com/video/7390671292048936211

let upload = document.querySelector('#upload7');
let upload_inp = upload.querySelector('.upload_inp');
let upload_button_select = upload.querySelector('.upload_button.select');
let upload_progress = upload.querySelector('.upload_progress');
let upload_progress_value = upload_progress.querySelector('.value');

function delay(duration) {
  const start = Date.now();
  while (Date.now() - start < duration) {}
}
// 开启web worker 计算hash
function openWorker(file, blobSize) {
  return new Promise(resolve => {
    // cpu核数
    const threadCount = navigator.hardwareConcurrency || 4; // 不支持 默认为4
    // 切片总数 需要在切片之前 计算出切片总数
    const blobCount = Math.ceil(file.size / blobSize);

    // 每个线程处理的切片数量
    const threadBlobCount = Math.ceil(blobCount / threadCount);

    // 开启的线程数量
    const openWorkerCount = Math.min(threadCount, blobCount);

    const result = []; // 存放所有线程的结果
    let finishedCount = 0; // 记录完成的线程数量
    for (let i = 0; i < openWorkerCount; i++) {
      const startIndex = i * threadBlobCount;
      const endIndex = Math.min(blobCount, (i + 1) * threadBlobCount);
      const worker = new Worker('worker.js');

      worker.postMessage({ file, startIndex, endIndex, blobSize });
      worker.onerror = function (e) {
        console.log('线程错误', e);
        worker.terminate(); // 关闭线程
        resolve([]); // 返回空数组
      };

      worker.onmessage = function (e) {
        console.log('线程接收到的数据', e);
        result[i] = e.data; // 用push 顺序可能会乱
        worker.terminate(); // 关闭线程
        finishedCount++;
        if (finishedCount === threadCount) {
          resolve(result.flat());
        }
      };
    }
  });
}
// 把文件进行切片
async function file2blobs(file, index, blobSize) {
  // console.log('文件大小', file);

  // const blobs = []
  // for (let i = 0; i <= file.size; i += blobSize) {
  //     const blob = file.slice(i, i + blobSize)
  //     blobs.push(blob)
  // }
  // // return blobs

  return new Promise(resolve => {
    const startIndex = Math.max(0, index * blobSize);
    const endIndex = Math.min(startIndex + blobSize, file.size);
    const blob = file.slice(startIndex, endIndex);
    const spark = new SparkMD5.ArrayBuffer();
    const fileReader = new FileReader();

    // 监听文件读取完成
    fileReader.onload = e => {
      spark.append(e.target.result);
      const result = {
        startIndex,
        endIndex,
        index,
        hash: spark.end(),
        blob
      };
      resolve(result);
    };
    fileReader.readAsArrayBuffer(blob); // 读取文件内容
  });
}
// 增量计算hash
function blobs2hash(blobs) {
  return new Promise(resolve => {
    const spark = new SparkMD5();
    function _read(i) {
      if (i >= blobs.length) {
        resolve(spark.end());
        return; // 读取完成
      }
      const fr = new FileReader();
      // 监听文件读取完成
      fr.onload = e => {
        const bytes = e.target.result;
        spark.append(bytes); // 把读取得到字节数 交给 MD5 计算hash
        _read(i + 1); // 读下一个
      };
      const blob = blobs[i];
      fr.readAsArrayBuffer(blob); // 读取文件内容
    }
    _read(0);
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
    console.log('当前分片上传成功', data.servicePath);
    // 上传成功 更新进度条
    const tmp = (i / count) * 100;
    upload_progress_value.style.width = `${tmp}%`;
    if (tmp === 100) {
      delay(1000);
    }
  }
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

upload_inp.addEventListener('change', async function () {
  // 拿到文件
  let file = upload_inp.files[0];
  if (!file) return;
  // 打开loading
  openLoading();

  // -----------------------------------------------------------------------
  // 拿到文件的分片
  const blobSize = 1024 * 1024 * 5; // 5M
  console.time('文件切片完成时间');
  const blobs = await file2blobs(file, blobSize);
  // const blobs = await openWorker(file, blobSize)
  console.timeEnd('文件切片完成时间');
  console.log('文件切片完成', blobs);
  // 可以放到web worker中计算
  // 增量计算hash
  console.time('计算hash时间');
  const fileHash = await blobs2hash(blobs);
  console.timeEnd('计算hash时间');
  // -----------------------------------------------------------------------

  // 拿到 大文件的完整的类型
  const suffix = /\.([a-zA-Z0-9]+)$/.exec(file.name)[1];
  const { code, fileList, intact } = await upload_already(fileHash, suffix);
  console.log('文件上传情况', code, fileList, intact);
  if (code === 0 && intact === 1) {
    console.log('文件秒传, 恭喜您，文件上传成功');
    upload_progress_value.style.width = `100%`;
    closeLoading();
    return;
  } else if (code === 0 && intact === 0) {
    // const blobSize = 1024 * 1024 * 5 // 5M
    // // 拿到 文件的分片
    // const blobs = await file2blobs(file, blobSize)
    // 断点续传
    const blobsTemp = blobs.map((blob, index) => {
      const suffix = /\.([a-zA-Z0-9]+)$/.exec(file.name)[1];
      const filename = `${fileHash}_${index}.${suffix}`;
      return { file: blob, filename };
    });
    // // 切片的总数
    const count = blobsTemp.length;
    console.time('网络上传完成时间');
    await addBlobs(blobsTemp, count, fileList);
    console.timeEnd('网络上传完成时间');
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
