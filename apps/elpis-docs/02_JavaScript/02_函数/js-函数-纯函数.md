# 纯函数
// 纯函数
// 纯函数不会修改外部状态，纯函数输出完全由输入决定，不依赖任何外部变量。
function add(a, b){
    return a + b;
}



## 脑图
```js
- 是什么
- 调用一个函数，相同的输入 始终返回相同的输出，不受外部状态影响，也不修改任何外部状态。 这就是纯函数。
比如 数组的map filler 
```


在 JavaScript 中，**纯函数** 是一种特殊的函数，它满足以下两个核心条件：

## 1. **确定性（相同的输入 => 相同的输出）**
对于相同的输入参数，**总是返回相同的结果**，不受外部状态影响。

## 2. **无副作用**
不改变任何外部状态，包括：
- 不修改传入的参数
- 不修改全局变量
- 不进行 I/O 操作（如 API 调用、DOM 操作、读写文件）
- 不触发外部事件

---

## ✅ **纯函数示例**

```javascript
// ✅ 纯函数
function add(a, b) {
  return a + b;
}

function squareArray(arr) {
  // 创建新数组，不修改原数组
  return arr.map(x => x * x);
}

function formatName(user) {
  // 创建新对象，不修改原对象
  return {
    ...user,
    fullName: `${user.firstName} ${user.lastName}`
  };
}
```

## ❌ **非纯函数示例**

```javascript
// ❌ 有副作用：修改了外部变量
let counter = 0;
function increment() {
  counter++; // 修改外部状态
  return counter;
}

// ❌ 有副作用：修改了输入参数
function updateUser(user) {
  user.updatedAt = new Date(); // 直接修改传入的对象
  return user;
}

// ❌ 不确定：依赖外部状态
function getRandomNumber() {
  return Math.random(); // 每次调用结果不同
}

// ❌ 有副作用：执行 I/O 操作
function saveToDatabase(data) {
  localStorage.setItem('key', data); // 外部存储操作
}
```

---

## **纯函数的好处**

### 1. **可预测性**
```javascript
// 无论何时何地调用，结果都相同
add(2, 3); // 总是返回 5
```

### 2. **易于测试**
```javascript
// 不需要模拟外部环境
test('add function', () => {
  expect(add(2, 3)).toBe(5);
  expect(add(-1, 1)).toBe(0);
});
```

### 3. **可缓存性（记忆化）**
```javascript
function memoize(fn) {
  const cache = new Map();
  return function(...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

const memoizedAdd = memoize(add);
memoizedAdd(2, 3); // 计算并缓存
memoizedAdd(2, 3); // 直接返回缓存结果
```

### 4. **易于并行处理**
```javascript
// 纯函数可以安全地并行执行
const results = await Promise.all([
  processData(data1), // 纯函数
  processData(data2), // 互不干扰
  processData(data3)
]);
```

### 5. **引用透明性**
```javascript
// 函数调用可以被其返回值替换而不改变程序行为
const result = add(2, add(3, 4));
// 等同于
const result = add(2, 7);
// 等同于
const result = 9;
```

---

## **如何在实践中编写纯函数**

### 1. **不修改输入，返回新数据**
```javascript
// ✅ 正确
function addItemToCart(cart, item) {
  return [...cart, item]; // 返回新数组
}

// ❌ 错误
function addItemToCart(cart, item) {
  cart.push(item); // 修改原数组
  return cart;
}
```

### 2. **将依赖作为参数传入**
```javascript
// ✅ 纯函数：依赖通过参数传入
function calculateTotal(price, taxRate) {
  return price * (1 + taxRate);
}

// ❌ 不纯：依赖外部变量
let taxRate = 0.1;
function calculateTotal(price) {
  return price * (1 + taxRate); // 依赖外部状态
}
```

### 3. **处理副作用：分离纯与不纯**
```javascript
// 不纯的部分：处理副作用
function saveUserToDB(user) {
  // 这里进行 I/O 操作
  database.save(user);
  return user;
}

// 纯的部分：只处理数据转换
function createUser(name, email) {
  return {
    id: Date.now(),
    name,
    email,
    createdAt: new Date().toISOString()
  };
}

// 组合使用
const newUser = createUser('Alice', 'alice@example.com'); // 纯
saveUserToDB(newUser); // 不纯，但有明确边界
```

---

## **函数式编程中的纯函数**

在 React、Redux 等框架中，纯函数尤为重要：

```javascript
// React 函数组件（应该是纯的）
function UserCard({ user }) {
  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}

// Redux Reducer（必须是纯函数）
function todoReducer(state = [], action) {
  switch (action.type) {
    case 'ADD_TODO':
      return [...state, action.payload]; // 返回新状态
    case 'REMOVE_TODO':
      return state.filter(todo => todo.id !== action.id);
    default:
      return state;
  }
}
```

---

## **总结**

**纯函数 = 确定性 + 无副作用**

记住一个简单的判断方法：
> 如果给函数相同的参数，它在今天、明天、一个月后，在任何地方调用，是否都返回相同的结果？如果是，那它很可能就是纯函数。

纯函数是函数式编程的核心概念，它能显著提高代码的可维护性、可测试性和可靠性。