/**
 * @description
 *    可视化编辑器接口
 */

const express = require('express')
const bodyParser = require('body-parser')
const todo = require('./routes/todo')
const datavis = require('./routes/datavis')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', '*')
  res.setHeader('Access-Control-Allow-Methods', '*')
  next()
})

app.use('/todo', todo)
app.use('/datavis', datavis)

app.listen(1234, () => {
  console.log('启动成功')
})
