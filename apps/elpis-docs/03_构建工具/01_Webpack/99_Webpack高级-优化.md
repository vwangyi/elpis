临时记一下：开发环境没有物理输出 就看不见 可以在 f12的source选项卡 看内存的代码文件


 

## include / exclude
```js
include 只处理哪些文件
exclude 不处理哪些文件
module.exports = {
  entry: "./src/main.js",
  // 配置出口路径 因为开发环境和生产环境输出不一致 所有在各自环境中自行配置 所以这里注释 开发环境一般也不需要物理输出
  output: {
    clean: true, // 清空上一次的输出
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        exclude: /node_modules/,
        use: { loader: "vue-loader" },
      },
      {
        test: /\.jsx?$/,
        include: [path.resolve(process.cwd(), "./app/view")], 
        use: { loader: "babel-loader" },
      },
    ]
  },
  plugins: [
    new EslintPlugin({
        exclude: "node_modules",
    })
  ]
}

```
## 缓存
 
```js
var a = {
    test: /\.js$/,
    loader: 'babel-loader',
    options: {
        // presets: ['@babel/preset-env'], // 预设在外面写了 这里不用写
        cacheDirectory: true, // 开启babel缓存
        cacheCompression: false, // 关闭缓存文件的压缩 因为压缩需要时间 追求速度不压缩 用时间换空间
    }
}


// eslint缓存
new EslintPlugin({
    exclude: 'node_modules',
    cache: true, // 开启eslint缓存
    cacheLocation: path.resolve(__dirname, '../node_modules/.cache/eslintcache') // 缓存到 node_modules里面
})
```

## 多进程打包
- 13

```js

```




## 压缩本地图片 而不是链接
- ai问 插件名字 有损压缩 无损

```js

```

## 代码分割
- 
```js
import(/* webpackChunkName: main */ './js/xx') // webpack提供 vite没有
```



html
css
js
图片
字体


压缩
分割
树摇

