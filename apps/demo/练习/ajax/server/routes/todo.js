/**
 * @description
 *      todolist接口:
 *          1. 获取todolist
 *          2. 按照id获取todolist item
 *          3. 添加todo
 *          4. 删除todo
 *          5. 更新todo
 */

const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'db',
  port: 3306,
  user: 'root',
  password: '123456',
  database: 'ajax_lesson'
});

pool.getConnection((err, db) => {
  if (err) {
    console.error(err);
    return;
  }

  // 获取看板列表
  router.get('/list', (req, res) => {
    const { name = '', description = '' } = req.query;
    // setTimeout(() => {
    //     res.send({
    //         code: 0,
    //         data: [],
    //         msg: 'xixi',
    //     });
    // }, 6000);
    db.query('SELECT * FROM todolist', (err, results, fields) => {
      if (err) {
        console.error(err);
        res.send({
          code: -1,
          msg: '获取todolist失败'
        });
      } else {
        res.send({
          code: 0,
          data: results.filter(
            r => r.name.includes(name) && r.description.includes(description)
          ),
          // data: results,
          msg: '获取todolist成功'
        });
      }
    });
  });

  // 按照id获取todo
  router.get('/:id', (req, res) => {
    db.query(
      `SELECT * FROM todolist WHERE id=${req.params.id}`,
      (err, results, fields) => {
        if (err) {
          console.error(err);
          res.send({
            code: -1,
            msg: '获取todo失败'
          });
        } else {
          res.send({
            code: 0,
            data: results[0],
            msg: '获取todo成功'
          });
        }
      }
    );
  });

  // 添加todo
  router.post('/', (req, res) => {
    const { name, description } = req.body;
    if (!name.trim()) {
      res.status(400).json({
        code: -1,
        msg: '姓名不能为空'
      });
      return;
    }
    // 如果存在姓名, 则报错
    db.query(
      `SELECT * FROM todolist WHERE name='${name}'`,
      (err, results, fields) => {
        if (err) {
          res.status(500).json({
            code: -1,
            msg: '添加todo失败'
          });
          return;
        } else if (results.length) {
          res.status(400).json({
            code: -1,
            msg: '该姓名已存在'
          });
          return;
        }
        // 如果不存在姓名, 则添加
        db.query(
          `INSERT INTO todolist(name, description) VALUES('${name}', '${description}')`,
          (err, results, fields) => {
            if (err) {
              res.status(500).json({
                code: -1,
                msg: '添加todo失败'
              });
            } else {
              res.send({
                code: 0,
                msg: '添加todo成功'
              });
            }
          }
        );
      }
    );
  });

  // 删除todo
  router.delete('/:id', (req, res) => {
    db.query(
      `DELETE FROM todolist WHERE id=${req.params.id}`,
      (err, results, fields) => {
        if (err) {
          res.status(500).json({
            code: -1,
            msg: '删除todo失败'
          });
        } else {
          res.send({
            code: 0,
            msg: '删除todo成功'
          });
        }
      }
    );
  });

  // 更新todo
  router.put('/:id', (req, res) => {
    const { name, description } = req.body;
    if (!name.trim()) {
      res.status(400).json({
        code: -1,
        msg: '姓名不能为空'
      });
      return;
    }
    // 如果不存在姓名, 则添加
    db.query(
      `UPDATE todolist SET name='${name}', description='${description}' WHERE id=${req.params.id}`,
      (err, results, fields) => {
        if (err) {
          res.status(500).json({
            code: -1,
            msg: '更新todo失败'
          });
        } else {
          res.send({
            code: 0,
            msg: '更新todo成功'
          });
        }
      }
    );
  });
});

module.exports = router;
