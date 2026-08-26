
## ts的this
```ts

1. 写对象字面量里面的属性和方法 那么方法的this推导是any 
2. 写类里面的属性和方法 那么方法的this是当前对象

尽管两种方式的推导是any或当前对象 也不能确定就是，还是是根据调用方式来决定this是谁
```

## 
```ts
// 配置 noImplicitThis为true 表示不允许存在自动推导的隐式any 
interface IUser {
  name: string,
  age: number,
  sayHello(this: IUser): void
}
const u: IUser = {
  name: 'sdf',
  age: 33,
  sayHello() {
    console.log(this.name, this.age);
  }
}
const res = u.sayHello()
const say = u.sayHello;
say() // 报错 因为我定义接口时 this只能是Iuser类型 不能是其他类型 防止调用者错误调用使用this 
```

## 
```ts
class User {
  name = 'asdf'
  age = 12
  sayHello(this: User) { // 该this参数只是ts用于约束this 不是真正的js参数
    console.log(this.name, this.age)
  }
}
const u = new User()
const res = u.sayHello();
const say = u.sayHello;
say() // 报错 因为我定义接口时 this只能是Iuser类型 不能是其他类型 防止调用者错误调用使用this 

```