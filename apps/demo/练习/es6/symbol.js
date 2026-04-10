// const a = 1;
// const b = 1;

// console.log(a === b); // true

// const a = Symbol(0); // 唯一的1
// const b = Symbol(1); // 唯一的1

// // console.log(a === b); // false

const key = Symbol('a');

const obj = {
  a: 1,
  [key]: 2
};

console.log(obj[key]);
