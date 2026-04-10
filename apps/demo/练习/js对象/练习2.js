var person = {
  name: '张三',
  age: '12',
  sex: '男'
};

// 一系列操作之后
var result = {};
for (var key in person) {
  // 查person中的key,value
  // 把查到的key,value扔给result
  var value = person[key]; // '张三'
  // 把value, key增给result
  result[value] = key;
}

// 得到想要的人
// var result = {
//     张三: 'name',
//     12: 'age',
//     男: 'sex',
// };
