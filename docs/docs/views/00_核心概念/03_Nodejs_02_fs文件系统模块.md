

# fs 文件系统



const fs = require('fs');


fs.xx // 相关api自行查阅

- 在Node.js中，可以使用fs模块来进行文件操作。
- 常见的文件操作方法包括读取文件、写入文件、复制文件、重命名文件、删除文件等。
- 例如，使用fs.readFile方法读取文件：
```js
  const fs = require('fs');

  fs.readFile('file.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(data);
  });

  fs.writeFile('file.txt', 'content', 'utf8', (err) => {
  if (err) throw err;
  console.log('文件写入成功');
});
```

方法	用途	异步/同步	常用指数
readFile()	读取文件	异步	⭐⭐⭐⭐⭐
writeFile()	写入文件	异步	⭐⭐⭐⭐⭐
readdir()	读取目录	异步	⭐⭐⭐⭐⭐
stat()	获取文件信息	异步	⭐⭐⭐⭐
mkdir()	创建目录	异步	⭐⭐⭐⭐
unlink()	删除文件	异步	⭐⭐⭐⭐
rmdir()	删除目录	异步	⭐⭐⭐
rename()	重命名/移动	异步	⭐⭐⭐⭐
copyFile()	复制文件	异步	⭐⭐⭐⭐
access()	检查访问权限	异步	⭐⭐⭐
existsSync()	检查文件是否存在	同步	⭐⭐⭐⭐