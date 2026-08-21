
## 公共库打包 
- script目录  apps里面的业务项目 自己负责自己的打包 script负责package里面的所有子包统一打包

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
