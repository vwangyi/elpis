# hash

- 是什么：哈希是什么 

- 



### 15. webpack 打包是hash码是如何生成的
  
1. webpack生态中存在多种计算hash的方式 

+ hash
+ chunkhash
+ contenthash hash代表每次webpac商译中生成的hash值，所有使用这种方式的文件hash都相同。每次构建都会使webpackiH■算新 的hash。chunkhash基于入口文件及其关联的chun性成，某个文件的改动只会影响与它有关联的chunk的hash值，不 会影响其他文件contenthash根据文件内容创建。当文件内容发生变化时，contenthash发生变化  

2. 避免相同随机值  
webpack在计算hash后分割chunk。产生相同随机值可能是因为这些文件属于同一个chunk,可以将某f文雌到独 立的chunk（如放入entry）
 


 hash 又叫文件指纹 


 ## webpack 中的 Hash 详解

在 webpack 中，hash 是**根据文件内容生成的唯一标识符**，用于版本控制和缓存管理。

## 三种 Hash 类型

### 1. **`hash`** - 项目级别 Hash
```javascript
module.exports = {
  output: {
    filename: 'bundle.[hash].js'
  }
};
```
- **作用**：整个项目共享同一个 hash
- **生成规则**：基于所有模块内容 + 构建配置
- **变化时机**：任何文件修改都会改变
- **输出示例**：`bundle.8a2b3c4d.js`

### 2. **`chunkhash`** - 入口文件级别 Hash
```javascript
module.exports = {
  output: {
    filename: '[name].[chunkhash].js'
  },
  entry: {
    main: './src/index.js',
    vendor: './src/vendor.js'
  }
};
```
- **作用**：每个入口文件有自己的 hash
- **生成规则**：基于该入口及其依赖
- **变化时机**：只有该入口相关文件修改才会改变
- **输出示例**：
  - `main.8a2b3c4d.js`
  - `vendor.e5f6g7h8.js`

### 3. **`contenthash`** - 文件内容级别 Hash
```javascript
module.exports = {
  output: {
    filename: '[name].[contenthash].js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    })
  ]
};
```
- **作用**：基于单个文件内容
- **生成规则**：只基于该文件内容
- **变化时机**：只有该文件内容修改才会改变
- **输出示例**：`main.8a2b3c4d.js`、`main.a1b2c3d4.css`

## 实际对比示例

### 初始代码
```javascript
// src/index.js
import './style.css'
console.log('Hello')
```

```css
/* src/style.css */
body { background: red; }
```

### 不同 Hash 的变化情况

| 修改文件 | `[hash]` | `[chunkhash]` | `[contenthash]` |
|---------|----------|---------------|-----------------|
| 修改 index.js | main.js 改变 | main.js 改变 | **main.js 改变** |
| 修改 style.css | main.js 改变 | main.js 改变 | **style.css 改变** |
| 修改第三方库 | main.js 改变 | **vendor.js 改变** | **vendor.js 改变** |

## 详细示例

### 配置示例
```javascript
// webpack.config.js
module.exports = {
  entry: {
    main: './src/index.js',
    vendor: ['react', 'react-dom']
  },
  
  output: {
    filename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, 'dist')
  },
  
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },
  
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    })
  ]
};
```

### 输出文件
```
dist/
├── main.a1b2c3d4.js        # 业务代码 (chunkhash)
├── vendors.e5f6g7h8.js     # 第三方库 (chunkhash)  
├── runtime.8i9j0k1l.js     # 运行时 (chunkhash)
└── main.m1n2o3p4.css       # 样式文件 (contenthash)
```

## 生产环境最佳实践

```javascript
// webpack.prod.js
module.exports = {
  output: {
    // 使用 chunkhash 用于长期缓存
    filename: 'js/[name].[chunkhash:8].js',
    chunkFilename: 'js/[name].[chunkhash:8].chunk.js'
  },
  
  plugins: [
    // CSS 文件使用 contenthash（更精确）
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[name].[contenthash:8].chunk.css'
    }),
    
    // 图片、字体等资源使用 contenthash
    new AssetModuleFilename('assets/[name].[contenthash:8][ext]')
  ],
  
  optimization: {
    // 分离 runtime
    runtimeChunk: 'single',
    
    // 代码分割
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: 4,
      cacheGroups: {
        // 第三方库
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          name: 'vendors'
        },
        // 公共业务代码
        commons: {
          minChunks: 2,
          priority: -20,
          name: 'commons'
        }
      }
    }
  }
};
```

## Hash 长度控制

```javascript
// 完整 hash (默认20位)
filename: '[name].[hash].js'           // main.8a2b3c4d5e6f7g8h9i0j.js

// 指定长度（8位）
filename: '[name].[hash:8].js'         // main.8a2b3c4d.js

// 结合使用
filename: '[name].[chunkhash:8].js'    // main.8a2b3c4d.js
```

## 缓存策略示例

```javascript
// 服务器配置
// nginx 示例
location /static {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

// HTML 中引用
<script src="/static/js/main.8a2b3c4d.js"></script>
<link href="/static/css/main.m1n2o3p4.css" rel="stylesheet">
```

## 不同场景的 Hash 选择

| 场景 | 推荐 Hash | 原因 |
|------|----------|------|
| **单页应用** | `chunkhash` | 不同路由懒加载，各自更新 |
| **多页应用** | `chunkhash` | 每个页面独立更新 |
| **组件库** | `contenthash` | 各组件独立发布 |
| **静态资源** | `contenthash` | 图片、字体等很少变化 |
| **开发环境** | 不用 hash | 方便调试 |

## 实际效果演示

### 第一次构建
```
main.a1b2c3d4.js  (100KB)
vendors.e5f6g7h8.js (500KB)
style.m1n2o3p4.css (50KB)
```

### 修改 main.js 后
```
main.x1y2z3w4.js   (102KB)  // ✅ main 变了
vendors.e5f6g7h8.js (500KB)  // ✅ 没变
style.m1n2o3p4.css (50KB)    // ✅ 没变
```

### 修改 style.css 后
```
main.a1b2c3d4.js   (100KB)   // ✅ 没变
vendors.e5f6g7h8.js (500KB)   // ✅ 没变
style.x1y2z3w4.css (52KB)    // ✅ 只有 style 变了
```

## 常见问题

### Q: 为什么修改 CSS 文件，JS 的 hash 也变了？
```javascript
// 如果使用 chunkhash，CSS 包含在 JS 入口中
// 改用 contenthash 分离 CSS
new MiniCssExtractPlugin({
  filename: '[name].[contenthash].css'
});
```

### Q: 为什么每次构建 hash 都变？
```javascript
// 检查是否有动态生成的内容
// 比如时间戳、随机数等
console.log(Date.now()); // ❌ 不要这样写
```

### Q: 如何查看 hash 对应的文件？
```javascript
// 使用 webpack-manifest-plugin
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');

new WebpackManifestPlugin({
  fileName: 'manifest.json'
});

// 生成 manifest.json
{
  "main.js": "main.8a2b3c4d.js",
  "vendors.js": "vendors.e5f6g7h8.js",
  "style.css": "style.m1n2o3p4.css"
}
```

## 总结

- **`hash`**：整个项目级别，适用于简单项目
- **`chunkhash`**：入口级别，适用于多入口项目
- **`contenthash`**：文件级别，适用于精确控制缓存

**最佳实践**：
- JS 文件用 `[chunkhash]`
- CSS 文件用 `[contenthash]`
- 图片字体用 `[contenthash]`
- 开发环境不用 hash
- 生产环境配合长期缓存策略



## Hash 是什么？

**Hash** 是一个**基于文件内容生成的唯一标识符**，就像文件的"数字指纹"。它是一串固定长度的随机字符（通常是字母和数字的组合）。

## Hash 的生成原理

### 1. **核心算法**
```javascript
// 伪代码：hash 生成过程
const crypto = require('crypto');

function generateHash(content) {
  // 1. 读取文件内容
  const fileContent = fs.readFileSync('file.js');
  
  // 2. 通过哈希算法计算
  const hash = crypto
    .createHash('md5')        // 使用 md5 算法
    .update(fileContent)      // 输入文件内容
    .digest('hex')            // 输出十六进制字符串
  
  return hash.slice(0, 8);    // 取前8位
}

// 示例
const content1 = 'console.log("hello")';
const content2 = 'console.log("world")';

console.log(generateHash(content1)); // '8a2b3c4d'
console.log(generateHash(content2)); // 'e5f6g7h8'
```

### 2. **webpack 中的计算过程**
```javascript
// webpack 内部简化实现
class Compilation {
  calculateHash() {
    // 1. 收集所有模块的内容
    const allModulesContent = this.modules
      .map(module => module.content)
      .join('');
    
    // 2. 计算总体 hash
    this.hash = crypto
      .createHash('md5')
      .update(allModulesContent)
      .update(JSON.stringify(this.outputOptions)) // 加入配置信息
      .digest('hex');
    
    // 3. 为每个 chunk 计算 chunkhash
    this.chunks.forEach(chunk => {
      const chunkContent = chunk.modules
        .map(module => module.content)
        .join('');
      
      chunk.hash = crypto
        .createHash('md5')
        .update(chunkContent)
        .digest('hex');
    });
  }
}
```

## 实际示例演示

### 示例1：文本文件
```javascript
// file1.txt 内容: "Hello World"
// 计算 hash
const hash1 = md5('Hello World'); 
// 结果: 'ed076287532e86365e841e92bfc50d8c'

// file2.txt 内容: "Hello World!"（多了一个感叹号）
const hash2 = md5('Hello World!');
// 结果: 'ed076287532e86365e841e92bfc50d8d'（完全不同！）
```

### 示例2：JavaScript 文件
```javascript
// main.js
import { add } from './math';
console.log(add(1, 2));

// math.js
export function add(a, b) {
  return a + b;
}

// webpack 打包后计算 hash
// 最终 hash = md5(main.js内容 + math.js内容)
```

## Hash 的特点

### 1. **唯一性**
```javascript
// 即使一个空格都会改变 hash
'hello'     // md5: '5d41402abc4b2a76b9719d911017c592'
'hello '    // md5: '5d41402abc4b2a76b9719d911017c593' 完全不同
```

### 2. **固定长度**
```javascript
// 不管内容多大，hash 长度固定
md5('a')                   // 32位: '0cc175b9c0f1b6a831c399e269772661'
md5('这是一段很长的文字...')  // 也是32位
```

### 3. **不可逆**
```javascript
// 从 hash 无法反推出原始内容
const hash = '5d41402abc4b2a76b9719d911017c592';
// 无法知道原文是 'hello'
```

## webpack 中的 Hash 生成

### 1. **整体流程**
```javascript
// webpack.config.js
module.exports = {
  output: {
    filename: '[name].[hash:8].js'  // 取前8位
  }
};

// 构建过程：
// 1. 读取所有文件
// 2. 合并所有文件内容
// 3. 计算 md5
// 4. 输出文件: main.8a2b3c4d.js
```

### 2. **不同级别的 Hash**
```javascript
// 项目级别 hash（所有文件）
// 计算方式：md5(文件A内容 + 文件B内容 + 文件C内容)
hash = md5(`
  import React from 'react'
  console.log('Hello')
  body { color: red }
`)

// chunk 级别 hash（入口及其依赖）
// 计算方式：md5(入口A相关所有文件内容)
chunkhash = md5(`
  // main.js
  import React from 'react'
  console.log('Hello')
`)

// 文件级别 hash（单个文件）
// 计算方式：md5(文件内容)
contenthash = md5(`
  body { color: red }
`)
```

## 手动计算 Hash

### 使用 Node.js
```javascript
const crypto = require('crypto');
const fs = require('fs');

// 1. 计算字符串 hash
function hashString(str) {
  return crypto
    .createHash('md5')
    .update(str)
    .digest('hex');
}

console.log(hashString('Hello World'));
// 'ed076287532e86365e841e92bfc50d8c'

// 2. 计算文件 hash
function hashFile(filePath) {
  const content = fs.readFileSync(filePath);
  return crypto
    .createHash('md5')
    .update(content)
    .digest('hex');
}

console.log(hashFile('./src/main.js'));
// '8a2b3c4d5e6f7g8h9i0j...'

// 3. 取前8位
function shortHash(str) {
  return hashString(str).slice(0, 8);
}
```

### 使用命令行
```bash
# Linux/Mac
echo -n "Hello World" | md5sum
# ed076287532e86365e841e92bfc50d8c

# 文件 hash
md5sum main.js
# 8a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p main.js

# Windows
certutil -hashfile main.js MD5
```

## 实际应用场景

### 1. **文件版本控制**
```javascript
// 构建前
<script src="main.js"></script>
// 问题：更新后浏览器还用旧缓存

// 构建后
<script src="main.8a2b3c4d.js"></script>
// 文件变了，hash 就变，浏览器加载新文件
```

### 2. **缓存策略**
```javascript
// 服务器设置长期缓存
Cache-Control: max-age=31536000

// HTML 引用带 hash 的文件
<link href="style.a1b2c3d4.css" rel="stylesheet">
<script src="main.8a2b3c4d.js"></script>

// 文件更新后
<link href="style.e5f6g7h8.css" rel="stylesheet"> // 新文件
```

### 3. **文件完整性校验**
```javascript
// 下载文件后校验是否完整
const downloadedHash = md5(downloadedFile);
const expectedHash = '8a2b3c4d...';

if (downloadedHash === expectedHash) {
  console.log('文件完整');
} else {
  console.log('文件损坏');
}
```

## Hash 冲突的可能性

```javascript
// 理论上有冲突可能，但概率极低
// 2^128 种可能，比宇宙原子数还多

// 示例：两个不同内容产生相同 hash 的概率
const probability = 1 / Math.pow(2, 128);
// ≈ 2.9e-39，基本不可能发生
```

## 常用哈希算法对比

| 算法 | 长度 | 速度 | 安全性 | 适用场景 |
|------|------|------|--------|----------|
| MD5 | 32位 | 快 | 低（已破解） | webpack hash |
| SHA-1 | 40位 | 中 | 中 | Git |
| SHA-256 | 64位 | 慢 | 高 | 密码、证书 |

## webpack 中的 hash 配置

```javascript
module.exports = {
  output: {
    // 完整 hash
    filename: '[name].[hash].js',      // main.8a2b3c4d5e6f7g8h.js
    
    // 指定长度
    filename: '[name].[hash:8].js',     // main.8a2b3c4d.js
    
    // 不同级别
    filename: '[name].[chunkhash:8].js', // 入口级别
    filename: '[name].[contenthash:8].js' // 文件级别
  }
};
```

## 总结

**Hash 就是文件的数字指纹**：
1. **生成方式**：通过哈希算法（如 MD5）计算文件内容
2. **特点**：内容不变 hash 就不变，内容微变 hash 巨变
3. **作用**：版本控制、缓存管理、完整性校验
4. **在 webpack 中**：用于生成带版本号的文件名，实现精准缓存控制

简单理解：hash 就像是文件的"身份证号"，由文件内容唯一决定！