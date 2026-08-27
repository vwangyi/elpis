# npm 命令
- 官网：https://docs.npmjs.com/cli/v9/commands

```sh
npm init -y # 生成package.json
npm install 包名 # npm i 包名
npm uninstall 包名 # npm un 包名
npm version # 
npm root 
Npm info # 方便用户选择合适的包
npm ls --depth 0 # 当前项目的依赖树
npm ls --depth 1 # 当前项目的依赖树
Npm ls -g # 全局包依赖树

npm config get registry
npm config set registry=https://registry.npmmirror.com/
npm config list
npm config edit

npm link # 把当前a包 在全局的node_modules创建一个快捷方式
npm unlink -g a # 在当前a包 把全局的node_modules的快捷方式 删除掉

npm link a # 在当前b包中 使用全局的a包快捷方式
npm unlink a # 在当前b包中 取消使用全局的a包的快捷方式


npm cache clean # 清除缓存
npm cache verify # 检查缓存 
npm cache add 包名 # 
npm cache ls # 查看npm缓存的所有的包
npm config get cache 

npm update # 更新所有依赖包的 小版本和中版本  比如有 ^ ~的前缀的版本号
npm update 包名 # 更新某一个包

npm audit # 对所有包进行审计  比如哪些包有危险
npm audit fix # 进行修复

npm dedupe # 比如 element 和 ant-design-vue 都依赖vue 就可以把vue单独提取出来 


npm prune # 清理node_modules中 没有在package.json中的包


npm help # 查看npm中的所有指令
npm help xxx # 查看某个指令的具体用法
```