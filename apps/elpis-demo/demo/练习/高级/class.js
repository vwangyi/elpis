// // 大驼峰AaaBbbCcc
// class Phone {

//     // 构造函数
//     // 初始化函数
//     constructor(name) {
//         this.name = name;
//     }

//     // 属性
//     name = 'IPhone';

//     // 方法
//     callSomeone(phoneNum) {
//         // console.log('正在呼叫' + phoneNum);
//         console.log(this);
//     }

//     // callSomeone = (phoneNum) => {
//     //     // console.log('正在呼叫' + phoneNum);
//     //     console.log(this);
//     // }

// }

// const phone1 = new Phone('zs'); // 新对象
// phone1.callSomeone(13012341234); // 正在呼叫13012341234

// 继承
// 父类
class Animal {
  constructor(name) {
    this.name = name
  }
  skin = '毛'
  hasEye = true
  walk() {
    console.log('溜达')
  }
}

// 子类
class Dog extends Animal {
  // constructor(name) {
  //     super();
  //     this.name = name;
  // }
  sayHi() {
    console.log('汪汪' + this.name)
  }
}

class Cat extends Animal {
  // constructor(name) {
  //     super();
  //     this.name = name;
  // }
  sayHi() {
    console.log('喵喵' + this.name)
  }
}

const wangcai = new Dog('旺财')
const zhaocai = new Cat('招财')

wangcai.sayHi()
zhaocai.sayHi()
