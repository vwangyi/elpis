# class


## 公共成员
- public 关键字 


## 私有成员
- private 关键字 


## 保护成员
- protected 关键字 


## 只读成员
- readonly 关键字 


## 静态成员
- static 关键字


## 实例成员 

## 
```js
class Person {
    public name: string = ''; // 公共变量 只能赋值字符串
    private name: string = ''; // 私有变量 只能赋值字符串
    protected name: string = ''; // 受保护变量 只能赋值字符串
    readonly name1: string = '孙悟空'; // 只读变量 只能赋值字符串 

    static name: string = ''; // 静态属性 只能赋值字符串
    static readonly age: number = 0; // 静态 只读属性 只能赋值number


    constructor(public name: string, public age: number) { // 可以把变量定义在 参数里面
        console.log(this.name) // this就指向 实例对象
    }

    static say(): void {

    } 

    #name: string = 's';
    // TS中s设置getter的方式
    get name12123() {
        return this.#name; 
    }
    set name12323(value: string) {
        this.#name = value;
    }
}
```
