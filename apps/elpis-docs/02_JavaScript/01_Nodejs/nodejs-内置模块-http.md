

# http模块

- nodejs并不只是用来搭建web服务器，搭建web服务器只是 nodejs中众多功能之一的http模块

```js
// node 本文件路径.js 
const http = require('http');

// 创建一个http服务器对象
const server = http.createServer();

server.listen(8080, function() {
   console.log('启动成功了')
})

```

```js
const http = require('node:http')
const url = require('node:url')

http.createServer((req, res) => {


}).listen(98, () => {
    console.log('server is running on port 98')
})

```