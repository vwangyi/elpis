const express = require('express')
const app = express() // 服务实例
const bodyParser = require('body-parser') // 解析请求体

// 设置允许跨域
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  const parser = bodyParser.json() // json解析器
  parser(req, res, next) // 加了一个req.body
})

app.get('/', (req, res) => {
  res.send('hello world')
})

app.get('/hi/:id', (req, res) => {
  // 路由参数
  console.log(req.params.id)
  res.send('hi')
})

app.get('/xixi', (req, res) => {
  // 查询参数
  res.send('您的姓名为:' + req.query.name)
})

app.post('/heihei', (req, res) => {
  // 请求体
  console.log(req.body)
  res.send('heihei')
})

// URL三个组成部分
// https://baidu.com:8080
// http >> 协议 默认80端口  https >>> 默认443端口
// baidu.com >> 域名
// 192.168.1.1 >> IP
// :8080 >> 端口
app.listen(3000, () => {
  console.log('启动成功')
})

// http://localhost:3000
// http://192.168.26.24:3000
// http://127.0.0.1:3000
