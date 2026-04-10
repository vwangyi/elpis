// const arr = [];

// 静态方法
// Array.from();
// Object.keys() / values()

class Dog {
  // 不用实例的时候
  // 还想给类增加一个工具方法
  static logNameLength(name) {
    return name.length;
  }
  static NAME = '狗';
  sayHi() {
    console.log('汪汪');
  }
}

console.log(Dog.logNameLength('旺财')); // 2
console.log(Dog.NAME); // '狗'
