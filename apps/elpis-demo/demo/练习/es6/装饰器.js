// 装饰者模式
function dec(Klass) {
  return class extends Klass {
    sayHello() {
      console.log('hello')
    }
  }
}

// es7装饰器语法
@dec
class Animal {
  sayHi(msg) {
    console.log(msg)
  }
}

// 普通写法
const Animal = dec(
  class {
    sayHi(msg) {
      console.log(msg)
    }
  },
)

const dog = new Animal()
dog.sayHi('wangwang!')

const cat = new Animal()
cat.sayHi('miaomiao')
dog.sayHello()
cat.sayHello()
