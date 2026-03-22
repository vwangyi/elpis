在 JavaScript 中，**生成器函数**是一种特殊类型的函数，它可以**暂停执行**并在稍后**恢复执行**，同时**保持上下文状态**。生成器函数使用 `function*` 语法定义，并通过 `yield` 关键字控制执行流程。


## 是什么 
- 生成器函数 可以暂停执行和恢复执行, 并保持上下文状态。通过 function* + yield 方式实现。

第几次调用next 执行的是生成器函数的第几次yield 之前的代码 传入的参数是yield返回值 
迭代器对象第一次调用next 传递的参数没有意义 如果需要传参 就放到第二步








## 声明

```js 
function* xx() {
  yield 1;
  yield 1;
  yield 1;
} 
let gennerator = function* () {}

const obj = {
    * [Symbol.iterator]() {
        yield 1;
        yield 2;
        yield 3; 
    },
    * xixi() {
      yield 1; 
    },
    haha: function* () {
      yield 1;
    }
} 
class test {
  static * haha() {
        yield 1;
        yield 1;
        yield 1;

  }
    * test() {
        yield 1;
        yield 1;
        yield 1;
    }
}

```


## 📌 **基本语法**




```javascript
// 定义生成器函数
function* generatorFunction() {
  yield '第一次暂停';
  yield '第二次暂停';
  return '结束';
}

// 创建生成器对象
const generator = generatorFunction();

console.log(generator.next())
console.log(generator.next())
console.log(generator.next())
console.log(generator.next())
console.log(generator.next())
console.log(generator.next())



const obj = {
  *[Symbol.iter]
}
```

## 🔄 **执行流程控制**

### **`yield`** - 暂停执行并返回值
```javascript
function* simpleGenerator() {
  console.log('开始执行');
  yield '第一次 yield';
  console.log('恢复执行');
  yield '第二次 yield';
  return '生成器结束';
}

const gen = simpleGenerator();

console.log(gen.next()); // 开始执行 → { value: '第一次 yield', done: false }
console.log(gen.next()); // 恢复执行 → { value: '第二次 yield', done: false }
console.log(gen.next()); // { value: '生成器结束', done: true }
```

### **`next(value)`** - 恢复执行并传入值
```javascript
function* twoWayGenerator() {
  const name = yield '请输入你的名字：';
  const age = yield `你好 ${name}，请输入你的年龄：`;
  return `${name} 今年 ${age} 岁`;
}

const gen = twoWayGenerator();

console.log(gen.next());        // { value: '请输入你的名字：', done: false }
console.log(gen.next('小明'));   // { value: '你好 小明，请输入你的年龄：', done: false }
console.log(gen.next(25));      // { value: '小明 今年 25 岁', done: true }
```

## 🌟 **核心特性**

### 1. **惰性求值（按需生成）**
```javascript
function* infiniteNumbers() {
  let num = 1;
  while (true) {
    yield num++;
  }
}

const numbers = infiniteNumbers();
console.log(numbers.next().value); // 1
console.log(numbers.next().value); // 2
console.log(numbers.next().value); // 3
// 永远不会结束，只在需要时生成
```

### 2. **状态保持**
```javascript
function* counter() {
  let count = 0;
  while (true) {
    const reset = yield count++;
    if (reset) {
      count = 0;
    }
  }
}

const countGen = counter();
console.log(countGen.next().value);  // 0
console.log(countGen.next().value);  // 1
console.log(countGen.next().value);  // 2
console.log(countGen.next(true).value); // 0（重置）
console.log(countGen.next().value);  // 1
```

### 3. **可迭代对象**
```javascript
function* range(start, end) {
  for (let i = start; i <= end; i++) {
    yield i;
  }
}

// 使用 for...of
for (const num of range(1, 5)) {
  console.log(num); // 1, 2, 3, 4, 5
}

// 使用展开运算符
const nums = [...range(1, 3)]; // [1, 2, 3]
```

## 🔧 **生成器方法**

### **`return(value)`** - 提前结束生成器
```javascript
function* numbers() {
  yield 1;
  yield 2;
  yield 3;
}

const gen = numbers();
console.log(gen.next());        // { value: 1, done: false }
console.log(gen.return('提前结束')); // { value: '提前结束', done: true }
console.log(gen.next());        // { value: undefined, done: true }
```

### **`throw(error)`** - 向生成器抛出异常
```javascript
function* errorGenerator() {
  try {
    yield '正常执行';
    yield '这行不会执行';
  } catch (error) {
    yield `捕获到错误：${error.message}`;
  }
}

const gen = errorGenerator();
console.log(gen.next());                // { value: '正常执行', done: false }
console.log(gen.throw(new Error('测试'))); // { value: '捕获到错误：测试', done: false }
console.log(gen.next());                // { value: undefined, done: true }
```

## 💡 **实用场景**

### 1. **实现异步流程控制**
```javascript
function* fetchUserData() {
  try {
    const user = yield fetch('/api/user').then(res => res.json());
    const posts = yield fetch(`/api/posts/${user.id}`).then(res => res.json());
    return { user, posts };
  } catch (error) {
    console.error('获取数据失败:', error);
  }
}

// 运行生成器
function run(generator) {
  const gen = generator();
  
  function handle(result) {
    if (result.done) return Promise.resolve(result.value);
    
    return Promise.resolve(result.value)
      .then(res => handle(gen.next(res)))
      .catch(err => handle(gen.throw(err)));
  }
  
  return handle(gen.next());
}

run(fetchUserData).then(data => console.log(data));
```

### 2. **状态机**
```javascript
function* trafficLight() {
  while (true) {
    yield '🔴 红灯 - 停止';
    yield '🟡 黄灯 - 准备';
    yield '🟢 绿灯 - 通行';
    yield '🟡 黄灯 - 准备';
  }
}

const light = trafficLight();
setInterval(() => {
  console.log(light.next().value);
}, 2000);
```

### 3. **数据流处理**
```javascript
function* batchProcessor(data, batchSize) {
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize);
    yield batch;
  }
}

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const processor = batchProcessor(data, 3);

for (const batch of processor) {
  console.log('处理批次:', batch);
  // 输出：
  // 处理批次: [1, 2, 3]
  // 处理批次: [4, 5, 6]
  // 处理批次: [7, 8, 9]
  // 处理批次: [10]
}
```

### 4. **递归遍历**
```javascript
function* traverseTree(node) {
  yield node.value;
  
  if (node.children) {
    for (const child of node.children) {
      yield* traverseTree(child); // 使用 yield* 委托给另一个生成器
    }
  }
}

const tree = {
  value: '根节点',
  children: [
    {
      value: '子节点1',
      children: [
        { value: '孙节点1-1' },
        { value: '孙节点1-2' }
      ]
    },
    { value: '子节点2' }
  ]
};

for (const value of traverseTree(tree)) {
  console.log(value); // 深度优先遍历所有节点
}
```

## 🔄 **`yield*` 委托**

`yield*` 可以将执行权委托给另一个生成器或可迭代对象：

```javascript
function* generatorA() {
  yield 'A1';
  yield 'A2';
}

function* generatorB() {
  yield 'B1';
  yield* generatorA(); // 委托给 generatorA
  yield 'B2';
}

function* combinedGenerator() {
  yield* [1, 2, 3];    // 委托给数组
  yield* 'abc';        // 委托给字符串
  yield* generatorB(); // 委托给生成器
}

console.log([...combinedGenerator()]); 
// [1, 2, 3, 'a', 'b', 'c', 'B1', 'A1', 'A2', 'B2']
```

## 🆚 **与普通函数的区别**

| 特性 | 普通函数 | 生成器函数 |
|------|----------|------------|
| **定义** | `function func()` | `function* generator()` |
| **执行** | 一次性执行完 | 可暂停和恢复 |
| **返回值** | 单个值 | 多个值（通过 yield） |
| **返回类型** | 具体值 | 生成器对象 |
| **状态** | 无状态 | 保持内部状态 |
| **调用** | `func()` | `generator()` 返回迭代器 |

## 🎯 **总结**

生成器函数的核心价值：

1. **暂停与恢复**：可以在任意点暂停执行，稍后恢复
2. **双向通信**：通过 `yield` 传出值，通过 `next()` 传入值
3. **惰性求值**：按需生成值，节省内存
4. **简化异步**：可以用同步的方式写异步代码
5. **状态保持**：函数内部状态被保留

生成器是实现**协程（Coroutine）**的基础，是 JavaScript 异步编程的重要工具，也是 `async/await` 语法的基础。