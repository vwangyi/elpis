
# 插件

插件是一个拥有 install() 方法的对象

vue规定 所有vue插件都需要用 use方法 调用，use方法就会调用插件对象的install 方法 并且传染 vue实例

。当 app.use(插件) 时 会调用 install 方法。install 方法第一个参数是 app，第二个参数是 use 传递的第二个参数


```js
const myPlugins = {
   install(app, options) {}
}


app.use(myPlugins)
```