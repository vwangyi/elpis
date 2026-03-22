```ts


// object 一般不用 
let aq: object;

aq = {};
aq = []; 

// 需要限制对象 主要是 限制 对象的结构 比如 可以包含哪些属性
// ?: 表示可选属性 
let ao: { name: string, age?: number };
ao = { name: '大神', age: 18 }

ao = { name: '大神' }


let ao1: { name: string, [key: string]: any }; // 如果有很多可选属性 就这样写 
ao1 = { name: '大神', age: 18 }

ao1 = { name: '大神' }





```