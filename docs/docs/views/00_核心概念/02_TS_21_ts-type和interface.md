
# type interface

问：type 和 interface 区别

● 都可以描述对象形状 都可以被 class 实现implements
● 区别
  ○ 扩展方式不同：interface用 extends继承  type可以用&实现扩展
  ○ 重复声明不同： interface 可以重复声明，会自动合并   type 不能重复声明 - 会报错
● 使用场景：描述对象 优先使用 interface ，如果需要联合类型 复杂类型 用 type

## type 
```ts

// 联合类型
type Status = 'pending' | 'success' | 'error';

// 元组类型
type Point = [number, number];

// 条件类型
type IsString<T> = T extends string ? true : false;

// 映射类型
type Optional<T> = {
  [K in keyof T]?: T[K];
};

// 模板字面量类型
type EventName = 'click' | 'hover';
type HandlerName = `on${Capitalize<EventName>}`; // "onClick" | "onHover"

// 这些 interface 都无法实现
// 类型别名 给类型取一个别名

type xixi = string; // 给string 取别名 xixi 
type myxixi = 1 | 2 | 3; 

let astr: xixi;

astr = '123123';


let astr23: myxixi;
astr23 = 1;
astr23 = 2;
astr23 = 3;




type a = string | number;

let b11 = 'hello' as a;
let b22: a = 'hello';
```

## interface 
```ts
/* ● interface 接口类型
  ○ interface
    ■ interface 重名定义 表示合并类型
    ■ interface 可以使用 extends 实现继承
    ■ IArguments
      ● interface IArguments {[index: number]: any;length: number;callee: Function;}
      ● IArguments 是ts定义好的 interface
    ■ (num: number, num2: number): number；
      ● 约束函数形参
 */


// interface 接口 和 抽象类 很相似。 区别是 抽象类 可以有 抽象方法 和 普通方法  接口里面只能有抽象方法 不能有普通方法 
 

interface my {
  name: string;
  sayHello(): void;
}
class MyClass implements my {
  name: string = '13';
  sayHello(): void {
    console.log('你们好')
  }
}
new MyClass()


/* interface 接口类型 */
interface Person {
  name: string;
  age: number;
}

/* interface 重名定义 表示合并类型 */
interface Person {
  gender: string;
}

const p: Person = {
  name: '张三',
  age: 18       ,
  gender: '男',
};

/* interface 可以使用 extends 实现继承 */
interface Student extends Person {
  stuId: number;
}

const s: Student = {
  name: '李四',
    age: 20,
    gender: '女',
    stuId: 1001,
};

/* IArguments */
function fn111(n1: number, n2: number, n3: number) {
  console.log(arguments);
  const args: IArguments = arguments;
  console.log(args);
}

fn111(1, 2, 3);

/* (num: number, num2: number): number； 约束函数形参 */
interface Add {
  (num1: number, num2: number): number;
}

const add: Add = function (a: number, b: number): number {
  return a + b;
};




console.log(add(1, 2));


interface 

    interface 通常去 描述 字面量对象 或 类数组对象 的类型
    interface 接口名 {
        key: 类型 // 静态属性
        key?: 类型 // 可选的静态属性 
        [key: string]: 类型 // 动态属性
        (形参: 类型): 类型 // 函数类型
    }


    interface IArguments {
        [index: number]: any;
        length: number;
        callee: Function;
    }

// 接口类型 主要用来限制 class 类的  也可以 抢type的饭碗 用来限制对象的类型

  // 定义一个接口 myInterface2
  interface myInterface2 {
    name: string
    sayHello(): void
  }

  // 定义一个类 MyClass 实现这个接口 myInterface2
  class MyClass implements myInterface2 {
    name: string
    constructor(name: string) {
      this.name = name
    }
    sayHello() {
      console.log('hello'); 
    }
  }
  
  // 抢type的饭碗 用来限制对象的类型  
  interface myInterface {
    name: string,
    age: number
  } 
  // 再定义一个相同的interface
  interface myInterface {
    sex: boolean
  }

  // 对象限制为这个 myInterface
  const obj3: myInterface = {
    name: '小明',
    age: 18,
    sex: true
  }

// 优先使用interface ，若interface不满足需求 再使用type

// type和interface的区别 
// interface 可以重复声明  会自动合并到一起
// type 不可以重复声明 会报错


  // 接口和抽象类的区别
  // 接口中所有属性不能有实际的值
  // 1. 抽象类可以有方法的实现 接口的方法不能有方法体
  // 2. 抽象类可以被子类{继承extends} 接口只能被子类{实现implements} 接口可以被泛型继承
  // 3. 抽象类可以有访问修饰符 接口只能有 public 


interface 可以描述 对象 函数 类数组等类型 

3个///并不是注释 
/// interface 接口名 { key: 类型 }  // 用来描述对象类型

// 定义一个接口 接口名是 LabelledValue
interface LabelledValue {
  label: string;
}

// 参数类型 必须符合接口LabelledValue的规范
function printLabel(labelledObj: LabelledValue) {
  console.log(labelledObj.label);
}

let myObj = {size: 10, label: "Size 10 Object"};
printLabel(myObj); 



// 可选属性 ?:
{ key?: string } // 表示 key属性是可选的

function fn(a: number, b?: number) {} // 表示 b参数是可选的

interface LabelledValue {
  label?: string; // 表示 label属性是可选的
} 

// 只读属性 readonly
interface Point {
    readonly x: number;
    readonly y: number;
}
let p1: Point = { x: 10, y: 20 };
p1.x = 5; // error!  x是只读的

// 额外的属性检查

// 定义一个接口
interface SquareConfig {
    color?: string;
    width?: number;
}
function createSquare(config: SquareConfig): { color: string; area: number } {  // 这意味着 config 只能包含 color 和 width属性 或者不包含任何属性 不能出现其他属性
    // ...
}

let mySquare = createSquare({ width: 100, opacity: 0.5 }); // error! 不能出现其他属性
let mySquare = createSquare({ width: 100, opacity: 0.5 } as SquareConfig); // ok 用as 断言可以绕过检查 但是不推荐

// 推荐做法 从新定义接口为下面的形式
interface SquareConfig {
    color?: string;
    width?: number;
    [propName: string]: any;
}


/// interface 接口名 { (形参: 类型): 类型 }  // 用来描述函数类型
interface SearchFunc {
  (source: string, subString: string): boolean;
}
let mySearch: SearchFunc;
mySearch = function(source: string, subString: string) {
  let result = source.search(subString);
  return result > -1;
}
```