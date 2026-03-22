import Mock from 'mockjs'

Mock.mock('/api/users', 'get', function () {
  return Mock.mock({
    status: '200',
    msg: '请求成功',
    'data|1-10': [
      {
        date: '@date',
        name: '@name',
        address: '@city(true)',
        'admin|1': [true, false],
      },
    ],
  })
})
