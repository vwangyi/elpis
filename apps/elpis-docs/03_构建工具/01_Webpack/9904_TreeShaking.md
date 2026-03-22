 
# TreeShaking 树摇
- https://webpack.js.org/guides/tree-shaking/


- 是什么：树摇依赖于 es module。那些引入却没有使用的模块就会移除。
- 作用：减少代码体积


>  
>

## 
## 
## 问：tree shaking树摇 
+ Tree-Shaking
    - 是什么
        * Tree Shaking就是树摇 根据es module  把引入但没有使用的模块 摇下来
    - 怎么用
        * webpack5 默认开启treeshaking 
            + optimization.usedExports 为true 也是默认值



## 设置中打开录屏
柜员复现问题 

## -------------




## 
## 


## 问：代码规范
+ eslint 
+ prettier
+ stylelint 
+ husky 

 



 

### 
### 
### 


+ 



+ 



+ 




## 19. webpack treeShaking机制的原理
+ treeShaking 也叫摇树优化，是一种通过移除多于代码，来优化打包体积的，生产环境默认开启。
+ 可以在代码不运行的状态下，分析出不需要的代码；
+ 利用es6模块的规范 
    - ES6 Module引入进行静态分析，故而编译的时候正确判断到底加载了那些模块
    - 静态分析程序流，判断那些模块和变量未被使用或者引用，进而删除对应代码
    - 

## 19. webpack treeShaking机制的原理
+ treeShaking 也叫摇树优化，是一种通过移除多于代码，来优化打包体积的，生产环境默认开启。
+ 可以在代码不运行的状态下，分析出不需要的代码；
+ 利用es6模块的规范 
    - ES6 Module引入进行静态分析，故而编译的时候正确判断到底加载了那些模块
    - 静态分析程序流，判断那些模块和变量未被使用或者引用，进而删除对应代码
    - 

### 
