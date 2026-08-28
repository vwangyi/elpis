
## 1. 手写 防抖节流
```js

```
## 2. 手写 instanceof原理
```js

```
## 3. 手写 new操作符原理
```js

```
## 4. 手写 call/bind/apply
```js

``` 
## 5. 考察this指向，输出什么
```js
const a = {
    b: {
        c: function() {
            console.log(this)
            return this
        }
    }
}
console.log(a.b.c() === a.b)
const d = a.b.c;
console.log(d() === window)
``` 

## 6. 考察变量提升，输出什么
```js
var a = 1;
function a() {
    console.log(a);
    let a = 2;
}
console.log(a);
a();
``` 


