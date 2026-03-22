// 已知arr
var arr = [
  {
    name: 'zs',
    score: 99,
  },
  {
    name: 'ls',
    score: 69,
  },
  {
    name: 'ww',
    score: 58,
  },
]

// 求arr中score的最大值(必须用Math.max)
function getMax(arr) {
  var nums = []
  for (var i = 0; i < arr.length; i++) {
    // arr[i]: { name: 'zs', score: 99 }
    // 99: arr[i].score
    nums.push(arr[i].score)
  }
  return Math.max(...nums)
}
