const zlib = require('zlib');

// 要编码的内容
const htmlContent = `<p data-lake-id="uf0ac402e" id="uf0ac402e"><br></p><p data-lake-id="u71fd654b" id="u71fd654b"><span data-lake-id="u85b38218" id="u85b38218">你好呀</span></p>`;
// encodeContent
function encodeToYuqueFormat(content) {
  console.log('=== 开始编码 ===');
  console.log('原始内容:', content);
  console.log('原始长度:', content.length);

  try {
    // 1. 使用 zlib 压缩（默认压缩级别）
    const compressed = zlib.deflateSync(content);
    console.log('压缩后长度:', compressed.length);

    // 2. 转换为 Base64
    const base64Content = compressed.toString('base64');
    console.log('Base64 长度:', base64Content.length);
    console.log('Base64 内容:', base64Content);

    // 3. 验证可以正确解码
    const buffer = Buffer.from(base64Content, 'base64');
    const decompressed = zlib.inflateSync(buffer);
    const decoded = decompressed.toString('utf8');

    console.log('\n=== 验证编码 ===');
    console.log('解码验证:', decoded === content ? '✓ 一致' : '✗ 不一致');

    return base64Content;
  } catch (error) {
    console.error('编码失败:', error.message);
    return null;
  }
}

// 编码测试
const encoded = encodeToYuqueFormat(htmlContent);
console.log('\n编码结果:', encoded);
