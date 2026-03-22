/**
 * @description
 *
 */

const express = require('express')
const moment = require('moment')

const router = express.Router()
function getInt(n) {
  return Math.floor(Math.random() * n)
}

// 办结统计
router.get('/done', (req, res) => {
  const todoToday = getInt(2000)
  const doneToday = todoToday - Math.floor((todoToday * getInt(10)) / 100)
  const doneRateToday = (doneToday / todoToday).toFixed(4)
  const todoTotal = todoToday + getInt(200000)
  const doneTotal = todoTotal - Math.floor((todoTotal * getInt(10)) / 100)
  const doneRateTotal = (doneTotal / todoTotal).toFixed(4)

  res.send({
    msg: '获取办结统计数据成功',
    timestamp: Date.now(),
    data: {
      todoToday,
      doneToday,
      doneRateToday,
      todoTotal,
      doneTotal,
      doneRateTotal,
      history: [
        {
          month: '1',
          total: getInt(10000),
        },
        {
          month: '2',
          total: getInt(10000),
        },
        {
          month: '3',
          total: getInt(10000),
        },
        {
          month: '4',
          total: getInt(10000),
        },
        {
          month: '5',
          total: getInt(10000),
        },
        {
          month: '6',
          total: getInt(10000),
        },
        {
          month: '7',
          total: getInt(10000),
        },
      ],
    },
  })
})

// 部门统计
router.get('/department', (req, res) => {
  const { date } = req.query

  res.send({
    msg: '获取部门业务统计数据成功',
    date,
    data: [
      {
        project: '失业金申领',
        count: getInt(300),
      },
      {
        project: '社保缴费',
        count: getInt(300),
      },
      {
        project: '公积金缴费',
        count: getInt(300),
      },
      {
        project: '企业社保开户登记',
        count: getInt(300),
      },
      {
        project: '灵活就业人员参保',
        count: getInt(300),
      },
      {
        project: '稳岗补贴申请',
        count: getInt(300),
      },
    ],
  })
})

// 热门事项top5
router.get('/hot/top', (req, res) => {
  res.send({
    msg: '获取热门事项数据成功',
    data: [
      {
        name: '失业金申领',
        count: getInt(300),
      },
      {
        name: '企业保险',
        count: getInt(300),
      },
      {
        name: '就业人员退休办理',
        count: getInt(300),
      },
      {
        name: '失业金申领',
        count: getInt(300),
      },
      {
        name: '社保卡领取',
        count: getInt(300),
      },
    ].sort((a, b) => b.count - a.count),
  })
})

// 累计热门事项
router.get('/hot/total', (req, res) => {
  res.send({
    msg: '获取累计热门事项数据成功',
    data: [
      {
        name: '失业金申领',
        count: getInt(40000),
      },
      {
        name: '企业保险',
        count: getInt(40000),
      },
      {
        name: '就业人员退休办理',
        count: getInt(40000),
      },
      {
        name: '失业金申领',
        count: getInt(40000),
      },
      {
        name: '社保卡领取',
        count: getInt(40000),
      },
    ],
  })
})

// 业务统计
router.get('/biz', (req, res) => {
  res.send({
    msg: '获取业务统计数据成功',
    data: [
      { org: '社会保障局', count: getInt(300) },
      { org: '卫计委', count: getInt(300) },
      { org: '公积金局', count: getInt(300) },
      { org: '市民中心', count: getInt(300) },
      { org: '综合执法局', count: getInt(300) },
      { org: '民政局', count: getInt(300) },
    ],
  })
})

module.exports = router
