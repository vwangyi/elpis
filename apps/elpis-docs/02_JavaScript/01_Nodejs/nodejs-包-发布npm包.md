# 发布npm包

```js

1 注册npm账号  https://www.npmjs.com/signup 得到 账号和密码  
  账号：codewy 邮箱：codewy@qq.com 
2 本地新建文件夹作为项目 执行npm init 生成package.json 
  {
    "name": "codewy",
    "version": "1.0.0",
    "main": "index.js",
    "type": "module", 
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1"
    },
    "author": "wy",
    "license": "ISC",
    "description": ""
  }
3 

// 发布到npm网址
npm config set registry https://registry.npmjs.org/

// 发布到淘宝的cnpm网址 
npm config set registry https://registry.npmmirror.com/

// 发布到自定义的镜像网址
npm config set registry https://my-private-registry.com/


npm login # 登录npm账号
npm whoami # 验证登录账号
npm adduser # 登录npm账号 
npm publish # 发布包
npm publish --access public  # 有@前缀通常被认为是一个私有包 这是告诉npm是公有包

npm link 
npm link @codewy/elpis
npm unlink @codewy/elpis 

```
