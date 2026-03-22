// 声明对象的语法
// 对象用于描述映射关系
// 映射关系: 一一对应
// 描述一个人的信息
// 名字: 张三
// 年龄: 12
// 性别: 男
// 是不是差生: true

// var name = '张三';
// var age = 12;
// var sex = '男';

var chepaihao = {
  渝: '重庆',
  川: '四川',
}

var person = {
  // key: value
  // 键: 值
  // 键值对
  name: '张三',
  age: 12,
  sex: '男',
  // isBad: false,
}

// 查
// console.log(person.name); // person的name
console.log(person['name']) // person的name

// 增
// person.isBad = true;
// person['isBad'] = true;
// console.log(person);

// 删
// delete person.sex;
// console.log(person);

// 改
// person.age = 18;

// 把'张三' 12 '男' 取出来放数组里['张三', 12, '男']
var result = []
for (var key in person) {
  // console.log(key); // name, age, sex
  // console.log(person[key]); // '张三', 12, '男'
  result.push(person[key])
}

// 用person对象生成新数组
// [ ['name', '张三'], ['age', 12], ['sex', '男'] ]
