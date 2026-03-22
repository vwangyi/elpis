# 映射
- new Map()

- new Object()

- 
- 3种方式实现映射 Obejct Map WeakMap
```js  
Map对象（映射对象） es6新增
对象{} 只能是 key是字符串类型的或者是Symbol类型的  映射为 任意类型的值
Map对象 可以是任意类型的key  映射为 任意类型的值


// 创建一个空的Map实例
const m = new Map()

// 创建一个 Map实例 一般传一个二维数组
const m = new Map([
    ['key', 'value'], // key映射value 和 对象一样 不同的是 这里的key可以是任意类型
    ['a', 10],
    ['b', 20]
])

// 增 改
m.set('a', [1,2,3])
m.set('b', [4,5,6])
// 改 
m.set('b', [7,8,9])  //相同key 会覆盖掉之前的
// 删
m.delete('b')  // true 返回布尔
// 查 
m.has('b') // 是否存在 返回布尔 true
m.get('b') // undefined ｜ [7,8,9] 没有查到返回undefined



Map
// 使用
const map = new Map([
  // [key, value],
  ['name', '张三'],
  ['age', 18]
  [1, 'a'],
  [2, 'b'],
  [3, 'c']
])
// Map和对象 对比
// Map实例的 key 可以是任意类型的值，
// 对象的key 只能是 字符串 或 symbol


// 增删改查

// 增 改
map.set(4, 'd')
// 删
map.delete(1)
// 查
map.get(1)
// 查所有的key
map.keys()
// 查所有的value
map.values()
// 查所有的key和value
map.entries()
// 查所有的key和value
map.forEach((value, key) => {
  console.log(key, value)
})
Map对象（映射对象） es6新增
对象{} 只能是 key是字符串类型的或者是Symbol类型的  映射为 任意类型的值
Map对象 可以是任意类型的key  映射为 任意类型的值


// 创建一个空的Map实例
const m = new Map()

// 创建一个 Map实例 一般传一个二维数组
const m = new Map([
    ['key', 'value'], // key映射value 和 对象一样 不同的是 这里的key可以是任意类型
    ['a', 10],
    ['b', 20]
])

// 增 改
m.set('a', [1,2,3])
m.set('b', [4,5,6])
// 改 
m.set('b', [7,8,9])  //相同key 会覆盖掉之前的
// 删
m.delete('b')  // true 返回布尔
// 查 
m.has('b') // 是否存在 返回布尔 true
m.get('b') // undefined ｜ [7,8,9] 没有查到返回undefined



Map
// 使用
const map = new Map([
  // [key, value],
  ['name', '张三'],
  ['age', 18]
  [1, 'a'],
  [2, 'b'],
  [3, 'c']
])
// Map和对象 对比
// Map实例的 key 可以是任意类型的值，
// 对象的key 只能是 字符串 或 symbol


// 增删改查

// 增 改
map.set(4, 'd')
// 删
map.delete(1)
// 查
map.get(1)
// 查所有的key
map.keys()
// 查所有的value
map.values()
// 查所有的key和value
map.entries()
// 查所有的key和value
map.forEach((value, key) => {
  console.log(key, value)
})
```