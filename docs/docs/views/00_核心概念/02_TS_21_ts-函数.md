## 函数

- 定义函数的类型 
- 函数是给 参数和返回值 设置类型
```ts 
function sum(aa: number, bb: number, c?: boolean): string {
  return aa + bb + '';
}

var fn: (a: number, b: number) => string;

fn = sum; // 可以


sum(1, 2);






```

####  函数重载 

> 重载是`方法名字相同`，而`参数不同`，返回类型可以相同也可以不同。
>
> **<u>如果参数类型不同，则参数类型应设置为 any。</u>**
>
> 参数数量不同你可以将不同的参数设置为可选。

~~~ts
// 上面俩个是重载函数  ， 下面那个是执行函数

function fn(params: number): void
function fn(params: string, params2: number): void
function fn(params: any, params2?: any): void {
    console.log(params)
    console.log(params2)
}
 
fn(123) // 执行第一套规则
 
fn('123',456) // 执行第二套规则
~~~
