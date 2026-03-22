
# new操作符 
- 所有对象都是new出来的
```js 
new操作符 底层原理
- 创建一个空对象，并且把空对象的__proro__ 指向 父类的prototype 利用原型链继承方法
- 利用apply方法 调用 父类，并把this修改为 这个空对象， 实现继承属性
- 最后返回这个对象

新对象 继承 这个类
```


```js
function createObj(Class, ...args) { 
    // 创建一个空对象 并且把 空对象的 __proto__ 指向 父类的prototype  
    const obj = Object.create(Class.prototype);  // 原型链继承方法
    const result = Class.apply(obj, args);  // 调用父构造 继承属性
    return result instanceof Object ? result : obj;   // 返回这个对象
}
createObj(Array, 1)
createObj(Array, 1,2)
``` 