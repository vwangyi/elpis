# 注释语句

- https://www.jsdoc.com.cn/tags-param





## 单行注释

```js
// 我是单行注释 一般写在代码的上方 或 后方   快捷键 comman + /  
const name = "张三"; // 变量说明 
```

## 多行注释

```js
/* 我是多行注释 一般写在代码上方 */
/*
 * 复杂算法的说明
 * 这里可以详细解释实现逻辑
 * 适用于大段说明
 */
function complexAlgorithm() {}
```

## 文档注释（需要JSDoc工具）

```js
// JSDoc注释 不属于原生js提供 大多数编辑器都支持jsdoc 好处是 不用ts也有类型提示
// 公共API、库函数、复杂类型用 JSDoc
/**
 * 用户类
 * @class
 * @param {string} name - 用户名
 * @param {number} age - 年龄
 */
class User {
    /**
     * 获取用户信息
     * @returns {string} 用户描述
     * @example
     * const user = new User("张三", 20);
     * console.log(user.getInfo()); // "张三, 20岁"
     */
    getInfo() {
        return `${this.name}, ${this.age}岁`;
    }
}

/**      注意：必须以 /** 开头（双星），单星 /* 会被识别为普通注释，无法触发 JSDoc 解析。
 * 注释描述（可换行）
 * @标签1 内容1
 * @标签2 内容2
 */
jsdoc官网查看: https://www.jsdoc.com.cn/tags-param 




/**
 * @description 计算两个数字的运算结果（支持加减乘除）
 * @summary 通用数值运算工具
 * @author 张三 <zhangsan@example.com>
 * @version 1.0.0
 * @since v2.0.0
 * @param {number} a - 第一个操作数（必填，支持整数/小数）
 * @param {number} b - 第二个操作数（必填，支持整数/小数）
 * @param {('add'|'subtract'|'multiply'|'divide')} [operator='add'] - 运算类型（可选）
 * @returns {number} 运算结果（小数保留 2 位精度）
 * @throws {Error} 当 operator 为非法值时抛出
 * @throws {RangeError} 当除法运算中除数为 0 时抛出
 * @example
 * // 求和（默认类型）
 * calculate(2.5, 3.8) → 6.30
 * @example
 * // 除法运算
 * calculate(10, 3, 'divide') → 3.33
 * @example
 * // 减法运算
 * calculate(5, 2, 'subtract') → 3.00
 * @see https://example.com/docs/calculate 完整接口文档
 * @todo 1. 增加指数运算（pow） 2. 支持大数运算（避免溢出）
 */
function calculate(a, b, operator = 'add') {
  let result;
  switch (operator) {
    case 'add':
      result = a + b;
      break;
    case 'subtract':
      result = a - b;
      break;
    case 'multiply':
      result = a * b;
      break;
    case 'divide':
      if (b === 0) throw new RangeError('除数不能为 0');
      result = a / b;
      break;
    default:
      throw new Error(`不支持的运算类型：${operator}`);
  }
  return Number(result.toFixed(2)); // 保留 2 位小数
}


/**
 * @component 登录表单组件
 * @description 用于用户登录（支持账号密码/验证码登录）
 * @author 李四 <lisi@example.com>
 * @version 1.0.0
 * @props {Object} form - 表单数据
 * @props {string} form.username - 用户名（长度 3-20 字符）
 * @props {string} form.password - 密码（长度 6-16 字符）
 * @props {boolean} [isCaptcha=false] - 是否显示验证码（默认 false）
 * @emits {Function} submit - 表单提交事件（参数：表单数据）
 * @example
 * // 基础用法（账号密码登录）
 * <LoginForm :form="form" @submit="handleSubmit" />
 * @example
 * // 显示验证码（验证码登录）
 * <LoginForm :form="form" :is-captcha="true" @submit="handleSubmit" />
 */
export default {
  name: 'LoginForm',
  props: {
    form: {
      type: Object,
      required: true,
      validator: (value) => {
        return !!value.username && !!value.password;
      }
    },
    isCaptcha: {
      type: Boolean,
      default: false
    }
  },
  emits: ['submit'],
  methods: {
    handleSubmit() {
      this.$emit('submit', this.form);
    }
  }
};


// 自动生成 HTML 文档
通过 jsdoc 工具将注释生成文档： 
全局安装：npm install jsdoc -g；
项目根目录创建配置文件 jsdoc.json（可选，自定义文档样式）；
执行命令：jsdoc src/ -d docs/（将 src/ 目录下的代码注释生成到 docs/ 目录）。

// 与 ESLint 配合
// .eslintrc.js 
// npm install eslint-plugin-jsdoc --save-dev
module.exports = {
  plugins: ['jsdoc'],
  rules: {
    'jsdoc/require-description': 'error', // 要求必须有描述
    'jsdoc/require-param': 'error', // 要求函数必须有 @param 注释
    'jsdoc/require-returns': 'error' // 要求函数必须有 @returns 注释
  }
}; 
```



