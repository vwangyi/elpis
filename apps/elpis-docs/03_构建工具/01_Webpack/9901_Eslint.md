# Eslint 


- https://github.com/eslint/eslint

- https://eslint.org/


Eslint是 检查js或jsx的语法规范。



## 使用Eslint 


- 
```js
// npm i eslint-webpack-plugin eslint -D 
const EslintWebpackPlugin = require('eslint-webpack-plugin')
exports.module = {
    plugins: [
        new EslintWebpackPlugin({
            
        })
    ]
}
```