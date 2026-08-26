# 发布npm包



## 准备package.json 
- 包名name必须唯一
```json
{
  "name": "duyi-jstools",
  "version": "1.0.1",
  "description": "this package just for study and useless",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "build": "rollup -c"
  },
  "exports": {
    "require": "./dist/index.cjs",
    "import": "./dist/index.js"
  },
  "keywords": [
    "study",
    "useless"
  ],
  "files": [
    "/dist"
  ],
  "author": "xx",
  "license": "ISC", 
}

```
- .npmignore 中设置黑名单
```sh
# .npmignore 中设置忽略文件 设置上传黑名单
src
tests
```
- package.json的files中设置白名单
```json
{
  "files": [
    "/dist",
    "LICENSE"
  ]
}
```

## 设置发布地址
```sh
# 发布到npm网址
npm config set registry https://registry.npmjs.org/

# 发布到淘宝的cnpm网址 
npm config set registry https://registry.npmmirror.com/

# 发布到自定义的镜像网址
npm config set registry https://my-private-registry.com/
```


## 发布 
```sh
# 注册npm账号  绑定邮箱  得到 账号 邮箱 密码 
npm login # 登录 
npm adduser # 输入账号密码 不存在就注册 存在就登录 adduser有2个功能
npm whoami # 查看登录账号
npm logout # 登出
 
npm publish # 发布包
npm publish --access public  # 当发布的包名是 有@前缀 通常被认为是一个私有包 这是告诉npm是公有包



npm link 
npm link @codewy/elpis
npm unlink @codewy/elpis 
```
 
 