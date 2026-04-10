// // 内置模块
// const fs = require('fs'); // file system

// function readFile(path) {
//     return new Promise((resolve, reject) => {
//         fs.readFile(path, { encoding: 'utf-8' }, (err, data) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(data);
//             }
//         });
//     });
// }

// ;(async () => {
//     const content = await readFile('./hello-world.txt');
//     console.log(content);
// })();

const fs = require('node:fs/promises');

(async () => {
  // 文件
  // 查
  // const content = await fs.readFile('./hello-world.txt', { encoding: 'utf-8' });
  // console.log(content);
  // 增
  // await fs.appendFile('./heihei.txt', 'hei\nhei');
  // 改
  // await fs.writeFile('./heihei.txt', '123');
  // 删
  // await fs.rm('./heihei.txt').catch(() => {});
  // 文件夹
  // 查
  // const fileNameList = await fs.readdir('./haha');
  // // 在haha文件夹中，建一个3.js，内容为1.js和2.js合并的结果
  // let content = '';
  // for (const fileName of fileNameList) {
  //     const c = await fs.readFile(`./haha/${ fileName }`, { encoding: 'utf-8' });
  //     content += c;
  // }
  // await fs.appendFile('./haha/3.js', content);
  // 增
  // await fs.mkdir('./haha/xixi');
  // 删
  // await fs.rmdir('./haha/xixi');
  // 改
  // await fs.rename('./haha', './heihei');
  // await fs.rename('./b.js', './a.js');
  // 了解 熟悉 掌握 熟练 精通
  // find findIndex some filter every includes indexOf
})();
