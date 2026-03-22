const mapping = new Map()

// 增 / 改
mapping.set('name', 'zhangsan')
mapping.set(false, 'lisi')
mapping.set([], {})
mapping.set([], {})
mapping.set(false, true)

// 删
mapping.delete([])

// 查
// 查值
// console.log(mapping.get([])); // undefined
// 查长度
// console.log(mapping.size);
// console.log(mapping.entries());

// 迭代/循环
for (const [key, value] of mapping.entries()) {
  console.log(key, value)
}
