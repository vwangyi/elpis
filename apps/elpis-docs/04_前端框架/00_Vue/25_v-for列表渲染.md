
### v-for 循环dom结构
```js 
v-for='(item,index) in arr' :key='id'

可遍历数组/对象/字符串/数字
:key 属性一般都取唯一标识的id 用来vue后台进行虚拟dom的diff算法
当数据发生变化时 新旧虚拟DOM进行对比

v-for  只要不报错 给不给key无所谓 
v-for=" (item, index) in arr " :key="item.id" 
// 下标 0 开始的 是数字  key 是字符串
v-for=" (val, key, index) in obj " :key="index" 
v-for="item in 10" :key="item"
```

### v-if  v-else-if v-else   v-show
```javascript
v-show='布尔值或表达式最终得到布尔'    条件渲染(动态控制display是否隐藏)
v-if='布尔值或表达式最终得到布尔'     条件渲染(动态控制节点是否存在) 可用< template >包裹  使用
v-else      条件渲染(动态控制节点是否存在)
v-else-if

// v-if 和 v-show 的应用场景
v-if 与 v-show 都能控制dom元素在页面的显示
v-if 相比 v-show 开销更大的（直接操作dom节点增加与删除）

用户操作导致经常切换 用 v-show   因为用户可能会频繁操作   (template 标签不能用v-show)
初始化渲染DOM时候 用 v-if/v-else 因为不需要频繁切换

v-show 底层是display:none 是直接从dom树中移除 所以默认 不能带动画 但可以用 vue提供的transition标签 实现动画

当v-if 和 v-show 都不能带动画时 可以用height 或 width 
根据top定位 就是从上往下滑动
根据bottom定位 就是从下往上滑动

``` 