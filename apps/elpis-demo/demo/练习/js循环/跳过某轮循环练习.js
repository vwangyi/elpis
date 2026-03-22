var sum = 0
for (var i = 1; i < 101; i++) {
  // 个位数为3
  if (i % 10 === 3) {
    continue
  }
  sum += i
}
console.log(sum)
