# 包管理器



- 
- npm官网：https://docs.npmjs.com/
- package.json https://docs.npmjs.com/cli/v11/configuring-npm/package-json 
- pnpm官网 https://pnpm.io/configuring 
- yarn 官网 https://yarnpkg.com/getting-started 







## 什么是包管理器？Node.js中最常用的包管理器是什么？

- 包管理器是用于管理和安装软件包（包括库、框架、工具等）的工具。
- 在Node.js中，最常用的包管理器是npm（Node Package Manager）。
- npm允许您在项目中安装、更新和删除依赖项，以及发布和共享自己的软件包。

是什么

npm 包管理器有 npm pnpm yarn 等等 



npm 包管理器就是管理 npm 包的一个工具。 

npm 命令 和 npx 命令 都在 node 环境里面。

pnpm 和 yarn 需要 单独安装

npm i -g pnpm yarn



## 问： npm 和 pnpm 有什么区别



## 问：pnpm 解决了 npm的什么问题 





## 问：npm pnpm yarn 的各自优势是什么？







## 













## 如何搭建npm 私服
- 因为npm官方 不允许发私有包 或 发私有包要钱 
```shell
# https://verdaccio.org/zh-CN/

# Verdaccio 是可以帮我们快速构建npm私服的一个工具

npm install verdaccio -g # 下载
verdaccio # 启动私有npm包服务器



#创建账号
npm adduser --registry http://localhost:4873/
#账号 密码 邮箱

# 发布npm
npm publish --registry http://localhost:4873/


#指定开启端口 默认 4873
verdaccio --listen 9999

# 指定安装源
npm install --registry http://localhost:4873

# 从本地仓库删除包
npm unpublish <package-name> --registry http://localhost:4873

```

# 包管理器

● 
● 
● npm官网：https://docs.npmjs.com/
● package.json https://docs.npmjs.com/cli/v11/configuring-npm/package-json 
● pnpm官网 https://pnpm.io/configuring 
● yarn 官网 https://yarnpkg.com/getting-started 



什么是包管理器？Node.js中最常用的包管理器是什么？
● 包管理器是用于管理和安装软件包（包括库、框架、工具等）的工具。
● 在Node.js中，最常用的包管理器是npm（Node Package Manager）。
● npm允许您在项目中安装、更新和删除依赖项，以及发布和共享自己的软件包。
是什么
npm 包管理器有 npm pnpm yarn 等等 

npm 包管理器就是管理 npm 包的一个工具。 
npm 命令 和 npx 命令 都在 node 环境里面。
pnpm 和 yarn 需要 单独安装
npm i -g pnpm yarn

问： npm 和 pnpm 有什么区别

问：pnpm 解决了 npm的什么问题 


问：npm pnpm yarn 的各自优势是什么？






