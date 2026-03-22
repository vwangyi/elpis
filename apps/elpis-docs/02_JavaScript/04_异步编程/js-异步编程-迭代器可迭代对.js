

// # 可迭代对象  

// 迭代器 生成器 



// 在 JavaScript 中，可迭代对象（Iterable） 是实现了 [Symbol.iterator] 方法的对象，该方法返回一个迭代器（Iterator）。
// 可迭代对象可以被 for...of 循环遍历，也可以被展开运算符 ... 操作。 还可以手动调用 next() 方法
// 可迭代对象是 原型链上存在[Symbol.iterator] 方法的对象，该方法返回一个迭代器


// Array, Map, Set, String, TypeArray, arguments, NodeList 等等 
// 注意 Object不是迭代器对象 因为对象没有顺序 不是有序的和不是连续的
 


const arr = [1,2,3]
const str = '123'
const obj = { a:1, b:2, c: 3}
// for(let i of arr) {
//     console.log(i)
// }
// for(let i of str) {
//     console.log(i)
// }
// for(let i of obj) {
//     console.log(i) // 报错
// }
// console.log('arr', ...arr)
// console.log('str', ...str)
// console.log('obj', ...obj) // 报错

// Symbol.iterator

// const iter = arr[Symbol.iterator]() 
// console.log(iter.next())
// console.log(iter.next())
// console.log(iter.next())
// console.log(iter.next())



const a = [{a: 1}, {b:2}].map(item => {
    return { ...item, c: 1}
})
console.log(a)
console.log(...'123')

// for of 是用来遍历 可迭代对象 而js对象 不是一个可迭代对象 除非自行实现可迭代

// 原型链上是否存在 [Symbol.iterator]方法


// '123'.__proto__ 或 Object.getPrototypeOf('123') 查看原型

function* test() {
    yield 1;
    yield 2;
}
const iterator = test();

const ff = iterator[Symbol.iterator]()

console.log('ff', ff.next())
console.log('ff', ff.next())
console.log('ff', ff.next())
console.log('ff', ff.next())