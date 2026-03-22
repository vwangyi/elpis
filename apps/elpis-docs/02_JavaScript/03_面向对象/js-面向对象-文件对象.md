# 文件







const formData = new FormData();

URLSearchParams  JSON FormData







// file对象只是存储了 文件的基本信息 比如 文件名 文件类型 文件大小 最后修改时间等 并没有文件的数据内容
// 数据内容 需要 FileRender来读取 

/* 创建一个file对象 */
const file = new File();  

const file1 = new File(['foo'], 'foo.txt', {
    type: 'text/plain',
    lastModified: Date.now()
}) 


const inp = document.querySelector('input'); 
inp.onchange = async function () {
    const file = this.files[0];  // this指inp 也可以 inp.files[0]
}

file.slice(0, 100);  

 












/* 创建一个文件读取器对象 */ 
const fileReader = new FileReader();





async function readFile(file) {
   return new Promise((resolve, reject) => {
       // 实例化一个文件读取器对象
       const fileReader = new FileReader();
       // 监听文件读取完成
       fileReader.onload = e => resolve(e.target.result); // 把base64返回
       fileReader.onerror = error => reject(error);
       // 读文件的base64
       fileRender.readAsDataURL(file);
       // fileRender.readAsArrayBuffer(file);
   }) 
}