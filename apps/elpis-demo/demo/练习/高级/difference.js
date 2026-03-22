function difference(input, trash) {
  return input.filter((item) => !trash.some((t) => t === item))
}

// 左1: item   看右边的数组中有没有左1
console.log(difference([1, 2, 3], [1, 4])) // [2, 3]
