# namespace

```ts
namespace MyNamespace {
    export interface Person {
        name: string;
        age: number;
    }

    export function greet(person: Person): string {
        return `Hello, ${person.name}!`;
    }
}

const user: MyNamespace.Person = { name: "Alice", age: 30 };
console.log(MyNamespace.greet(user));
```

```ts
// “内部模块”现在称做“命名空间”。 
// “外部模块”现在则简称为“模块”，
// 这是为了与 ECMAScript 2015里的术语保持一致，
//  也就是说 module X { 相当于现在推荐的写法 namespace X { 
// 这意味着 任何使用 module关键字来声明一个内部模块的地方都应该使用namespace关键字来替换。 

// 命名空间 往往都有 内部模块的意思 和 vuex中一样

如何使用命名空间 （如何使用内部模块）
 
```