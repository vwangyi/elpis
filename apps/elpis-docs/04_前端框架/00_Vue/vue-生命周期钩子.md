
# 生命周期钩子

 

-  Vue生命周期
  -  是什么
    -  Vue的生命周期有 4个阶段 8个钩子
    -  创建阶段
      -  创建之前 beforeCreate 可以拿到this 但拿不到this上的数据
      -  创建之后 created 可以this上的数据 不能拿到 dom，一般用于发请求
    -  挂载阶段
      -  挂载之前 模版已经编译 但没有挂载，还是拿不到dom
      -  挂载之后 可以拿到dom
    -  更新阶段
      -  更新之前，修改数据时候，内存中是同步修改的，但页面上的dom还没更新
        -  更新的是DOM
      -  更新之后，内存中的数据和页面上DOM的数据是一致的
    -  销毁阶段
      -  销毁之前，所有数据和事件 实例和子实例 都是可用的 ，一般用于销毁定时器 和 事件
      -  销毁之后，所有东西都没了
    -  和v3的区别
      -  新增 setup钩子
        -  在beforeCreate之前 新增 setup 而且setup是没有this的
      -  销毁阶段改名
        -  destory 改名 unmounted 为了更好的语义话，销毁和挂载相对应
      -  on前缀
        -  所有钩子都加了 on 前缀 

v-if 可以控制 子组件的初始化时机 


● 父子组件钩子执行顺序
  ○ 首先create mount update destroy 4个阶段顺序是不变的  
  ○ 加载阶段（用户进入 初始化）
    ■ beforeCreate    setup
    ■ created   setup
    ■ beforeMount
    ■ 子组件插在这里
      ● beforeCreate     setup
      ● created          setup 
      ● beforeMount
      ● mounted
    ■ mounted
  ○ 更新阶段 （用户操作 修改数据）
    ■ beforeUpdate
    ■ 子组件插在这里
      ● beforeUpdate
      ● updated
    ■ updated
  ○ 销毁阶段 （用户离开）
    ■ beforeDestroy
    ■ 子组件插在这里
      ● beforeDestroy
      ● destroyed
    ■ destroyed