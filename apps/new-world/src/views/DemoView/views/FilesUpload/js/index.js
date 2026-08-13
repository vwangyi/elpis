import MD5 from 'spark-md5';
/**
 *
 * @param file 文件
 * @param index 下标
 * @param chunkSize 每个分片大小是多少兆
 * @returns Promise<{start: number, end: number, index: number, hash: string, blob: Blob}>  
 *  返回一个Promise对象，里面包含了分片的起始位置、结束位置、下标、hash值和分片的Blob对象
 * hash值是当前分片的MD5值 是一个唯一标识
 */

export function createChunk(file, index, chunkSize) {
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
