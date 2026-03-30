# eslint

- 官网：
- 源码：


eslint.config.js / eslintrc 


## 
```js
// eslintrc 
{
  "extends": [
    "plugin:vue/base",
    "plugin:vue/recommended",
  ],
  "plugins": ["vue"],
  "env": {
    "browser": true,
    "node": true
  },
  "parser": "vue-eslint-parser",
  "parserOptions": {
    "parser": "babel-eslint",
    "ecmaVersion": 2017,
    "sourceType": "module"
  },
  "rules": {
    "no-unused-vars": [2, {"args": "none"}],
    "strict": "off",
    "valid-jsdoc": "off",
    "jsdoc/require-param-description": "off",
    "jsdoc/require-param-type": "off",
    "jsdoc/check-param-names": "off",
    "jsdoc/require-param": "off",
    "jsdoc/check-tag-names": "off",
    "linebreak-style": "off",
    "array-bracket-spacing": "off",
    "prefer-promise-reject-errors": "off",
    "comma-dangle": "off",
    "newline-per-chained-call": "off",
    "no-loop-func": "off",
    "no-empty": "off",
    "no-else-return": "off",
    "no-unneeded-ternary": "off",
    "no-eval": "off",
    "prefer-destructuring": "off",
    "no-param-reassign": "off",
    "max-len": "off",
    "no-restricted-syntax": "off",
    "no-plusplus": "off",
    "no-useless-escape": "off",
    "no-nested-ternary": "off",
    "radix": "off",
    "arrow-body-style": "off",
    "arrow-parens": "off",
    "vue/multi-word-component-names": "off",
    "vue/valid-v-for": "off",
    "vue/no-multiple-template-root": "off"
  },
  "globals": {
    "$": true,
    "axios": true,
    "Vue": true
  }
}

```




## 安装
```shell
pnpm i eslint eslint-plugin-imoprt eslint-plugin-vue 
```


### ESLint

```shell
pnpm -Dw add eslint@latest @eslint/js globals typescript-eslint eslint-plugin-prettier eslint-config-prettier eslint-plugin-vue
```

| 类别                 | 库名                                               |
| -------------------- | -------------------------------------------------- |
| **核心引擎**         | `eslint`                                           |
| **官方规则集**       | `@eslint/js`                                       |
| **全局变量支持**     | `globals`                                          |
| **TypeScript 支持**  | `typescript-eslint`                                |
| **类型定义（辅助）** | `@types/node`                                      |
| **Prettier 集成**    | `eslint-plugin-prettier`, `eslint-config-prettier` |
| **Vue.js 支持**      | `eslint-plugin-vue`                                |

配置

```shell
touch eslint.config.js
```

```js
import { defineConfig } from "eslint/config";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintPluginVue from "eslint-plugin-vue";
import globals from "globals";
import eslintConfigPrettier from "eslint-config-prettier/flat";

const ignores = ["**/dist/**", "**/node_modules/**", ".*", "scripts/**", "**/*.d.ts"];

export default defineConfig(
  // 通用配置
  {
    ignores, // 忽略项
    extends: [eslint.configs.recommended, ...tseslint.configs.recommended, eslintConfigPrettier], // 继承规则
    plugins: {
      prettier: eslintPluginPrettier
    },
    languageOptions: {
      ecmaVersion: "latest", // ecma语法支持版本
      sourceType: "module", // 模块化类型
      parser: tseslint.parser // 解析器
    },
    rules: {
      // 自定义
    }
  },
  // 前端配置
  {
    ignores,
    files: ["apps/frontend/**/*.{ts,js,tsx,jsx,vue}", "packages/components/**/*.{ts,js,tsx,jsx,vue}"],
    extends: [...eslintPluginVue.configs["flat/recommended"], eslintConfigPrettier],
    languageOptions: {
      globals: {
        ...globals.browser
      }
    }
  },
  // 后端配置
  {
    ignores,
    files: ["apps/backend/**/*.{ts,js}"],
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  }
);
```

脚本命令

```json
"scripts":{
    //......其他省略
    "lint:eslint": "eslint",

    "eslint": "eslint --quite --ext js,vue ."
}
```

