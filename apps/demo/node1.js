const data = {
  bookName: 'workspace',
  content:
    'eJyzyTBSSEksSdTNScxO1c1MsVUqS8l2TlZSQDDtbIoLEvPQVJWmGJoYm6dZGENUIrh2T/YueLp075MdvUDy6cQGG32Qbjsb/QwjOwDPrSdv',
  docTitle: 'hello',
  time: 1768274457619
};

// 使用 Node.js 解码
const zlib = require('zlib');

function decodeContent(base64Content) {
  console.log('=== 开始解码 ===');
  console.log('Base64 长度:', base64Content.length);

  try {
    // 1. Base64 解码
    const buffer = Buffer.from(base64Content, 'base64');
    console.log('解码后长度:', buffer.length);
    console.log('前10字节:', buffer.slice(0, 10));

    // 2. 检查 zlib 头
    const header = buffer.slice(0, 2);
    console.log('zlib 头:', header.toString('hex'));

    // 3. 尝试不同的解压方法
    let result;

    // 方法1: 标准 zlib 解压
    try {
      result = zlib.inflateSync(buffer);
      console.log('✓ 标准 zlib 解压成功');
    } catch (e1) {
      console.log('✗ 标准 zlib 失败:', e1.message);

      // 方法2: 如果是 gzip
      try {
        result = zlib.gunzipSync(buffer);
        console.log('✓ gzip 解压成功');
      } catch (e2) {
        console.log('✗ gzip 失败:', e2.message);

        // 方法3: 原始 deflate 数据
        try {
          result = zlib.inflateRawSync(buffer.slice(2));
          console.log('✓ 原始 deflate 解压成功');
        } catch (e3) {
          console.log('✗ 原始 deflate 失败:', e3.message);
          return null;
        }
      }
    }

    // 4. 转换为字符串
    const text = result.toString('utf8');
    console.log('解码结果:', text);
    console.log('结果长度:', text.length);

    return text;
  } catch (error) {
    console.error('解码过程出错:', error.message);
    return null;
  }
}

// 解码你的数据
const decoded = decodeContent(data.content);
console.log('\n最终结果:', decoded);
