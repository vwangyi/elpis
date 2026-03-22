# monorepo架构 



# 是什么

- monorepo就是一个仓库管理多个项目
- Monorepo = Mono（单一） + Repo（仓库）
- multirepo 多仓库
- 多个仓库 多个项目

```js
monorepo/
├── .git/                ← 唯一的版本控制仓库
├── packages/
│   ├── project-a/       ← 项目A（没有独立的 .git/）
│   │   ├── src/
│   │   └── package.json
│   ├── project-b/       ← 项目B（没有独立的 .git/）
│   │   ├── src/
│   │   └── package.json
│   └── project-c/       ← 项目C（没有独立的 .git/）
│       ├── src/
│       └── package.json
├── apps/
│   └── main-app/        ← 主应用
└── package.json         ← 根目录的 package.json（工作空间配置）
```



## 讲应用

团队经常在 多个项目之间修改同一个业务功能，或有大量的重复代码

比如 移动tv 电信tv 大部分都是一样的 80%相同 20%定制化 


关键决策点：

如果团队经常需要在多个项目间同步修改同一个功能，或者有大量可复用的代码，那么Monorepo很可能是个好选择。

反之，如果项目间独立性很强，各自有不同技术栈和发布节奏，那么多仓库multirepo可能更合适。

Babel、React、Vue等开源项目都用了 monorepo架构