+ 



##  
### 问：如何看待 TS？
+ ts 是用 开发成本 换取 维护成本  

### 




###  
### 问：装饰器
+ 是什么：装饰器本质就是高阶函数
+ 常见的装饰器：类装饰器 方法装饰器 属性装饰器 参数装饰器 访问器装饰器

### declare语句
+ 是什么：

```javascript
只有在以下情况才考虑 declare：
● 全局变量（如 window 上的属性）
● 第三方库的类型声明
● 环境变量



在某些时候 我们需要引用外部的js库 但是这个js库并没有提供类型声明文件 
ts会找不到它

// 声明一个全局变量jQuery 且类型是 (selector: string) => any
declare var jQuery: (selector: string) => any; 
jQuery('#foo').show(); // ok 如果没有上面的声明 就会报错 说找不到jQuery

// 1、文字阐述内容：对于外部函数库，我们同样需要使用declare语句来定义它的类型。
// 具体来说，我们可以使用declare function语句来描述函数类型。举个例子：
    declare function greet(name: string): string; 
    const message = greet('TypeScript');


   declare class Person {
        name: string;
        constructor(name: string);
        greet(): void;
    }

    const john = new Person('John');
    john.greet();

// 1、文字阐述内容：当我们使用第三方模块的时候，有时候需要为其编写类型定义文件，
// 这样一来，TypeScript就可以正确地理解这个模块的API，从而提供更好的类型检查，自动完成等功能。
// 但是，有些第三方模块可能比较庞大，API接口比较复杂，如果我们手动编写类型定义文件，会比较麻烦，并且容易出错。
// 这时候，我们可以使用declare module语句来描述整个模块的类型。

// 2、文字阐述内容：举个例子，我们想要使用Vue.js库：
 declare module 'vue' {
        export default Vue;
    }

    import Vue from 'vue';



// 1、文字阐述内容：使用declare语句需要注意以下几点：

// 2、文字阐述内容：1）declare语句只描述类型，不生成实际的代码。
// 这意味着，即使使用了declare语句，编译后的JS代码中也不会出现任何与这个声明有关的代码。

// 3、文字阐述内容：2）declare语句不需要使用分号作为结尾。

// 4、文字阐述内容：3）declare语句只在编译阶段有用，而且只在TypeScript代码中被处理。
// 在浏览器中执行编译后的代码时，这些declare语句会被忽略掉。

// 我们可以使用declare语句来描述外部JS代码的类型，提供更好的类型检查、提示等功能。
// 具体来说，我们可以使用declare var、declare function、declare class和declare module等语句来描述各种类型。
// 在使用declare语句时，需要注意几个细节，比如declare语句只描述类型、不生成实际的代码、不需要使用分号结尾等
```



+ TypeScript是具有类型的JavaScript



 

##  
##  
##  


+ 变量名属性名定义
    - 确定属性 name: string;
    - 可选属性 name?: string;
    - 任意属性 [propName: string]: any;
        * 定义了任意属性，那么确定属性和可选属性的类型都必须是它的类型的子集
    - 只读属性 readonly a: string; // 只读
    - 函数属性  cb():void;   
        * cb: (): void => { }



interface和type如何高效复用类型 



+ interface和type的区别
    - 总
        * interface和type都可以用来约束 普通对象
    - 分
        * 1是什么
            + interface是 定义多个属性的类型 是创建了一个新类型
            + type是给现有类型 取了一个新名字 而不是创建新类型
        * 2区别
            + interface 多个同名会合并 使用 extends 可以实现继承
            + type不支持合并和继承
        * 3 使用场景
            + interface主要用于约束类和对象
            + type用于定义简单的类型别名或复杂的联合类型、交叉类型等等 也可以约束对象
    - 总
        * 约束对象使用type或interface取决于团队规范 
        *  type使用更简洁   interface 偏向于面向对象语法 推荐使用interface



+ 

##  
+ 八股文
    - js和ts有什么区别
        * 区别1 语言类型不同
            + ts是静态类型语言，变量类型在编译时确定， 可以在编译时发现错误
            + js是动态类型语言，变量类型在运行时确定，可以在运行时发现错误
        * 区别2 编译阶段
            + ts需要编译阶段 把ts编译为js
            + js不需要编译 直接可以被浏览器运行
        * 区别3 团队合作
            + 大型项目多人开发 更适用TS
            + 中型项目 人少 适用JS
        * 区别4 难易程度
            + js比ts更容易上手 
            + ts中使用js库 需要做一些额外的工作
    - JS和TS的区别
        * 语言类型
            + JS是动态语言 TS是静态语言
        * 面向对象
            + TS 对 面向对象更加友好 可以使用类接口等概念
            + TS 
        * 应用场景
            + 大型项目 多人协作  适合TS
                - TS是用 开发时间 换取 维护时间 需要对长期利益和短期利益做权衡取舍
            + 中小型项目 适合JS
    - any和unknown的区别
        * 区别1 是 unknow 不能赋值给其他类型 any可以赋值给其他类型
        * 区别2  对象是any 可以调用对象的属性和方法。对象是unknow 不能调用属性和方法 会报错
    - interface和type的区别
        * 总
            + interface和type都可以用来约束 普通对象
        * 分
            + 1是什么
                - interface是 定义多个属性的类型 是创建了一个新类型
                - type是给现有类型 取了一个新名字 而不是创建新类型
            + 2区别
                - interface 多个同名会合并 使用 extends 可以实现继承
                - type不支持合并和继承
            + 3 使用场景
                - interface主要用于约束类和对象
                - type用于定义简单的类型别名或复杂的联合类型、交叉类型等等 也可以约束对象
        * 总
            + 约束对象使用type或interface取决于团队规范 
            +  type使用更简洁   interface 偏向于面向对象语法 推荐使用interface
    - TS如何高效复用类型
    - 什么是元数据（Metadata）？如何在 TypeScript 中使用元数据？
    - 什么是装饰器（Decorator）？它在 TypeScript 中的作用是什么？如何编写一个装饰器？你可以举个例子说明吗？ 
    - 什么是命名空间（Namespace）？它的作用是什么？
    - TypeScript 支持哪些模块化方案？它们之间有什么区别？如何在 TypeScript 中导出和导入模块？
    - 什么是泛型（Generics）？它在 TypeScript 中有什么用途？如何使用泛型来创建可重用的代码？什么是条件类型（Conditional Types）？你可以举个例子吗？
    - 接口（Interface）和类型别名（Type Alias）有什么区别？何时应该使用哪个？如何在接口中定义可选属性和函数类型？如何使用类型别名来定义复杂类型或联合类型？
    - 什么是 TypeScript？它解决了什么问题？TypeScript 的类型系统是如何工作的？它有哪些基本类型和高级类型？TypeScript 中的类型推断是什么？它在什么情况下发挥作用？如何定义可选属性、只读属性和函数参数的类型？













##  


##  
##  
##  


## 
## 接口 interface
```typescript

```



## 类型别名
```typescript
  


```

```javascript
// interface中的泛型

interface IInputProps<T> {
  vlaue: T;
  prevValue: T;
}

const obj: IInputProps<string> = {
  vlaue: '',
  prevValue: ''
}


// 数组的使用
const arr12: number[] = [1, 2, 3];  // 语法糖
const arr13: Array<number> = [1, 2, 3];  // 原样子


// 函数的使用
function map<T, S>(arr: T[], getItem: (item: T) => S): S[] {
  const res: S[] = [];
  for (const item of arr) {
    const newItem = getItem(item);
    res.push(newItem);
  }
  return res;
}


// 使用使用使用
// [1, 2, 3] >>> [1, 4, 9]
console.log(map<number, number>([1, 2, 3], (n) => n ** 2))

// map传了一个string类型 和 对象的interface { name: string} 是简写 小interface
console.log(map<string, { name: string }>(
  ['zs', 'ls', 'ww'],
  (name) => ({name})
))

// 看到不会的 :any

// some
// function some(params: () => ) {
//   for (const item of this) {
//     if () {

//       return true
//     }
//   }
  
//   return false
// }

// [1,2,3].some(item)

// filter 
// function filter<T, S>(arr: T[], getItem<boolean> ) {
//   const res = []
//   for (const item of arr) {
//     if (getItem) {
//       res.push(item)
//     }
//   }
//   return res
  
// }

```

ts

```javascript
// typescript: javascript的超集
// 类型断言: 如果不指定类型 由第一次赋值决定其类型 这就是类型断言
// 类型断言 as ... 

// 每一种数据类型 都应该指定类型:  字符串 布尔值 数字 数组 对象


 // 数组
// 由数字组成的数组 [1, 2, 3] 叫数字数组  number[]
// 由字符串组成的数组 ['1', '2', '3'] 叫字符串数组 string[]
// 数组项是什么类型 就是 类型 + []
// 由number[] 组成的数组 叫 number[][]

const positionList: [number, number][] = [
  [1, 2],
  [1, 2],
  [1, 2],
]

// 或者 ｜ 
const numStr1: number | string = 123;
const numStr2: (number | string)[] = ['1', 2, '3', 4]

// 元组 下面的方式 是表示元组的最好方式
const size: [number, number] = [100, 80]; // w, h
const position: [number, number] = [12, 32]; // x, y
const position3d: [number, number, number] = [12, 312, 123];  // x, y, z









// 对象: 对象的类型 需要声明一个interface   有一个说法是interface声明的变量有一个大写的I
interface Person {
  name: string;
  age: number;
  // ？ 表示可选 可传可不传
  children?: Person[]
}

// zs对象使用interface
const zs: Person = {
  name: 'zhangsan',
  age: 12,
}

zs.children?.push({
  name: 'ls',
  age: 11
})







// 按钮组件参数 需要定义一个 type

type ButtonType = 'primary' | 'danger' | 'warning';
type ButtonSize = 'small' | 'large' | 'mini';

interface ButtonProps {
  type?: ButtonType;
  size?: ButtonSize;
  round?: boolean;
  disabled: boolean;
}






// 练习
interface ResultItem {
  id: string
  name: string
  picture: string
  price: string
  count: number
  // ...
}
interface IShoppingCartListAPI {
  msg: string;
  result: ResultItem[]
}

const res: IShoppingCartListAPI = {
  msg: 'hello world',
  result: []
}

res.result.forEach(el => {
  console.log(el)
})

```







##  
## 联合类型 ｜
```typescript
     字面量本身就是一种数据类型    通过 | 叫做联合类型  表示可以是多种类型中的一种
    let a: 'abc' = 'abc' // 限制变量a为 'abc' 所以只能赋值 'abc'
    let b: 1 | 0 = 0 // 限制变量b为 1或0 所以只能赋值 1或0
    let c: boolean | string = false // 限制变量c为 boolean或string 所以只能赋值 boolean或string



### 联合类型

~~~ts
// 例如我们的手机号通常是13XXXXXXX 为数字类型 这时候产品说需要支持座机
// 所以我们就可以使用联合类型支持座机字符串
let myPhone: number | string  = '010-820'
 
 
// 这样写是会报错的应为我们的联合类型只有数字和字符串并没有布尔值
let myPhone: number | string  = true

// 函数使用联合类型
const fn = (something:number | boolean):boolean => {
     return !!something
}
~~~

### 交叉类型

多种类型的集合，联合对象将具有所联合类型的所有成员    &

~~~ts
interface People {
  age: number,
  height： number
}
interface Man{
  sex: string
}
const xiaoman = (man: People & Man) => {
  console.log(man.age)
  console.log(man.height)
  console.log(man.sex)
}
xiaoman({age: 18,height: 180,sex: 'male'});
~~~

### 类型断言

> 需要注意的是，类型断言只能够「欺骗」TypeScript 编译器，无法避免运行时的错误，反而滥用类型断言可能会导致运行时错误 
>
> 类型断言不能乱用



> 语法：　　值 as 类型　　或　　<类型>值  
>
> ​                  value as string           <string>value

~~~ts
--------------------bad------------------------
let fn = function (num: number | string) {
  // 会报错因为可能传进来number类型，number没有.length
  console.log(num.length) 
}

---------------------good----------------------
let fn = function (num: number | string) {
  console.log((num as string).length) 
}
fn('123')


let fn = function (num: number | string) {
  console.log((<string>num).length) 
}
fn('123')
~~~


  let a: number | string // a的类型是 number | string  也就是 a的类型是 number 和 string的联合类型 也就是 a的类型是 number 或 string

interface Bird {
    fly();
    layEggs();
}

interface Fish {
    swim();
    layEggs();
}

function getSmallPet(): Fish | Bird {
    // ...
}

let pet = getSmallPet();
pet.layEggs(); // okay
pet.swim();    // errors

// 由于联合类型 并不确定是哪个类型 一般访问了 没有的属性或方法 会报错
// 对此可以采用 类型断言
let pet = getSmallPet();

if ((<Fish>pet).swim) { // 不管是不是Fish类型 都断言成Fish类型 如没有swim方法 就表示pet不是Fish类型
    (<Fish>pet).swim();
}
else {
    (<Bird>pet).fly();
}
// 错误写法
if (pet.swim) { // 这样就直接报错了
    pet.swim();
}
else {
    pet.fly();
}

```

## 类型断言 as 
```typescript
有时候 程序员比ts更了解数据的类型 就可以用类型断言来告诉ts数据的类型

比如 const a  = document.getElementById('div1')  // a的类型是HTMLElement | null 但是我们知道a一定是HTMLElement类型

let someValue: any = "this is a string";

// as语法和尖括号语法 等价
let strLength: number = (someValue as string).length; // as语法   值 as 类型
let strLength: number = (<string>someValue).length; // 尖括号语法 <类型>值


当你在TypeScript里使用JSX时，类型断言仅支持as语法;
 
```

### 
## 交叉类型 &
```typescript

// 联合类型
let hi: 'hello' | '你好'; // 表示只能赋值 'hello' 或者 '你好'
let a: number | string  // 表示可以是number类型 也可以是string类型

// 约束对象
let a: {name: string, age: number}  // 表示只能赋值一个对象 而且必须有name字段 必须有age字段

// any类型
let a: any; // 表示可以赋值任意类型   any的应用场景 你实在不知道类型 就只能用 any
let a; // 表示隐式any

// 类型推导
let a = 1; // 类型推断为number

// unknown类型
let a: unknown; // 表示可以赋值任意类型 但是不能直接赋值给其他类型  unknown 应用场景 能用unknown就不用any

// 类型断言 as 
// 当一个变量在程序运行过程中  从 null 类型 变为 HTMLElement类型  
// 解决方法1 这个变量的类型就是 null | HTMLElement
// 解决方法2 这个变量的类型就是 any
// 解决方法3 用类型断言
const b = document.getElementById('test') as HTMLDivElement  // 程序员比ts更清楚 这是什么类型 就用as断言

类型断言 可以让 类型更加明确 但不是改变类型
比如 
interface Cat {
    name: string;
    run(): void;
}
interface Fish {
    name: string;
    swim(): void;
} 
function isFish(animal: Cat | Fish) {
    // 这里必须用 类型断言 否则报错
    if (typeof (animal as Fish).swim === 'function') {
        return true;
    }
    return false;
}

console.log(isFish({name:'cat',run:()=>{}}))
console.log(isFish({name:'fish',swim:()=>{}}))

// 类型断言只能欺骗ts编译器，无法避免运行时的错误，滥用类型断言 可能会导致运行时错误

s = b as string; // 方式1 as
s = <string>b;    // 方式2 <> 一般不用

有2种情况 建议用第二种情况   
    1默认情况下 null和undefined是所有类型的子类型 
      换句话说 null和undefined 可以赋值给任何类型 
    2在tsconfig.json中配置了 
      strictNullChecks: true 时 null和undefined只能赋值给void和它们自身




object 并不能约束 因为一切皆对象   需要用object的子类型来约束对象

let b: { name: string, age?: number }
b = { name: '1' }
b = { name: '1', age: 1 }
b = { name: '1', age: '1' } // 报错

let c: { name: string, [propName: string]: any } // 表示name字段必传 其他字段可选
c = { name: '1', a: 1, b: '1', c: true }


Function 也并不能约束函数 需要用它的子类型来约束函数 

let f: (a: number, b: number) => number;
f = function (a: number, b: number): number {
    return a + b
}

array 并不能约束数组 需要用它的子类型来约束数组

let a: []; // 表示任意数组 一般不用
let a: number[]   // 表示数字数组
let a: Array<number>   // 表示数字数组

a = [1, 2, 3]
let a: string[]  // 表示字符串数组
let a: boolean[]  // 表示布尔数组 
let a: (string | number)[]  // 表示字符串或者数字数组
let a: Array<string | number>  // 表示字符串或者数字数组


// 问 数组项是引用类型怎么约束？
let a: [string, number, boolean]  // 元祖 表示固定长度的数组
a = ['1', 1, true]

// 问 元祖的长度不固定怎么约束？
// 元祖 表示固定长度的数组    这是copilot给的答案 待验证
let a: [string, number, boolean, ...any[]]  



(function() { 
// 全局定义一个枚举类
enum Gender { male, female }
let g: Gender = Gender.male; // 赋一个初值 0 
console.log(g, Gender[g]); // 0 male  
g = 1 // 拿到后端的数据 1 
console.log(g, Gender[g]); // 1 female
})()






// 联合类型   | &
let a: string | number // 或  表示可以是string类型 也可以是number类型
a = '1'
a = 1
let b: {name: string} | {age: number} // 或  表示可以是{name: string}类型 也可以是{age: number}类型
b = {name: '1'}
let c: { name: string } & { age: number } // 与  表示{name: string}类型 且 {age: number}类型
c = {name: '1', age: 1}


// type 类型别名    在原生js中 声明一个变量是为了存储 值 而这里声明一个type 是为了存储类型
// 初步理解 type 就是一个变量 用来存储类型  普通变量用来存储数据  本质是可以复用
type hello = string 
let a: hello
a = '1'
a = 1 // 报错

type myType = 1 | 2 | 3 | 4 | 5
let a: myType
let b: myType
a = 1
a = 2
a = 6 // 报错


type myType = {name: string, age: number}
let a: myType
a = {name: '1', age: 1}

type Gender = 0 | 1;
type State = 'success' | 'error' | 'loading';
type Member = 0 | 1 | 2 | 3;
type Sum = { name: string } & { age: number }; // 交叉类型 必须同时满足两个类型的限制
type myType = { name: string, age: number } // 保存一个约束对象的类型 

let a: Gender = 1; // 满足其中一个即可
let b: Gender = 0;
let c: Gender = 1;

let s:Sum = { name: 'hello', age: 12 }; 

let obj: myType = { name: '小明', age: 18 } 



// 定义一个interface接口  期待有人实现这个接口
interface myInterface {
    name: string
    age: number
    say(): void
}



交叉类型是将多个类型合并为一个类型。
例如， Person & Serializable & Loggable同时是 Person 和 Serializable 和 Loggable。
 就是说这个类型的对象同时拥有了这三种类型的成员。

let a: number & string // a的类型是 number & string  也就是 a的类型是 number 和 string的交叉类型 也就是 a的类型是 never

我们大多是在混入（mixins）或其它不适合典型面向对象模型的地方看到交叉类型的使用。 
（在JavaScript里发生这种情况的场合很多！） 下面是如何创建混入的一个简单例子：

function extend<T, U>(first: T, second: U): T & U {
    let result = <T & U>{};
    for (let id in first) {
        (<any>result)[id] = (<any>first)[id];
    }
    for (let id in second) {
        if (!result.hasOwnProperty(id)) {
            (<any>result)[id] = (<any>second)[id];
        }
    }
    return result;
}
```



## 约束函数
```typescript
### 函数的类型

~~~ts
//注意，参数不能多传，也不能少传 必须按照约定的类型来
const fn = (name: string, age:number): string => {
    return name + age
}
fn('张三',18)
~~~

####  函数的可选参数? 

~~~ts
//通过?表示该参数为可选参数
const fn = (name: string, age?:number): string => {
    return name + age
}
fn('张三')
~~~
 



####  接口定义函数 

~~~ts
//定义参数 num 和 num2  ：后面定义返回值的类型
interface Add {
    (num:  number, num2: number): number
}

// 函数必须有俩参数num，num2 ，且返回值必须为number类型
const fn = (num: number, num2: number): number => {
    return num + num2
}
fn(5, 5)

const fn1: Add = (num, num2) => {
    return num + num
}
fn1(5, 5)
 
 

interface User{
    name: string;
    age: number;
}
// 参数user必须是个对象且含俩键值对name，age 发回值页必须为对象且含俩键值对name，age
function getUserInfo(user: User): User {
  return user
}
getUserInfo({name: 'Tom', age: 18})
~~~



####  定义剩余参数 

~~~ts
const fn = (array: number[], ...items: string[]): any[] => {
       console.log(array, items)
       return items
}

let a:number[] = [1, 2, 3]

fn(a, '4', '5', '6')
~~~



```

## 
## 数组
```typescript

```

### Object类型 Object
```typescript

    // 经过测试 Object和object是一样的
    Object => 字面量： {a:1,b:'2',c:true}  // 表示 只能赋值为 {a:1,b:'2',c:true} 
                      { name: string }  // 表示 可以赋值为   { name: '3123' }
                      { name: string, [key: string]: any}  
// 表示 可以赋值为  { name: 'hello', age: '12', sex: '男' }  


### 对象的类型

> 在typescript中，我们定义对象的方式要用关键字**interface**（接口），
>
> 使用**interface**来定义一种约束，让数据的结构满足约束的格式。


 
#### interface 合并 & 继承

~~~ts
//重名interface  可以合并
interface A{ name: string }
interface A{ age: number }
var x: A = { name: 'xx', age: 20 }



//继承
interface AA{
    name:string;
}
 
interface BB extends AA{ // 此时BB既有age又有number
    age:number;
}
 
let obj:BB = {
    age:18,
    name:"string"
}
~~~

#### 可选属性 使用?操作符

~~~ts
// 可选属性的含义是该属性可以不存在
interface Person {
    b?:string;
    a:string
}

// 所以说这样写也是没问题的
const person:Person  = {
    a:"213"
}
~~~

#### 任意属性 [propName: string]

==需要注意的是，**一旦定义了任意属性，那么确定属性和可选属性的类型都必须是它的类型的子集**==

~~~ts
//在这个例子当中我们看到接口中并没有定义C但是并没有报错
//应为我们定义了[propName: string]: any;
//允许添加新的任意属性
interface Person {
    [propName: string]: any;
    a:string;
}
 
const person:Person  = {
    a:"213",
    c:"123"
}
-------------------------------------
interface Person {
    // 若此interface定义为 string 则该接口全应该为string类型 
    // 可改为[propName: string]: string | number; 
    [propName: string]: string; 
    a:number, // 报错
}
 
const person:Person = {
    a:"213",
    c:"123"
}
~~~

#### 只读属性 readonly

 readonly 只读属性是不允许被赋值的只能读取 

~~~ts
//这样写是会报错的
//应为a是只读的不允许重新赋值
interface Person {
    b?: string;
    readonly a: string; // 只读
    [propName: string]: any;
}
 
const person: Person = {
    a: "213",
    c: "123"
}
 
person.a = 123 // 报错
~~~

#### 添加函数

~~~ts
// 注意此处俩 void 表达意义不一样
interface Person {
    cb():void; // 声明函数
}
 
const person: Person = {
    // 这个 void 表示不能有返回值
    cb:        ():void => {  console.log(123) }
}
~~~


```



### symbols
```typescript

```

### 迭代器和生成器
```typescript

```

### 命名空间
```typescript

```

> utils/validator.ts // 验证器 验证用户表单输入的数据
>

```typescript
interface StringValidator {
    isAcceptable(s: string): boolean;
}

let lettersRegexp = /^[A-Za-z]+$/;
let numberRegexp = /^[0-9]+$/;

class LettersOnlyValidator implements StringValidator {
    isAcceptable(s: string) {
        return lettersRegexp.test(s);
    }
}

class ZipCodeValidator implements StringValidator {
    isAcceptable(s: string) {
        return s.length === 5 && numberRegexp.test(s);
    }
}

// 尝试一些例子
let strings = ["Hello", "98052", "101"];
 
let validators: { [s: string]: StringValidator; } = {};
validators["ZIP code"] = new ZipCodeValidator();
validators["Letters only"] = new LettersOnlyValidator();

// 显示每个字符串是否通过了每个验证器
for (let s of strings) {
    for (let name in validators) {
        let isMatch = validators[name].isAcceptable(s);
        console.log(`'${ s }' ${ isMatch ? "matches" : "does not match" } '${ name }'.`);
    }
}
```

### 使用命名空间的验证器
> Validation.ts
>

```typescript
namespace Validation {
    export interface StringValidator { 
        isAcceptable(s: string): boolean;
    }

    const lettersRegexp = /^[A-Za-z]+$/;
    const numberRegexp = /^[0-9]+$/;

    export class LettersOnlyValidator implements StringValidator {
        isAcceptable(s: string) {
            return lettersRegexp.test(s);
        }
    }

    export class ZipCodeValidator implements StringValidator {
        isAcceptable(s: string) {
            return s.length === 5 && numberRegexp.test(s);
        }
    }
}

// Some samples to try
let strings = ["Hello", "98052", "101"];

// Validators to use
let validators: { [s: string]: Validation.StringValidator; } = {};
validators["ZIP code"] = new Validation.ZipCodeValidator();
validators["Letters only"] = new Validation.LettersOnlyValidator();

// Show whether each string passed each validator
for (let s of strings) {
    for (let name in validators) {
        console.log(`"${ s }" - ${ validators[name].isAcceptable(s) ? "matches" : "does not match" } ${ name }`);
    }
}
```

### 多文件的命名空间
```typescript
当应用越来越大时候 需要把代码分离到不同文件得以维护

把Validation命名空间分割到多个文件中 尽管是不同文件 它们仍然是同一个命名空间 
通过引用标签 <reference path="Validation.ts" /> 来告诉编译器文件之间的关联关系

// Validation.ts 文件一
namespace Validation {
    export interface StringValidator {
        isAcceptable(s: string): boolean;
    }
}
// LettersOnlyValidator.ts 文件二
/// <reference path="Validation.ts" />
namespace Validation {
    const lettersRegexp = /^[A-Za-z]+$/;
    export class LettersOnlyValidator implements StringValidator {
        isAcceptable(s: string) {
            return lettersRegexp.test(s);
        }
    }
}
// ZipCodeValidator.ts 文件三
/// <reference path="Validation.ts" />
namespace Validation {
    const numberRegexp = /^[0-9]+$/;
    export class ZipCodeValidator implements StringValidator {
        isAcceptable(s: string) {
            return s.length === 5 && numberRegexp.test(s);
        }
    }
}
// Test.ts 文件四
/// <reference path="Validation.ts" />
/// <reference path="LettersOnlyValidator.ts" />
/// <reference path="ZipCodeValidator.ts" />

// Some samples to try
let strings = ["Hello", "98052", "101"];

// Validators to use
let validators: { [s: string]: Validation.StringValidator; } = {};
validators["ZIP code"] = new Validation.ZipCodeValidator();
validators["Letters only"] = new Validation.LettersOnlyValidator();

// Show whether each string passed each validator
for (let s of strings) {
    for (let name in validators) {
        console.log(`"${ s }" - ${ validators[name].isAcceptable(s) ? "matches" : "does not match" } ${ name }`);
    }
}


当分离为多个文件时候 方式一可以用 --outFile标记 来指定输出的文件名
tsc --outFile sample.js Test.ts  // 把多个文件编译为一个文件

方式二 单独每个文件编译对应的js文件 然后在html中用 script标签引入js文件

```

### 使用别名来简化命名空间的访问
```typescript
namespace Shapes {
    export namespace Polygons {
        export class Triangle { }
        export class Square { }
    }
}
// 这里 import polygons 和 var polygons 类似 但是import 还适用于 存储 类型和导入具有命名空间含义的符号 import会生成不同的引用
// 不要和 import x = require('xxx') 混淆了 
// 这里是给指定的符号创建一个别名 用来简化命名空间的访问 
// 你可以用这种方法为任意标识符创建别名，也包括导入的模块中的对象。
import polygons = Shapes.Polygons;
let sq = new polygons.Square(); // Same as "new Shapes.Polygons.Square()"
```

### 命名空间使用其他js库
```typescript
为了描述不是用TypeScript编写的类库的类型，我们需要声明类库导出的API。 
由于大部分程序库只提供少数的顶级对象，命名空间是用来表示它们的一个好办法。
我们称其为声明是因为它不是外部程序的具体实现。 我们通常在 .d.ts里写这些声明。
 如果你熟悉C/C++，你可以把它们当做 .h文件。 让我们看一些例子。

 使用外部命名空间   .d.ts文件 叫声明文件

// D3.d.ts 
declare namespace D3 {
    export interface Selectors {
        select: {
            (selector: string): Selection;
            (element: EventTarget): Selection;
        };
    }

    export interface Event {
        x: number;
        y: number;
    }

    export interface Base extends Selectors {
        event: Event;
    }
}
declare var d3: D3.Base; 
```



### 模块
> 导出 export形式
>

```typescript
// 任何声明（比如变量，函数，类，类型别名或接口）都能够通过添加export关键字来导出。
class ZipCodeValidator implements StringValidator {
    isAcceptable(s: string) {
        return s.length === 5 && numberRegexp.test(s);
    }
}
export { ZipCodeValidator }; // 导出
export { ZipCodeValidator as mainValidator }; // 导出并重命名


export class ParseIntBasedZipCodeValidator {
    isAcceptable(s: string) {
        return s.length === 5 && parseInt(s).toString() === s;
    }
}

// 另一个文件中ZipCodeValidator 已经导出了  这个文件进行 重新导出
export { ZipCodeValidator as RegExpBasedZipCodeValidator} from "./ZipCodeValidator";
// 或者 这样 把多个文件的导出 在这个文件中重新导出
export * from "./StringValidator"; // exports interface StringValidator
export * from "./LettersOnlyValidator"; // exports class LettersOnlyValidator
export * from "./ZipCodeValidator";  // exports class ZipCodeValidator  
```

> 导入 import形式
>

```typescript
import { ZipCodeValidator } from "./ZipCodeValidator";

import { ZipCodeValidator as ZCV } from "./ZipCodeValidator";
import "./my-module.js";
import * as validator from "./ZipCodeValidator";

let myValidator = new ZipCodeValidator();
let myValidator = new ZCV();

// 默认导出
export default class ZipCodeValidator {
    // ...
}
// 如果一个文件只有一个导出 就用默认导出 而且默认导出在文件顶部 



```

### export = 和 import = require()
```typescript
 
在es module中 默认导出 export default  和 CommonJS中的 exports 变量 作用类似
但是 export default 语法并不能兼容CommonJS和AMD的exports。
那么 在 TS 中 为了兼容CommonJS和AMD的exports, TS 新增提供了export = 语法。

// 导出  
export = ZipCodeValidator; 

// 导入
import zip = require("./ZipCodeValidator"); 

```

### 外部模块使用其他的js库
```typescript
在ts中 引用其他 非ts的js库 又如何进行类型检查呢？

我们需要在ts中声明 该js库所暴露的API 也就是声明文件 才可以使用这个js库提供的API
我们通常在 .d.ts 文件中写声明文件 这类似于 c++的.h文件 头文件

// 举个例子 
// node.d.ts

// node中有 url模块 可以直接使用 在ts中也可以直接使用 但是ts并不知道 url模块的类型 所以ts会报错 
// 我们需要在ts中声明 url模块的类型 才可以使用
declare module "url" {
    export interface Url {
        protocol?: string;
        hostname?: string;
        pathname?: string;
    }

    export function parse(urlStr: string, parseQueryString?, slashesDenoteHost?): Url;
}

declare module "path" {
    export function normalize(p: string): string;
    export function join(...paths: any[]): string;
    export let sep: string;
}

// 以上就是 node.d.ts 文件的内容

// 下面 我们可以使用 node.d.ts 文件中声明的类型了

/// <reference path="node.d.ts"/>
import * as URL from "url";
let myUrl = URL.parse("http://www.typescriptlang.org");



 
```

### 外部模块简写
```typescript
// declarations.d.ts 
declare module "hot-new-module";  // 简写的话 默认就是 any 类型

// 现在我们可以正常地使用这个模块了
import x, {y} from "hot-new-module";
```

### 模块声明通配符
```typescript
declare module "*!text" {
    const content: string;
    export default content;
} 
declare module "json!*" {
    const value: any;
    export default value;
}
// * 表示所有
import fileContent from "./xyz.txt!text";
import data from "json!http://example.com/data.json";
console.log(data, fileContent);
```

### 创建模块结构指导
```typescript

如果仅导出单个 class 或 function，使用 export default ,不管是 export 或是 export default 都尽可能的在模块顶层导出，不要嵌套。

模块里面不要使用命名空间

```

## 命名空间和模块
```typescript
命名空间 就是 内部模块
模块 就是 外部模块

 
```

### 使用命名空间
```typescript

命名空间是位于全局命名空间下的一个普通的带有名字的JavaScript对象。
这令命名空间十分容易使用。 它们可以在多文件中同时使用，
并通过 --outFile结合在一起。 
命名空间是帮你组织Web应用不错的方式，
你可以把所有依赖都放在HTML页面的 <script>标签里。

但就像其它的全局命名空间污染一样，
  它很难去识别组件之间的依赖关系，尤其是在大型的应用中。
```

### 使用模块
```typescript

像命名空间一样，模块可以包含代码和声明。 不同的是模块可以 声明它的依赖。

模块会把依赖添加到模块加载器上（例如CommonJs / Require.js）。 
对于小型的JS应用来说可能没必要，但是对于大型应用，这一点点的花费会带来长久的模块化和可维护性上的便利。
 模块也提供了更好的代码重用，更强的封闭性以及更好的使用工具进行优化。

对于Node.js应用来说，模块是默认并推荐的组织代码的方式。

从ECMAScript 2015开始，模块成为了语言内置的部分，
应该会被所有正常的解释引擎所支持。 因此，对于新项目来说推荐使用模块做为组织代码的方式。
```

### 使用命名空间和使用模块的陷阱
```typescript
引用模块应该用 import而不是 /// <reference>

import 'xxx/xxxx' 
import x from 'xxx'
import xxx = require('xxx/xxxx')
// 编译器首先尝试去查找相应路径下的.ts，.tsx再或者.d.ts。 
// 如果这些文件都找不到，编译器会查找 外部模块声明。
//  回想一下，它们是在 .d.ts文件里声明的。



// 不必要的命名空间
```

### 模块解析
```typescript
// 下面是相对路径引入的例子   一般是自己写的模块
import Entry from "./components/Entry";
import { DefaultHeaders } from "../constants/http";
import "/mod";

// 下面是非相对路径引入的例子 一般是第三方模块
import * as $ from "jQuery";
import { Component } from "@angular/core";
```

### 模块解析策略
```typescript
模块解析策略
```

### Classic 策略
```typescript
// 相对路径导入
import x from '/root/src/folder/A.ts'
// '/root/src/folder/A.ts' 这里文件里面的 import { b } from "./moduleB"的查找流程是

// 先找 /root/src/folder/moduleB.ts 
// 再找 /root/src/folder/moduleB.d.ts 

// 非相对路径导入
import x from 'moduleA'
// 假如 moduleA里面有一句 import { b } from "moduleB"

// /root/src/folder/moduleB.ts
// /root/src/folder/moduleB.d.ts
// /root/src/moduleB.ts
// /root/src/moduleB.d.ts
// /root/moduleB.ts
// /root/moduleB.d.ts
// /moduleB.ts
// /moduleB.d.ts
```

### Node 策略
```typescript
// 相对路径导入 
import x from '/root/src/folder/A.ts'
// '/root/src/folder/A.ts' 这里文件里面的  var x = require("./moduleB"); 的查找流程是

// 1 检查/root/src/moduleB.js文件是否存在。

// 2 检查/root/src/moduleB目录是否包含一个package.json文件，
    // 且package.json文件指定了一个"main"模块。 
    // 在我们的例子里，如果Node.js发现文件 /root/src/moduleB/package.json包含了{ "main": "lib/mainModule.js" }，
    // 那么Node.js会引用/root/src/moduleB/lib/mainModule.js。

// 3 检查/root/src/moduleB目录是否包含一个index.js文件。 这个文件会被隐式地当作那个文件夹下的"main"模块。

// 非相对路径导入
import x from 'moduleA'
// 假如 moduleA里面有一句  var x = require("moduleB"); 

// /root/src/node_modules/moduleB.js
// /root/src/node_modules/moduleB/package.json (如果指定了"main"属性)
// /root/src/node_modules/moduleB/index.js

// /root/node_modules/moduleB.js
// /root/node_modules/moduleB/package.json (如果指定了"main"属性)
// /root/node_modules/moduleB/index.js

// /node_modules/moduleB.js
// /node_modules/moduleB/package.json (如果指定了"main"属性)
// /node_modules/moduleB/index.js

// 它会查找 上一级目录的node_modules文件夹 一直到根目录的node_modules文件夹
```

### TS如何解析模块
> 和node策略差不多
>

```typescript
// 相对路径导入 
import x from '/root/src/folder/A.ts'
// '/root/src/folder/A.ts' 这里文件里面的  import { b } from "./moduleB" 的查找流程是

// /root/src/moduleB.ts
// /root/src/moduleB.tsx
// /root/src/moduleB.d.ts
// /root/src/moduleB/package.json (如果指定了"types"属性)
// /root/src/moduleB/index.ts
// /root/src/moduleB/index.tsx
// /root/src/moduleB/index.d.ts

// 非相对路径导入
import x from 'moduleA'
// 假如 moduleA里面有一句 import { b } from "moduleB"  
 

/root/src/node_modules/moduleB.ts
/root/src/node_modules/moduleB.tsx
/root/src/node_modules/moduleB.d.ts
/root/src/node_modules/moduleB/package.json (如果指定了"types"属性)
/root/src/node_modules/moduleB/index.ts
/root/src/node_modules/moduleB/index.tsx
/root/src/node_modules/moduleB/index.d.ts

/root/node_modules/moduleB.ts
/root/node_modules/moduleB.tsx
/root/node_modules/moduleB.d.ts
/root/node_modules/moduleB/package.json (如果指定了"types"属性)
/root/node_modules/moduleB/index.ts
/root/node_modules/moduleB/index.tsx
/root/node_modules/moduleB/index.d.ts

/node_modules/moduleB.ts
/node_modules/moduleB.tsx
/node_modules/moduleB.d.ts
/node_modules/moduleB/package.json (如果指定了"types"属性)
/node_modules/moduleB/index.ts
/node_modules/moduleB/index.tsx
/node_modules/moduleB/index.d.ts


// 和node一样 它会查找 上一级目录的node_modules文件夹 一直到根目录的node_modules文件夹
// 只不过它会查找 .ts .tsx .d.ts .json .ts .tsx .d.ts文件 node是 .js .json 

```



### 声明合并
```plain
“声明合并”是指编译器将针对同一个名字的两个独立声明合并为单一声明。 
合并后的声明同时拥有原先两个声明的特性。 任何数量的声明都可被合并；不局限于两个声明。

编译器 不是 编辑器 这两者完全不一样
```

### 合并接口
```typescript
interface Box {
    height: number;
    width: number;
}

interface Box {
    scale: number;
}
// 如果两个接口中同时声明了同名的非函数成员且它们的类型不同，则编译器会报错。
let box: Box = {height: 5, width: 6, scale: 10};


// 对于函数成员，每个同名函数声明都会被当成这个函数的一个重载。 
// 同时需要注意，当接口 A与后来的接口 A合并时，后面的接口具有更高的优先级。
interface Cloner {
    clone(animal: Animal): Animal;
}

interface Cloner {
    clone(animal: Sheep): Sheep;
}

interface Cloner {
    clone(animal: Dog): Dog;
    clone(animal: Cat): Cat;
}
interface Cloner {
    clone(animal: Dog): Dog;
    clone(animal: Cat): Cat;
    clone(animal: Sheep): Sheep;
    clone(animal: Animal): Animal;
}

```

### 合并命名空间
```plain
namespace Animals {
    export class Zebra { }
}

namespace Animals {
    export interface Legged { numberOfLegs: number; }
    export class Dog { }
}
// 上面两个 命名空间合并后 
namespace Animals {
    export interface Legged { numberOfLegs: number; }

    export class Zebra { }
    export class Dog { }
}
// 即使合并了 对于非导出成员 仍然无法访问
```

### 合并命名空间和类
```typescript
class Album {
    label: Album.AlbumLabel;
}
namespace Album {
    export class AlbumLabel { }
}
```

## namespace 命名空间
```typescript

```



