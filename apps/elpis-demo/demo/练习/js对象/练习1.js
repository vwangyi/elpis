var person = {
  name: '张三',
  age: 12,
  sex: '男',
}

// 用person对象生成新数组
// [ ['name', '张三'], ['age', 12], ['sex', '男'] ]

var result = []
for (var key in person) {
  // 第一轮
  // key: 'name'
  // 值: person[key]: '张三'

  // 第二轮
  // key: 'age'
  // 值: person[key]: 12

  // 第三轮
  // key: 'sex'
  // 值: person[key]: '男'

  // 第一轮想得到的: ['name', '张三']
  var tmp = [key, person[key]] // ['name', '张三']
  result.push(tmp)
}

console.log(result)
