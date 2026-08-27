# 泛型 

- 定义泛型类型的变量
- 泛型就是广泛的类型
- 当不能确定到具体类型时就用泛型


## 函数泛型
```ts
//函数实现 传什么类型 返回值就是什么类型
function ref<T, U>(  // 定义 泛型T 和 泛型U
  a: T, // 使用泛型T
  b: U, // 使用泛型U
): T { // 返回值 指定为泛型T
  return a;
}

ref<string, boolean>('123123', true); // 完整写法  
ref<string, number>('sfsdfs', 123132); 
ref(123, '123123');  // 自动推导 

```
## todo 
```ts
  
// 函数泛型使用场景之二。 实现interface
interface Inter {
  length: number;
}
function fn3<T extends Inter>(a: T): number {
  return a.length;
}
fn3({length: 3}); // 传递的对象必须包含length 

// 泛型使用场景之三。  
class klass<T> {
  name: T;
  constructor(name: T) {
    this.name = name;
  }
}
new klass<string>('sdfsdfsd');

/* 函数泛型 */

function Sub<T, U>(a: T, b: U): Array<T | U> {
  const params: Array<T | U> = [a, b];
  return params;
}

/* 接口泛型 */

interface MyInter<T> {
  (arg: T): T;
}

interface Len {
  length: number;
}

function getLegnth<T extends Len>(arg: T) {
  return arg.length;
}

getLegnth<string>('123');

/* 对象字面量泛型 */

let foo: { <T>(arg: T): T };

foo = function <T>(arg: T): T {
  return arg;
};

foo(123);
```