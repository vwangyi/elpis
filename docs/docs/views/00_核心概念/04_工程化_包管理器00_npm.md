# npm
npm是node包管理器，管理包的依赖关系。


## npm命令


# 包管理器 

- package.json https://docs.npmjs.com/cli/v11/configuring-npm/package-json 
- npm官网：https://docs.npmjs.com/
- pnpm官网 https://pnpm.io/configuring 
- yarn 官网 https://yarnpkg.com/getting-started 
## npm 
- npm是node包管理器，用于管理软件包、库以及依赖关系的一种工具。

## CLI 
- CLI（command line interface）是命令行接口，在控制台输入命令进行交互。
 


## npm yarn pnpm 
- npm官网：https://www.npmjs.com/
npm是node package manager（node 包管理器），用来管理包的依赖关系的一个包管理器。
为什么需要包管理器？因为不可能用原生写所有的功能，社区中存在的功能直接拿过来用。


- yarn是解决当时npm当时速度慢 安全性问题  当前npm没有缓存  yarn加入了缓存 并行下载


package.json 只记录直接依赖 不记录间接依赖
yarn 引入 yarn.lock锁文件 来记录间接依赖 

yarn团队引入yarn.lock锁文件 来记录间接依赖来解决了版本的确定性问题
    （npm团队后续也提供了 package-lock.json的锁文件）
    锁文件 一般情况下 都需要提交git 以保证间接依赖一致性， npm ci也是基于锁文件进行安装

    package.json和package-lock.json区别
    package.json 是包描述文件，包依赖只有直接依赖
    package-lock.json记录了直接依赖和间接依赖， npm ci是完全基于锁文件进行安装依赖。
     
yarn 提供缓存机制， 解决了 安装速度慢的问题  （npm后续也支持缓存）
yarn 加入校验机制，确保安全性 

- pnpm

1. 节省磁盘空间
2. 解决幽灵依赖
3. 原生支持monorepo 

pnpm中 ， 本地多个项目的包依赖的版本相同 则是使用同一份依赖 
npm中 本地多个项目，存在多个相同的依赖


硬链接是什么
多个文件指向同一块物理数据块，比如 创建1.txt 写了 hello 复制一份 2.txt ,1.txt和2.txt 都指向同一块物理数据块
在 1.txt中 把 hello 修改为 hello1 那么 打开2.txt 也是hello1， 当所有硬链接的文件都删除 那么物理数据块才会从磁盘中删除

符号链接是什么
符号链接类似于快捷方式，快捷方式 指向 原始文件， 原始文件指向 物理数据块 ，删除原始文件后，真实物理块才被删除， 所有快捷方式都不可用了
删除快捷方式 则不影响

pnpm中 直接依赖使用 硬链接 间接依赖使用符号链接



npm存在幽灵依赖， 当npm i express时，由于 express依赖 body-parser，npm 会把间接依赖平铺到直接依赖一起。
那也就是 用户 npm i express 但可以意外使用 body-parser ，body-parser就是一个幽灵依赖。

幽灵依赖存在的问题是：难以理解的依赖关系 2 潜在的错误


当 pnpm add express后 打开 node_modules 只看见直接依赖 express 没有间接依赖。 
直接引入body-parser 会报错 因为没有下载body-parser 


pnpm 解决了 npm的幽灵依赖问题





本地多个项目

```sh
npm i pnpm -g # 通过npm全局安装pnpm 
pnpm init # 初始化包
pnpm add 包名 # 安装依赖
pnpm install # 添加所有依赖

pnpm update 包名 # 升级某个到最新版本 
pnpm remove 包名 # 移除某个依赖
```
