// 写接口
const express = require('express')
const mysql = require('mysql2') // 因为mysql8 密码验证安全有点问题 mysql包支持的不好 换个包就可以了
const bodyParser = require('body-parser')

const app = express()

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', '*')
  res.setHeader('Access-Control-Allow-Methods', '*')
  const parser = bodyParser.json()
  parser(req, res, next)
})

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  password: '556151993$Wy',
  database: 'xixi',
  user: 'root',
})

connection.connect()

// restful接口规范
// 增: post  FE: data  BE: body
// 删: delete  http://xxx.xxx/:id
// 改: put http://xxx.xxx/:id  FE: data  BE: body
// 查: get http://xxx.xxx?name=张

// 用户列表
app.get('/user/list', (req, res) => {
  connection.query(
    'SELECT * FROM USER WHERE locked IS NULL OR locked = 0;',
    (err, results, fields) => {
      if (err) {
        console.log(err)
        res.status(500).json({
          msg: '获取用户列表失败',
          info: err,
        })
        return
      }
      res.send({
        msg: '获取用户列表成功',
        data: results,
      })
    },
  )
})

// 增
app.post('/user', (req, res) => {
  // 拿到前端传过来的数据 req.body
  const { name } = req.body
  connection.query(`INSERT INTO user (name) VALUES ('${name}');`, (err, results, fields) => {
    if (err) {
      console.log(err)
      res.status(500).json({
        msg: '新增用户失败',
        info: err,
      })
      return
    }
    res.send({
      msg: '新增用户成功',
    })
  })
})

// 删
app.delete('/user/:id', (req, res) => {
  // console.log(req.params.id)
  const { id } = req.params
  connection.query(`UPDATE user SET locked = 1 WHERE id = ${id};`, (err, results, fields) => {
    if (err) {
      console.log(err)
      res.status(500).json({
        msg: '删除用户失败',
        info: err,
      })
      return
    }
    res.send({
      msg: '删除用户成功',
    })
  })
})

// 改
app.put('/user/:id', (req, res) => {
  // console.log(req.params.id)
  const { id } = req.params
  const { name } = req.body

  // const {
  //     params: { id },
  //     body: { name },
  // } = req;

  connection.query(`UPDATE user SET name = '${name}' WHERE id = ${id};`, (err, results, fields) => {
    if (err) {
      console.log(err)
      res.status(500).json({
        msg: '更新用户信息失败',
        info: err,
      })
      return
    }
    res.send({
      msg: '更新用户信息成功',
    })
  })
})

app.listen(8080, () => {
  console.log('启动成功')
})

// http://localhost:8080/user/list

// mysql>
