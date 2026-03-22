# package.json
```js
npm init
npm init -y # 生成默认的 package.json 
name 表示 npm包名
version 表示 npm包版本
main 表示 esmodule语法的入口文件相对路径 当 require导入时 就会从这个目录导入
module 表示 commonjs语法的入口文件相对路径 当  import xx from 'vue' 


scripts 表示一个映射对象， npm run key名 执行 value的语句

dependencies 表示生产依赖 npm i xxx -S // -S 等价 --save   是默认的 可以不写 
devDependencies 表示开发依赖 npm i xxx -D // -D 等价 --save-dev 
files: ["index.js", "dist"] // 发布npm时 只上传这2个文件 

```
 