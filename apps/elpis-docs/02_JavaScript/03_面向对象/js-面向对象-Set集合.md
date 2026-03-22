# 集合

- Set WeakSet Array 
- 
```js  
Set对象 （集合对象） es6新增
Set 集合 是 一组无序且唯一的项组成的 (集合可以理解为 是 没有顺序且唯一的项组成 的 数组) 
Set & WeakSet
集合Set 应用场景

用Array数组 是希望 有序 且可以重复的  
用Set集合   是希望 无序 且不重复的

如果我们需要存储的是数组 且不重复 且不需要顺序的话 用Set     同样的 如果我们需要存储的是对象 且不重复 且不需要顺序的话 用Map


const s = new Set(); // 创建一个空的set集合

s.add(1).add(2).add(3); // 添加某个值，返回Set数据结构本身

// 创建一个 set 集合
const s = new Set()
// 传一个 一维数组
const s = new Set([1,2,3,3,'3'])

// 增
s.add(4) // 添加某个值，返回Set数据结构本身
s.add(1).add(2).add(3); // Set(3) {1, 2, 3}
s.add(4) // 重复添加 没有效果 不会有重复的
console.log(s) // Set { 1,2,3,'3',4 }

// 删
s.delete('3')  // 删除某个值，返回bool
console.log(s)   // Set { 1,2,3,4 }
console.log(s.size) // 4  返回集合的长度

s.has('3') // 判断是否存在某个值   返回bool 
s.clear()  // 清空集合里面所有项  没有返回值
Set对象 应用场景之一 数组去重
    const s = new Set(['a', 'a', 'b', 'b']);
    console.log(s.size);  // 2   还是2 Set数据结构自动去重
    const arr = [...s];
    console.log(arr);    //  ['a', 'b']
Set对象  遍历
    const s = new Set([1,2,3,4]);
    // 第一种for...of
    for(let i of s){
        console.log(i); // 1 2 3 4
    }
    // 第二种forEach  
    s.forEach(value => {
        console.log(value); // 1 2 3 4
    })
    // 不能用 for...in
    keys() values() entries()  // 待验证

Set集合
// 生成一个Set集合实例 
const set = new Set([
  // [key, value],
  ['name', '张三'],
  ['age', 18]
  [1, 'a'],
  [2, 'b'],
  [3, 'c']
])
// Set和数组 对比
// Set实例的值 是 唯一的 没有索引 没有顺序
// 数组的值 可以重复 有索引 有顺序

// 增
set.add('d')
// 删
set.delete('a')
// 查
set.has('a')  // 是否含有某个值
set.size  // 查看集合的大小个数

// 应用
// 去重
Array.from(new Set([1, 1, 2, 2, 3, 3]))  // [1, 2, 3]


WeakSet 
```js
const ws = new WeakSet()
const obj = {a: 1}
```

```