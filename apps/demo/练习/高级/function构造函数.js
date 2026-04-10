// 大驼峰命名
function Dog(name) {
  this.name = name;
}

Dog.prototype.sayHi = function () {
  console.log('Hi, 我是' + this.name);
};

for (let i = 0; i < 10; i++) {
  const wangcai = new Dog('旺财');
  wangcai.sayHi();
}
