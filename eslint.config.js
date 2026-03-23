import { defineConfig } from 'eslint/config';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintPluginVue from 'eslint-plugin-vue';
import globals from 'globals';
import eslintConfigPrettier from 'eslint-config-prettier/flat';

// 忽略所有文件和目录
const ignores = [
  '**/node_modules',
  '**/dist',
  '**/node_modules/**',
  '.*',
  'apps/elpis-docs',
  'apps/elpis-admin',
  'apps/elpis-demo',
  'apps/elpis-nest',
  'apps/elpis-vue',
  'scripts'
];
const rules = {
  '@typescript-eslint/no-require-imports': 'off', // 使用require函数
  '@typescript-eslint/no-unused-vars': 0, // 未使用的变量
  'no-unreachable': 0, // 无法访问的代码 比如 return后面的代码
  // 不能使用var
  'no-var': 'error',
  // 关闭声明但未使用的变量的报错
  'no-unused-vars': 'off',
  // 要求使用 isNaN() 检查 NaN
  'use-isnan': 'error',
  // 强制数组方法的回调函数中有 return 语句
  'array-callback-return': 'error',
  // 要求 switch 语句中有 default 分支
  'default-case': 'error',
  // 强制在任何允许的时候使用点号
  'dot-notation': 'error',
  // 要求使用 === 和 !==
  eqeqeq: 'error',
  // 禁用 alert、confirm 和 prompt
  'no-alert': 'error',
  // 禁止 if 语句中有 return 之后有 else
  'no-else-return': 'error',
  // 禁用 eval()
  'no-eval': 'error',
  // 禁止使用多个空格
  'no-multi-spaces': 'error',
  // 禁止使用 var 多次声明同一变量
  'no-redeclare': 'error',
  // 禁止在 return 语句中使用赋值语句
  'no-return-assign': 'error',
  // 禁止出现未使用过的表达式
  'no-unused-expressions': 'error',
  // 禁止不必要的 .call() 和 .apply()
  'no-useless-call': 'error',
  // 禁用未声明的变量，除非它们在 /global / 注释中被提到
  'no-undef': 'off',
  // 不允许在变量定义之前使用它们
  'no-use-before-define': 'error',
  // 强制在逗号前后使用一致的空格
  'comma-spacing': 'error',
  // 强制数组方括号中使用一致的空格
  'array-bracket-spacing': 'error',
  // 强制在单行代码块中使用一致的空格
  'block-spacing': 'error',
  // 强制在代码块中使用一致的大括号风格
  'brace-style': 'error',
  // 强制文件末尾至少保留一行空行
  'eol-last': 'error',
  // 强制使用一致的缩进
  indent: ['error', 2],
  // 强制在对象字面量的属性中键和值之间使用一致的间距
  'key-spacing': 'error',
  // 强制在关键字前后使用一致的空格
  'keyword-spacing': 'error',
  // 要求构造函数首字母大写
  'new-cap': 'off',
  // 要求方法链中每个调用都有一个换行符
  'newline-per-chained-call': 'error',
  // 不允许多个空行
  'no-multiple-empty-lines': 'error',
  // 禁用行尾空格
  'no-trailing-spaces': 'error',
  // 强制在花括号中使用一致的空格
  'object-curly-spacing': ['error', 'always'],
  // 强制分号之前和之后使用一致的空格
  'semi-spacing': 'error',
  // 强制在块之前使用一致的空格
  'space-before-blocks': 'error',
  // 强制在圆括号内使用一致的空格
  'space-in-parens': ['error', 'never'],
  // 要求操作符周围有空格
  'space-infix-ops': 'error',
  // 强制在注释中 // 或 /* 使用一致的空格
  'spaced-comment': 'error',
  // js中必须使用单引号
  quotes: ['error', 'single'],
  //
  'operator-linebreak': 'off',

  // vue部分
  // vue组件标签不能为一个单词
  'vue/multi-word-component-names': 'off',
  // vue在watch中不能用箭头函数
  'vue/no-arrow-functions-in-watch': 'error',
  // vue在computed中不能用async/await
  'vue/no-async-in-computed-properties': 'error',
  // vue不能使用一样的key
  'vue/no-dupe-keys': 'error',
  // vue子组件不能改变父组件的属性
  'vue/no-mutating-props': 'error',
  // vue不能使用自带的属性/方法
  'vue/no-reserved-keys': 'error',
  // vue的data必须是一个函数
  'vue/no-shared-component-data': 'error',
  // vue的computed不能有副作用
  'vue/no-side-effects-in-computed-properties': 'error',
  // vue中template不能使用key
  'vue/no-template-key': 'error',
  // vue中不能调用computed
  'vue/no-use-computed-property-like-method': 'error',
  // vue中不能和v-for一起使用v-if
  'vue/no-use-v-if-with-v-for': 'error',
  // vue中不能给template添加无用属性
  'vue/no-useless-template-attributes': 'error',
  // vue中props中的属性必须有类型
  'vue/require-prop-type-constructor': 'error',
  // vue中v-for必须有key
  'vue/require-v-for-key': 'error',
  // vue中computed必须有返回值
  'vue/return-in-computed-property': 'error',
  // vue中不能使用无效的nextTick
  'vue/valid-next-tick': 'error',
  // vue标签换行
  'vue/singleline-html-element-content-newline': 'off',
  // vue属性顺序
  'vue/attributes-order': 'off',
  // vue方法顺序
  'vue/order-in-components': 'off',
  // v-html
  'vue/no-v-html': 'off',
  // template中不止可以有一个标签
  'vue/valid-template-root': 'off',
  // template中的缩进
  'vue/html-indent': ['error', 2],
  // template中的引号
  'vue/html-quotes': ['error', 'double', { avoidEscape: false }],
  // 插值表达式
  'vue/mustache-interpolation-spacing': ['error', 'always'],
  // template中的空格
  'vue/no-multi-spaces': [
    'error',
    {
      ignoreProperties: false
    }
  ],
  'vue/no-v-text-v-html-on-component': 'off',

  // 换行符
  'linebreak-style': [2, 'unix'],
  // 取消jsdoc注释
  'require-jsdoc': 'off',
  // 正常for..in..
  'guard-for-in': 'off',
  // 限制每行代码的字数
  'max-len': 'off'
};

export default defineConfig([
  { ignores },
  // 通用配置
  {
    ignores, // 忽略项
    // 继承规则
    extends: [eslint.configs.recommended, ...tseslint.configs.recommended, eslintConfigPrettier],
    plugins: {
      prettier: eslintPluginPrettier
    },
    languageOptions: {
      ecmaVersion: 'latest', // ecma语法支持版本
      sourceType: 'module', // 模块化类型
      parser: tseslint.parser // 解析器
    },
    rules: {
      /**
       * 关闭 >>> 0 或 'off' 表示关闭 也表示允许使用
       * 警告 >>> 1 或 'warn'
       * 错误 >>> 2 或 'error'
       */
      'no-var': 2
    }
  },
  /* vue项目 */
  {
    ignores,
    files: ['apps/elpis-vue/**/*.{ts,js,tsx,jsx,vue}', 'packages/elpis-design/**/*.{ts,js,tsx,jsx,vue}'],
    extends: [...eslintPluginVue.configs['flat/recommended'], eslintConfigPrettier],
    languageOptions: {
      globals: {
        ...globals.browser
      }
    },
    rules
  },
  /* koa项目 */
  {
    ignores,
    files: ['apps/elpis-koa/**/*.{ts,js}'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.mocha, // 添加 Mocha 全局变量 测试框架
        vi: 'readonly', // 如果使用 Vitest
        jest: 'readonly' // 如果使用 Jest
      }
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off', // 使用require函数
      '@typescript-eslint/no-unused-vars': 0, // 未使用的变量
      'no-unreachable': 0, // 无法访问的代码 比如 return后面的代码

      // 禁止使用 var，强制使用 let 或 const
      'no-var': 'error',
      // 如果变量从未被重新赋值，强制使用 const
      'prefer-const': [
        'error',
        {
          destructuring: 'any', // 解构时也检查
          ignoreReadBeforeAssign: false // 赋值前读取的变量也检查
        }
      ]
    }
  },

  /* cli 项目 */
  {
    files: ['packages/elpis-cli/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node // 添加 Node.js 全局变量
      }
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off' // 允许使用require函数
    }
  }
]);
