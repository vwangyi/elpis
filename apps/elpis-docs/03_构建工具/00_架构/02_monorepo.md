
# monorepo

monorepo 解决什么问题

有哪些方案

技术选型

技术实施

呈现效果

业务项目：前端 后端
基建项目：组件库 函数库 请求库 脚手架 低码平台

业务项目和基建项目 都是为了做一件事 都是相互关联的 所以用 monorepo管理 环境要求是一致 比如 同一个node版本 同一个包管理器pnpm

凡事要对所有子包做统一管理 那就是在根目录下完成

pnpm是包管理器 同时也提供了 monorepo管理方式

project
apps >>> 业务项目目录
packages >>> 基建项目目录
packages.cli 命令行脚手架项目
packages.utils 工具类函数项目
packages.design 组件库项目

pnpm具体管理什么

## pnpm-workspace.yaml
- 根目录新建pnpm-workspace.yaml配置文件
```yaml
# touch pnpm-workspace.yaml
# 表示 apps和packages里面都是子包
packages:
  - "packages/*" # 表示packages下所有子文件都是子包
  - "apps/*" # 表示apps下所有子文件都是子包
```

## 根目录新建package.json

```sh
# pnpm --workspace-root init 表示在根目录下执行 pnpm init 生成pageage.json文件。 (原理 找pnpm-workspace.yaml的所在目录 )
# 如果不加 --workspace-root 表示在当前目录下新建pageage.json
pnpm --workspace-root init
```

## 统一管理所有子包环境版本

- package.json

```json
// 在根目录的package.json中
{
  "engines": {
    "node": ">=22.14.0",
    "npm": ">=10.9.2", // 表示 大于等于某个版本
    "pnpm": "10.15.1" // 表示精确版本
  }
}
// 若子包的版本不符合 在pnpm i的时候就报警告 如果想直接报错 则在根目录下 .npmrc中 追加 engine-strict=true
```

- .npmrc

```yaml
# .npmrc
engine-strict=true
```

## 统一子包的TS配置

- 比如组件库 ts配置如何配置决定了项目的严格程度 一般来说 所有子包的严格程度都是一致的
- 根目录的tsconfig.json

```json
// tsconfig.json
{
  "compilerOptions": {},
  "exclude": ["node_modules", "dist"]
}
```

- node项目个性化配置
- 在子包项目的更目录下新建 tsconfig.json

```json
{
  "extends": "../../tsconfig.json", // 继承根目录下的ts配置
  // 写个性化配置
  "compilerOptions": {
    "types": ["node"],
    "lib": ["ESNext"]
  },
  "include": ["src"]
}
```

## 代码风格和质量检查和拼写检查

### prettier

- pnpm -Dw add prettier

```js
// touch prettier.config.js  所有子包统一 所以也是根目录下
export default {
  // 指定最大换行长度
  printWidth: 120
};
```

- .prettierignore 排除文件检查prettier

```js
// .prettierignore
dist;
public.local;
node_modules;
pnpm - lock.yaml;
```

- 执行检查prettier命令

```json
// pageage.json
{
  "script": {
    // 执行命令 安装规范 重写  pnpm lint:prettier
    "lint:prettier": "prettier --write \"**/*.{js,ts,mjs,cjs,json,tsx,css,less,scss,vue,html,md}\""
  }
}
```

- 安装vscode插件 prettier

```js
// 搜索 prettier
// vscode插件只是辅助开发 在保存时 自动执行命令 只是辅助作用 方便本地开发
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
      "no-var": "2"
    }
  },
  // 前端某个项目配置
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
  // 后端某个项目配置
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
    "lint:eslint": "eslint",
}
```

### 拼写检查

vscode插件： Code Spell Checker

安装

```shell
pnpm -Dw add cspell @cspell/dict-lorem-ipsum
```

配置

```shell
touch cspell.json
```

```json
{
  "import": ["@cspell/dict-lorem-ipsum/cspell-ext.json"],
  "caseSensitive": false,
  "dictionaries": ["custom-dictionary"],
  "dictionaryDefinitions": [
    {
      "name": "custom-dictionary",
      "path": "./.cspell/custom-dictionary.txt",
      "addWords": true
    }
  ],
  "ignorePaths": [
    "**/node_modules/**",
    "**/dist/**",
    "**/build/**",
    "**/lib/**",
    "**/docs/**",
    "**/vendor/**",
    "**/public/**",
    "**/static/**",
    "**/out/**",
    "**/tmp/**",
    "**/*.d.ts",
    "**/package.json",
    "**/*.md",
    "**/stats.html",
    "eslint.config.mjs",
    ".gitignore",
    ".prettierignore",
    "cspell.json",
    "commitlint.config.js",
    ".cspell"
  ]
}
```

自定义字典

```shell
# mkdir -p ./.cspell && touch ./.cspell/custom-dictionary.txt

duyi # 就不会报错了 认为是合法单词
```

检查脚本

```json
"scripts":{
   "lint:spellcheck": "cspell lint \"(packages|apps)/**/*.{js,ts,mjs,cjs,json,css,less,scss,vue,html,md}\""
}

```
## git提交规范 

- 忽略git

```shell
touch .gitignore
```

```yaml
# .gitignore
# Node
node_modules/
dist/
build/
.env
.env.*
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# IDE
.vscode/
.idea/
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# OS
.DS_Store
Thumbs.db

# TypeScript
*.tsbuildinfo

# Misc
coverage/
*.local
*.cache
*.tmp

# Git
.git/
```


### 安装 commitizen

安装

```shell
pnpm -Dw add @commitlint/cli @commitlint/config-conventional commitizen cz-git
```

- `@commitlint/cli 是 commitlint` 工具的核心。
- `@commitlint/config-conventional` 是基于 conventional commits 规范的配置文件。
- `commitizen` 提供了一个交互式撰写commit信息的插件
- [cz-git](https://cz-git.qbb.sh/zh/guide/)是国人开发了这一款工具，工程性更强，自定义更高，交互性更好。



配置`cz-git`

```shell
touch commitlint.config.js
```

```js
/** @type {import('cz-git').UserConfig} */
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // @see: https://commitlint.js.org/#/reference-rules
    "body-leading-blank": [2, "always"],
    "footer-leading-blank": [1, "always"],
    "header-max-length": [2, "always", 108],
    "subject-empty": [2, "never"],
    "type-empty": [2, "never"],
    "subject-case": [0],
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "perf",
        "test",
        "build",
        "ci",
        "chore",
        "revert",
        "wip",
        "workflow",
        "types",
        "release"
      ]
    ]
  },
  prompt: {
    types: [
      { value: "feat", name: "✨ 新功能: 新增功能" },
      { value: "fix", name: "🐛 修复: 修复缺陷" },
      { value: "docs", name: "📚 文档: 更新文档" },
      { value: "refactor", name: "📦 重构: 代码重构（不新增功能也不修复 bug）" },
      { value: "perf", name: "🚀 性能: 提升性能" },
      { value: "test", name: "🧪 测试: 添加测试" },
      { value: "chore", name: "🔧 工具: 更改构建流程或辅助工具" },
      { value: "revert", name: "⏪ 回滚: 代码回滚" },
      { value: "style", name: "🎨 样式: 格式调整（不影响代码运行）" }
    ],
    scopes: ["root", "backend", "frontend", "components", "utils"],
    allowCustomScopes: true,
    skipQuestions: ["body", "footerPrefix", "footer", "breaking"], // 跳过“详细描述”和“底部信息”
    messages: {
      type: "📌 请选择提交类型:",
      scope: "🎯 请选择影响范围 (可选):",
      subject: "📝 请简要描述更改:",
      body: "🔍 详细描述 (可选):",
      footer: "🔗 关联的 ISSUE 或 BREAKING CHANGE (可选):",
      confirmCommit: "✅ 确认提交?"
    }
  }
};

```


配置命令

```json
// package.json
"scripts": {  
	"commit": "git-cz"
},
"config": {
  "commitizen": {
    "path": "node_modules/cz-git"
  }
} 
```

### 提交代码
```sh
git add . # 添加暂存区
pnpm commit # 提交 (不用原生的 git commit)

# 自己可以使用 git commit 看能不能防住
```

### husky 和 lint-staged
- husky 是 连接git hook 钩子函数 在提交之前之后做一些事
- 

安装`husky` 
```shell
pnpm -Dw add husky
```

初始化生成 .husky目录 
```cmd
pnpx husky init
```
- 提交之前执行 某些命令 .husky/pre-commit 里面写 提交之前执行哪些命令
```cmd
#!/usr/bin/env sh
pnpm lint:prettier && pnpm lint:eslint && pnpm lint:spellcheck
```

### lint-staged
- lint-staged 检查暂存区的代码问题
安装

```shell
pnpm -Dw add lint-staged
```

配置命令

```json
"precommit": "lint-staged"
```

配置文件

```js
// .lintstagedrc.js
export default {
  "*.{js,ts,mjs,cjs,json,tsx,css,less,scss,vue,html,md}": ["cspell lint"],
  "*.{js,ts,vue,md}": ["prettier --write", "eslint"]
};

```

重新配置husky

```cmd
#!/usr/bin/env sh
```



如何统一打包 
如何建立包依赖
如何统一测试
如何发布

如何统一打包：主要是指packages里面的子包 比如 组件库 和 工具库 是相互依赖的
  组件库和工具库 都要发布到npm上去  因为是相互依赖的 所以需要统一发布
如何建立包依赖
如何统一测试
如何发布


 
## 如何统一打包
- 如何统一打包：主要是指packages里面的子包 比如 组件库 和 工具库 是相互依赖的
  组件库和工具库 都要发布到npm上去  因为是相互依赖的 所以需要统一发布
- 在script中写打包的脚本

- script/build-rollup.js
```js

```
安装`rollup` 
```shell
pnpm -Dw add rollup @rollup/plugin-node-resolve @rollup/plugin-commonjs rollup-plugin-typescript2 @rollup/plugin-terser @vitejs/plugin-vue rollup-plugin-postcss
```

- `@rollup/plugin-node-resolve`: 解析 node_modules 中的依赖
- `@rollup/plugin-commonjs`: 将 CommonJS 模块转为 ESM
- `rollup-plugin-typescript2`: 让 Rollup 支持 TS 编译
- `@rollup/plugin-terser`： 压缩和混淆
- `@vitejs/plugin-vue`： 支持SFC编译
- `rollup-plugin-postcss`： 处理css代码

配置： 略

## 如何建立包依赖
- 描述：比如 组件库需要使用工具库的代码 

方案1； 工具库先发布到npm 组件库从npm下载
方案2
只适用本地开发 发布如何解决后续改进
```json
// 在组件库项目的 package.json里面 
"devDependencies": {
  "vue": "^3.5.21",
  "工具库项目的pageage.json的name包名": "workspace:*", 
  "elpis-utils": "workspace:^1.0.0", 
  "elpis-utils": "workspace:*",  // *表示 工具库是什么版本就是什么版本 
  "xxxx": "workspace:*",
  "xxxx": "workspace:^1.0.0"
}
// 这样配置后 组件库的node_modules 里面就有工具库项目文件夹的快捷方式 就可以直接使用工具库代码了
```

-- 发布问题
-- 引入使用问题
```js
import { sum } from 'elpis-utils';  
// 这里是 esm的方式引入 
```


## 单元测试
- 对于核心功能 需要详细写好单元测试脚本 以便后续增删功能 可以直接跑单元测试。

- 框架 jest mocha vitest 学一个就行


## 其他
```sh
# 在 elpis-doc 目录下运行 只在elpis-doc项目执行pnpm i 
pnpm i --filter elpis-doc
```