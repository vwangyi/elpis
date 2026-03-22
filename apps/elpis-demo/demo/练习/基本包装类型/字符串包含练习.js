var arr = ['世界亚军你们好', '一群2臂，会不会玩？', '嘿嘿嘿', 'cpdd', '对面的大傻x，一群2臂']

var dangerWords = ['2臂', '傻x']

// 写个函数
// 脏话数组, 一句话
function find(dangerWords, str) {
  for (var word of dangerWords) {
    // word: '2臂', '傻x'
    // 找到了提前返回
    if (str.includes(word)) {
      return true
    }
  }
  return false
}

function getResult(arr, dangerWords) {
  var result = []
  for (var str of arr) {
    var hasFind = find(dangerWords, str)
    result.push(hasFind)
  }
  return result
}

console.log(getResult(arr, dangerWords))

// 期待的结果
// [false, true, false, false, true]
