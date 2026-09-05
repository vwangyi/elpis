

## 
可以把相对路径转为绝对路径
const path = require('path');
path.resolve(__dirname, './test.js');
path.resolve(process.cwd(), './xxx.js')


