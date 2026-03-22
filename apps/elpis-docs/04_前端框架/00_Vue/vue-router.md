
# VueRouter 


## hash和history区别

 hash模式history模式优缺点hash模式的好处是兼容性好 但是不支持微前端项目history的好处是更加美观、但是由于是模拟URL的变化、服务器并没有这个资源，刷新会存在404的问题，我们可以在Nginx上配置一下 找不到就返回 index.html




// 因为单页面只有一个页面，需要实现url改变 又不能跳转其他页面 所以不能用 正常的跳转页面


// hash模式
window.onhashchange = function(event) {
    var newURL = event.newURL.split('#/')[1]
    var oldURL = event.oldURL.split('#/')[1]

    var newPage = document.querySelector('.' + newURL);
    var oldPage = document.querySelector('.' + oldURL);

    // 切换显示目标页面
    newPage.style.display = 'block';
    oldPage.style.display = 'none';
}


Vue Router 是一个用于 Vue.js 应用的单页面应用（SPA）路由管理器。
  它允许你在 Vue.js 项目中实现客户端的页面导航，而不需要刷新整个页面。
通过 Vue Router，用户可以在不同的视图之间进行切换，浏览器的 URL 地址也会随之变化，
  但页面本身并不会重新加载。
单页面就是只有一个 html页面 单页面 内部跳转用 vue-router 
多页面跳转 就是 html 跳转 html 用 window.location 
    比如 location.repalce() 


单页面中 一级路由都会当为页面  vue-router 跳转的就是 一级路由之间的跳转 










## ======
如何创建router路由器对象
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const option = { 
  model: 'hash', // http://127.0.0.1:9601/#/system  兼容性好，不美观 (多学一招 如果是http请求 hash值不会带给服务器 #及其后面的值)
  model: 'history', // http://127.0.0.1:9601/system  兼容性不好，美观  需要后端配合解决404问题
  model: 'abstract',   
  scrollBehavior (to, from, savedPosition) {y: 0}, //  
  base: '/app', // 基础路径 默认值为 /
  routes: [] // 路由表  注册了路由表 才可以跳转到对应的路由 
}
const routes = [
    {
        
    }
]
const router = 	new VueRouter(option)

// 把router对象 导出 挂在Vue实例上 或 调用API new Vue({ router: router })
export default router 
router 路由器对象 API
router.app 
router.mode // 路由器模式
router.currentRoute // 路由器的当前显示的路由



// push跳转 会把新路由追加到历史记录里面  可以用浏览器的后退按钮返回
router.push() 
// 路由跳转传参
// 方式1 传query参数 常用
router.push({
  path: `/home/login?name=${hello}&age=${19}` // 参数少用这个
})
router.push({
  path: '/home/login',
  query: { name: hello, age: 19 } // 参数多 用这个
}) 

route.query 接收

// 方式2 传params 路径参数 (不常用)
router.push({
  // 这里路径可以传递变量 那是因为 定义路由规则时 用了:变量名 占位 
  // path: '/home/login/:id/:xixi/index'
  path: `/home/login/${变量}/${变量}/index`
})
//  （参数传的多 用这个方便）
router.push({ 
  name: 'hello',   
  params: {
    name: hello, // 即使这里可以指定参数名 这里的key也应该和 路由表中的path里面的占位名一致  
    age: 19
  }
})
route.params 接收



router.replace() // replace跳转 会把新路由替换掉最后一个历史记录 不能用浏览器的后退按钮返回
router.go(-1)
router.back()
router.forward() 

// 路由器的 前置守卫  to是新路由 from是之前路由 next()是放行
router.beforeEach((to, from, next) => {}) 

// 全局守卫 这和 router.beforeEach 类似，
区别是在导航被确认之前，同时在所有组件内守卫和异步路由组件被解析之后，解析守卫就被调用。 
router.beforeResolve((to, from, next) => {})

// 路由器的 后置守卫
router.afterEach((to, from) => {})

// 可以动态的添加路由到路由器中 route对象必须有唯一值name
router.addRoute()

// 获取所有route对象
router.getRoutes() 

// 当路由准备好了就会调用这个回调函数
router.onReady()
// 
router.onError(回调函数)

// next() 可以传递哪些参数
next() // 放行
next(false) // 跳转终止
next('/home') // 放行到某个地址
next({path:'/home'}) // 跳转到某个地址
next({name:'home'}) // 跳转到某个路由规则的name


route 路由对象 API

route.path // 获取当前路由的路径
route.params // 获取当前路由的params参数
route.query // 获取当前路由的query参数
route.fullPath // 获取当前路由的完整路径
route.matched // 当前路由的匹配到的路由规则

组件内新增守卫
组合式
import { 
  onBeforeRouteEnter, 
  onBeforeRouteUpdate, 
  onBeforeRouteLeave
} form 'vue-router' 

onBeforeRouteEnter((to, from, next) => {})


选项式
export default {
  template: `...`,
  beforeRouteEnter: function(to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
  },
  beforeRouteUpdate: function(to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
    // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 可以访问组件实例 `this`
  },
  beforeRouteLeave: function(to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
  }
} 


组件内新增标签
// router-view 路由的出口
<router-view></router-view>
     // 对于不展示的 路由组件  默认是销毁的
    // 用 <keep-alive></keep-alive> 包裹则可以让不展示的组件不销毁 保持挂载
    // 添加 include 属性 可以指定 缓存哪个组件  

  <!--  缓存一个  -->
  <keep-alive include='组件名'>
    <!--   一般是 <router-view /> 也可以是其他组件 用keep-alive包裹一下   -->
    <router-view />
  </keep-alive>

  <!--  缓存多个  -->
  <keep-alive :include="['组件名1', '组件名2']">
    <router-view />
  </keep-alive>



  <!-- vue3写法 -->
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>

</template>




  

// router-link 底层就是 a标签 
<router-link></router-link>
<router-link /> 默认是push模式 下面是开启replace模式
<router-link replace />    
<router-link :replace="true" />    
<router-link to="/about" active-class="类名" />  
<router-link to="/home/login?name=zs&age=18"></router-link>

//   to属性 传字符串 会被 当作 path来处理
//   to属性 传对象 这个对象 和 push方法的对象写法一样

//   push函数也可以传字符串 会被 当作 path来处理

router 路由器跳转 传参数

需要整理
整理
vue-router3
// npm i vue-router@3

// 第一步 拿到VueRouter构造函数
import VueRouter from 'vue-router'

// 第二步 Vue规定插件调用use方法
Vue.use(VueRouter) // 这是Vue规定的 调用use方法 就有乐router配置项 new Vue({ router: router })

// 第三步 把类实例化为对象
const router = new VueRouter({...})



// 第四步 实例化需要的配置参数 options 
const options = { 
  model: 'hash', // http://127.0.0.1:9601/#/system  兼容性好，不美观 (多学一招 如果是http请求 hash值不会带给服务器 #及其后面的值)
  model: 'history', // http://127.0.0.1:9601/system  兼容性不好，美观  需要后端配合解决404问题
  model: 'abstract',   
  scrollBehavior (to, from, savedPosition) {y: 0}, //  
  base: '/app', // 基础路径 默认值为 /
  routes: [] // 路由表

  // 其他见官网
}  

const routes = [
  { 
    path: 'home', // 不以斜杠/开头 会默认拼接所有父级路由的路径 path: '/一级父/二级父/.../N级父/about' ] 
    path: '/home',  // 以斜杠/开头 不会拼接父级路由的路径 path: '/about' 
    path: '', // 空字符串 代表默认子路由 会拼接所有父级路由的路径 既然是空字符串 就相当于没有 仍然会拼接所有层级的父级路由 
    path: '*'  // 会匹配所有路径 
    path: '/user-*' // 会匹配以 `/user-` 开头的任意路径 
    path: 'home/:id', // 有冒号前缀 类似转义 表示这是一个占位的变量    // 动态路径参数   /user/:username/post/:post_id 

    name: 'Home', // 建议每个route都要有name属性 且唯一    path: '' 和name配置项 同时出现 会有一个警告 但是不影响使用

    component: () => import('@/views/Home.vue'), // 必须在父级组件里面 有一个占位标签 <router-view>  类似 <slot></slot>

    // 写了 redirect 只要访问这个path 直接就会重定向   
    // 一般应用在父路由 因为既然是父路由 一定有子路由  既然有子路由 我们不期望用户只是访问父路由 要不然子路由部分显示什么呢 
    // 所以 如果用户直接访问了父路由 我们认为 用户是想访问 父路由下的某一个路由 所以就重定向到父路由下的某一个子路由
    // 但是也可以重定向到 其他路由去
    redirect: '/home/index', // 字符串写法  重定向到 /home/index
    redirect: { name: 'Home' }, // 对象写法 重定向到 Home路由的组件 
    redirect: function(route) { return '/home/index' return {name: 'Home'}}, // 回调函数 可以接收到 目标的路由route  需要return 字符串路径或对象

    props: true, // 布尔值写法 如果为真 跳转时候 可以传递参数 在vue组件的props配置项接收
    // props:  

    alias: '/b' // 别名

    beforeEnter: function(to, from, next) {}, // 路由独享守卫

    meta: { /* 自定义配置项 统一写在meta里面 写在meta同级不规范 */ }, 
    children: [] // 和routes一样 表示子路由

  }
]



// 第五步 把router对象传递给Vue实例
import router from './router'
new Vue({ router: router })


// 第六步  路由器实例对象router   有一些方法和属性
import router from './router' // this.$router 


 

 



## ========
activated deactivated
// 路由组件激活时触发     具体应用场景不详
activated(){}
// 路由组件 失活时触发    具体应用场景不详
deactivated(){}


路由传参数方式
```js
路径参数 params
问号参数 query
// 不是网络请求 没有请求体参数
组件参数 props

路由跳转可以传递给组件的props参数
应用场景就是  一个页面被多个路由引用 但是每个路由引用的时候 传递的参数不一样
比如 商品详情页 可以是 易购区 0元区 代理区 保养区 这是组件内部定义 props参数 area: 0123 路由跳转过来 必传area参数
area: 0, //0123
id: 1, //商品id

如果不用props 而传递query参数 然后赋值给data里面 这种做法很low
```
完整的导航解析流程

```js
// 1 导航被触发。 (用户主动触发 或者 程序触发 )
// 2 在失活的组件里调用 beforeRouteLeave 守卫。
// 3 调用全局的 beforeEach 守卫。
// 4 在重用的组件里调用 beforeRouteUpdate 守卫 (2.2+)。
// 5 在路由配置里调用 beforeEnter。
// 6 解析异步路由组件。
// 7 在被激活的组件里调用 beforeRouteEnter。
// 8 调用全局的 beforeResolve 守卫 (2.5+)。
// 9 导航被确认。
// 10 调用全局的 afterEach 钩子。
// 11 触发 DOM 更新。
// 12 调用 beforeRouteEnter 守卫中传给 next 的回调函数，创建好的组件实例会作为回调函数的参数传入。


//  路由跳转4步曲 
// 1 点击路由跳转 (router-link标签 或者编程式路由导航 router.push | router.replace)
// 2 引起地址变化 (也可以手动修改地址栏) history.pushState()  history.replaceState()
// 3 匹配路由规则 (根据地址栏的地址 匹配路由规则)
// 4 成功跳转页面 (匹配到路由规则后 展示对应的组件) <router-view /> (路由组件) <keep-alive /> (缓存组件)
// 开始执行vue组件的生命周期钩子   
// 6 路由传参
 
```
url 
```js 
#  url 由哪几部分组成 必须熟悉
#  http://www.baidu.com:8080/path/haha/hehe?name=zhangsan&age=18#name
   协议:// 域名或ip地址 :端口号  /路径 ?参数名=值&参数名=值#哈希值

# 路由组件传参有几种方式？     xxx/xxx/123   xxx/xxx?id=123

# query参数(放url的?后面)   属于url的 ?后面的参数  /xx/xx?name=zs&age=18  不需要占位  类似于get请求

# params参数(放url的路径中) 属于url的 路径 中的一部分 配置路由规则时需要占位 /xx/:自定参数名  类似于post请求

# props参数(放路由规则的props属性中)  属于路由规则的配置项  一般配合路由规则的props属性使用


```

router的params参数. 
```js
//  （参数传的少 用这个方便）
this.$router.push({ 
  // 这里路径可以传递变量 那是因为 定义路由规则时 用了:变量名 占位 
  path: `/home/login/${hello}/${19}/index`    // 动态路由 动态路径的意思
}) 
//  （参数传的多 用这个方便）
this.$router.push({ 
  name: 'hello',   
  params: {
    name: hello, // 即使这里可以指定参数名 这里的key也应该和 路由规则中的占位名一致  
    age: 19
  }
})
// 组件内部接收 route的params参数
const params = this.$route.params
```

router的query参数
```js

多组key=value 用&连接 用?开头 直接拼在url上面 

// 直接拼在url的?后面 （参数传的少 用这个方便）
this.$router.push({
  path: `/home/login?name=${hello}&age=${19}`
})

// 通过query对象传参 （参数传的多 用这个方便）
this.$router.push({
  path: '/home/login',
  query: {
    name: hello,
    age: 19
  }
})

// 组件内部接收 route的query参数
// const query = this.$route.query
// 一般不要用query传对象 传对象url不好看
 
```
router的props
```js
// 1 给路由规则的 props 属性 传递一个布尔值  会把路由跳转时传递的 params对象 传递到组件的props里面 所以组件的props必须接收一下
{
  path: '/home/login',
  component: Login,
  props: true // 会把接收到 params对象的 键值对 传递到组件的props里面 所以组件的props必须接收一下
} 

// 2 给路由规则的 props 属性 传递一个对象   不用 因为 这个对象是死值 一般不用
{
  path: '/home/login',
  component: Login,
  props: { name: 'zs',  age: 18 } // 会把对象里面的键值对 传递到组件的props里面 所以组件的props必须接收一下
}

// 3 给路由规则的 props 属性传递一个函数返回一个对象  可以把query对象的数据传递到组件的props里面
{
  path: '/home/login',
  component: Login, 
  // 函数返回一个对象 函数可以接收到$route对象 就可以把$route对象里面的数据传递到组件的props里面  组件的props必须接收一下
  props: ($route) => ({ name: route.query.name, age: route.query.age }) 
}
```



this.$router.push({
   // 可以同时传递 params 和 query 不能用path 只能用name 因为会传递params对象 会对路径有变动
  name: 'hello', 
  params: {
    name: hello,
    age: 19
  },
  query: {
    name: hello,
    age: 19
  }
})


路由传参面试题
```js
# 路由传参指定path跳转 不能和params参数使用 但path可以和query参数使用

# 如果路由已经占位接收 但不传params参数  url就会出现问题
# 如何指定params参数可传可不传?  path: "/search/:keyword?"

# params参数 如果传递的是空字符串 路径出现问题无法跳转 怎么解决?
# 用undefined解决   `params: { keyword: '' || undefined }`

# 路由组件能不能传递props数据？ 可以
```