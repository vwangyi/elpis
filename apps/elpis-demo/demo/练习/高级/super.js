// 继承
// 父类
class Animal {
  constructor(name) {
    this.name = name
  }
  skin = '毛'
  eye = '眼睛'
  hasEye = true
  walk() {
    console.log('溜达')
  }
  sayHi() {
    console.log('嘤嘤' + this.name)
  }
}

// 子类
class Dog extends Animal {
  constructor(name, x) {
    // 调用父类的构造函数constructor
    super(name)
  }
  sayHi() {
    console.log('汪汪' + this.name)
  }
  sayHello() {
    // 调用父类的同名方法
    super.sayHi()
    // super.walk();
    // this.walk();
  }
}

const wangcai = new Dog('旺财', 123)

wangcai.sayHello()
