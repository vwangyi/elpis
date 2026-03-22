// 要封装的模块
function mass(arr) {
  return arr.sort(() => Math.random() - 0.5)
}

module.exports = {
  mass,
}
