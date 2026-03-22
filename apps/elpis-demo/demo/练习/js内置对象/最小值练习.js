var students = {
  zs: 89,
  ls: 59,
  ww: 100,
}

// 使用Math.min求最小值
function getMin(obj) {
  var nums = []
  for (var key in obj) {
    // 89: obj[key]
    nums.push(obj[key])
  }
  return Math.min(...nums)
}
