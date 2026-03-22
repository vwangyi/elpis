
## 枚举

- 定义枚举类型的变量
```ts
// 先定义枚举类
enum Gender { male = 0, female = 1 }; // 默认是 数字枚举 

let g: Gender = Gender.male; // 只能赋值 Gender.male 或 Gender.female 或对应的数字  


enum Member { vip = 'vip', svip = 'svip' }; // 字符串枚举 

let m: Member = Member.vip;
let m1: Member = Member.svip;

 
```