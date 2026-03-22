// // 声明
// const s = new Set([2, 3]);

// // 增
// s.add(2);

// // 删
// s.delete(3);

// // 查
// console.log( s.has(4) ); // false
// console.log( s.size ); // 1

// console.log(s);

const arr = [1, 2, 3, 3]

function unique(arr) {
  return Array.from(new Set(arr))
}

console.log(unique(arr))
