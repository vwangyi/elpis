const arr = new Array(1000000).fill(0).map(() => Math.random())

console.time('for')
const len = arr.length
for (let i = 0; i < len; i++) {
  const a = arr[i]
}
console.timeEnd('for')

console.time('foreach')
arr.forEach((a) => {})
console.timeEnd('foreach')

console.time('forof')
for (const a of arr) {
}
console.timeEnd('forof')
