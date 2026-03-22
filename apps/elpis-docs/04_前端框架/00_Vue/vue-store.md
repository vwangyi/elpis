# DO、BO、DTO、VO 全面梳理


## DO（Data Object）数据对象
- 数据层，和数据库表一一对应，无业务逻辑，纯数据载体
- ✅ 与数据库表结构完全对应
- ✅ 包含所有字段（包括逻辑删除、创建时间等）
- ✅ 只有 getter/setter，无业务逻辑
- ❌ 不暴露给前端


## BO（Business Object）业务对象 - controller层
- 业务层，封装业务逻辑，可组合多个DO
- ✅ 聚合多个DO的数据
- ✅ 包含业务逻辑和方法
- ✅ 领域驱动设计（DDD）中的实体
- ✅ 内部使用，不直接暴露
 
## DTO（Data Transfer Object）业务对象 
- 传输层，前后端数据传输
- ✅ 用于接口参数和返回值
- ✅ 可能包含多个BO/DO的聚合数据
- ✅ 字段根据需要裁剪（可能比DO少 比如 没有password）
- ✅ 包含数据验证注解
- ✅ 字段名更友好，可能重命名


## VO（View Object）视图对象
- 展示层，前端展示数据，与UI强相关
- ✅ 专为前端展示优化
- ✅ 包含格式化后的数据
- ✅ 可能包含UI状态字段
- ✅ 字段名符合前端约定
- ✅ 可能有嵌套结构
- vo不建议复用 每个页面都有自己的vo，即使

## 123
- 数据层 -> 业务层 -> 传输层 -> 展示层


## xxx
```js
1 数据库  DO data object  数据库存储对象
2 业务数据 BO business object 
3 传输对象 DTO data transfer object
BFF 中间层 如果需要 后端给的数据和 视图数据一致 加一个BFF层处理
4 视图对象 view object

前端常做：
1 把 dto 处理成 vo 进行渲染 [store中 或 BFF。， store中存储的数据结构 就是前端的  view object  拿到 dto 转为 vo 存储到 store中]
2 把 vo 处理成 dto 传给后端 [store中 或 BFF。， store中存储的数据结构 就是前端的  view object  把store的 vo 转为 dto 发送给后端]
3 增加 BFF 层 把 dto 统一处理成 vo 
 
```
