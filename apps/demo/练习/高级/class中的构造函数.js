class Dog {
  // 构造函数(初始化阶段, 只在new的时候运行了一次)
  constructor(name) {
    this.name = name;
  }

  static sayHi() {
    console.log('Hi, 我是' + this.name);
  }
}

const wangcai = new Dog('旺财');
wangcai.sayHi();
