 
## mutirepo和monorepo的区别

```text
monorepo 是多个项目之间是强相关的

mutirepo 是多个项目没有管理

```

## 常见monorepo的包管理工具
- pnpm  会这一个就好 其他了解 类似 scss 和 less 
- npm
- yarn
- lerna
- nx
- turborepo
- rush


## 
- 所有子包做同一的事情，那就在根目录中完成， app和packages 都是子包 apps是业务 packages是基建 


## 环境版本锁定
```json
// pageage.json
"engines": {
    "node": ">=22.14.0",
    "npm": ">=10.9.2",
    "pnpm": "10.15.1",
}
```
```json
// .npmrc
engine-strict=true
```

## 目录

- apps 


## 集成typescript

## 代码风格和质量检查
- 安装 perttier
```shell
pnpm -D -w add perttier
```
- perttier配置
```js
// touch perttier.config.js
export default {
    printWidth: 120, // 指定最大换行长度
}
```
- 忽略perttier检查
```js
// touch .prettierignore
dist
public
node_modules
pnpm-lock.yaml
```
- 添加脚本
```json
// touch package.json
"scripts": {
    "lint:prettier": "prettier --write \"**/*.{js,ts,mjs,cjs,json,tsx,css,less,scss,vue,html,md}\""
}
```

- eslint

```shell
pnpm -D -w add eslint@latest @eslint/js globals typescript-eslint @types/node eslint-plugin-prettier eslit-config-prettier eslint-plugin-vue

# eslint 是核心
# @eslint/js 是官方的规则集
# globals 是全局变量支持  比如 node全局变量是global 浏览器全局变量是window
# typescript-eslint 是支持ts
# @types/node 是类型定义辅助
# eslint-plugin-prettier eslit-config-prettier 解决冲突eslint和prettier  
# eslint-plugin-vue
```
```js

// touch eslint.config.js
```

- 脚本命令

```json
// touch package.json
"scripts": {
    "lint:eslint": "eslint"
}
``` 