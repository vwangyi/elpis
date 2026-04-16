# KoaRouter

- github：https://github.com/koajs/router
- 官网：https://www.npmjs.com/package/@koa/router

## 前端路由 vs 后端路由 

## Query参数 (Query Parameters)
query参数是什么：数据附加在 URL 的 `?` 后面，格式为 `key=value`，多个用 `&` 连接。


特点：
- 不适合敏感信息
- 数据量小
- 常用GET请求


> 后端接收
```js
router.get('/users', async (ctx) => { 
  const query = ctx.query; 
  const query = ctx.request.query;  // 常用这个  
});
```
> 前端传递
```js 
// 方式1：axios 传params  或 手动拼接  http://api.example.com/users?page=1&limit=10&sort=desc
axios.get('http://api.example.com/users', {
  params: {
    page: 1,
    limit: 10,
    sort: 'desc'
  }
})
// 方式1：直接在 URL 中拼接
fetch('http://api.example.com/users?page=1&limit=10&sort=desc')

// 方式2：使用 URLSearchParams
const params = new URLSearchParams({
  page: 1,
  limit: 10,
  sort: 'desc',
  keyword: '张三'
});
fetch(`http://api.example.com/users?${params}`)


// 方式4：手动拼接（注意编码）
const keyword = encodeURIComponent('张三');
fetch(`http://api.example.com/users?keyword=${keyword}`)
```


## 路径参数 (Path Parameters)
路径参数是什么：数据作为 URL 路径的一部分。（用冒号转义 表示是一个变量名而不是路径）


 **特点：**
- RESTful 风格，语义清晰
- 适合资源标识（ID、用户名等）
- 通常用于 GET、PUT、DELETE

> 后端定义
```js 
router.get('/users/:id/xixi', async (ctx) => {
  // 获取路径参数
  const id = ctx.params.id;        // '123'
  const { id: userId } = ctx.params;  // 解构赋值
  
  // 多个参数
  // 路由：/users/:userId/posts/:postId
  const { userId, postId } = ctx.params;
  
  ctx.body = { userId, postId };
});
```
> 前端发送
```js
// 方式1：直接拼接
fetch('http://api.example.com/users/123/xixi')

// 方式2：模板字符串
const userId = 123;
fetch(`http://api.example.com/users/${userId}/xixi`)

// 方式3：axios
axios.get(`http://api.example.com/users/${userId}/xixi`)
axios.get('/users/123/xixi')  // 相对路径
```

## headers参数（请求头参数）
- headers参数是什么： 

特点
- 传输元数据，而非业务数据
- 适合认证信息、内容类型说明


> 后端接收
```js
router.get('/users', async (ctx) => { 
  const headers = ctx.headers; 
});
```
> 前端传递
```js
// axios
axios.get('/users', {
  headers: {
    'Authorization': 'Bearer token123', 
    'Content-Type': 'application/json', 
  }
})
fetch('http://api.example.com/users', {
  headers: {
    'Authorization': 'Bearer token123', 
    'Content-Type': 'application/json', 
  }
}) 
```
## body参数（请求体参数）
- body参数是什么：数据以 JSON 字符串形式放在请求体中。

特点： 
- 支持复杂数据结构（对象、数组、嵌套）
- 数据量大，无大小限制（受服务器配置影响）
- 适合 POST、PUT、PATCH 请求
- 需要设置请求头 `Content-Type: application/json`
 

> 后端定义
```js 
router.post('/users', async (ctx) => {
  // 获取 JSON 数据
  const body = ctx.request.body; // 需要 koa-bodyparser 解析才能拿到body参数 
});
```
> 前端发送 
```js
// axios（会自动序列化转JSON字符串）
axios.post('http://api.example.com/users', { name: '张三'}) 

// 原生 fetch
fetch('http://api.example.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  // 传递的是JSON字符串
  body: JSON.stringify({ name: '张三' })
}) 
```

## 1. body传JSON字符串


## 2. body传FormData数据
特点：
- 场景是 大文件上传
- 可以同时传输文本和二进制数据
- 边界分隔符自动生成
- Content-Type 为 `multipart/form-data`

> 后端
```js
const Koa = require('koa');
const koaBody = require('koa-body');

app.use(koaBody({
  multipart: true,  // 支持文件
  formidable: {
    uploadDir: './uploads',  // 上传目录
    keepExtensions: true,    // 保留扩展名
    maxFileSize: 10 * 1024 * 1024  // 10MB
  }
})); 
router.post('/users', async (ctx) => { 
  const { body } = ctx.request;  // 需要koa-body解析 待验证
});
```

> 前端 
```js
// 方式1：从表单创建
const formData = new FormData(document.getElementById('myForm'));

// 方式2：手动构建
const formData = new FormData();
formData.append('name', '张三'); 
formData.append('tags', 'vue');
formData.append('tags', 'react');  // 同名可多个

// 发送
fetch('http://api.example.com/users', {
  method: 'POST',
  body: formData  // 不要手动设置 Content-Type，浏览器自动处理
})

// axios 自动处理
axios.post('http://api.example.com/users', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }  // 可选，axios 会自动设置
})
```
 

## 3. body传urlencoded字符串
- 数据以 `key=value&key2=value2` 格式传输。

特点：
- 类似 Query String 但放在 Body 中
- 适合简单表单数据
- Content-Type: `application/x-www-form-urlencoded`
- 数据量较小
 
> 后端
```js 
router.post('/users', async (ctx) => { 
  const { body} = ctx.request;  // 需要 koa-bodyparser 解析
});
```
> 前端
```js
// 方式1：手动构建
const data = 'name=张三&age=25&city=北京';

fetch('http://api.example.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: data
})

// 方式2：使用 URLSearchParams
const params = new URLSearchParams({
  name: '张三',
  age: 25,
  city: '北京'
});

fetch('http://api.example.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: params  // URLSearchParams 会自动转换
})

// 方式3：axios
axios.post('/users', 
  'name=张三&age=25',  // 字符串形式
  { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
)

// 方式4：axios 自动转换
import qs from 'qs';
axios.post('/users', 
  qs.stringify({ name: '张三', age: 25 })
)
```
 
 
## 4. body传 普通文本字符串 
## 5. body传 xml字符串
## 6. body传 其他格式 
 

> 后端
```js

router.post('/log', async (ctx) => {
  // 获取原始字符串
  const rawBody = ctx.request.rawBody;  // 需要配置才能获取
  
  // 或通过 Promise 获取
  const body = await new Promise((resolve) => {
    let data = '';
    ctx.req.on('data', chunk => data += chunk);
    ctx.req.on('end', () => resolve(data));
  });
  
  console.log('原始数据:', body);
  ctx.body = { received: body };
});
```
 
> 前端
```js 
fetch('http://api.example.com/log', {
  method: 'POST',
  headers: { 'Content-Type': 'text/plain' }, // 普通文本字符串
  body: '这是一条日志信息'
}) 
fetch('http://api.example.com/data', {
  method: 'POST',
  headers: { 'Content-Type': 'application/xml' }, // xml字符串
  body: '<user><name>张三</name><age>25</age></user>'
})
```
 

## Cookies

特点：
- 自动携带（同域）
- 适合会话标识、用户偏好
- 大小限制（4KB）
 
> 后端
```js
// 设置 Cookie
router.post('/login', async (ctx) => {
  ctx.cookies.set('token', 'abc123', {
    maxAge: 7 * 24 * 60 * 60 * 1000,  // 7天
    httpOnly: true,   // 防止 XSS
    secure: false,    // 开发环境
    sameSite: 'lax'
  });
  ctx.body = { success: true };
});

// 读取 Cookie
router.get('/profile', async (ctx) => {
  const token = ctx.cookies.get('token');
  const allCookies = ctx.cookies;
  
  if (!token) {
    ctx.status = 401;
    ctx.body = { error: '未登录' };
    return;
  }
  
  ctx.body = { token };
});
```

> 前端
```js
// 浏览器自动携带 Cookie，无需手动设置
fetch('/api/users', {
  credentials: 'include'  // 跨域时需设置
})

// axios
axios.get('/api/users', {
  withCredentials: true  // 跨域携带 Cookie
})

// 手动设置 Cookie（前端只能设置当前域）
document.cookie = "token=abc123; path=/; max-age=3600";
``` 

## 总结

> 后端定义
```js
// 1. 路径参数：/users/123
// 2. 查询参数：?include=posts,comments
// 3. 请求体：JSON 数据 || FromMeta数据
// 4. 请求头：Authorization
// 5. Cookie：自动携带
router.put('/users/:id/xixi', async (ctx) => { 
  const { params, query, headers, body } = ctx.request;  
});
```

> 前端传递
```js

fetch(`/users/${userId}/xixi?include=posts,comments`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token123',
    'X-Request-Id': 'req-456'
  },
  body: JSON.stringify({
    name: '张三',
    email: 'newemail@example.com',
    settings: { theme: 'dark' }
  }),
  credentials: 'include'  // 携带 Cookie
})
``` 

## 📋 总结对比表

| 方式 | 位置 | 大小限制 | 可见性 | 适用场景 | Content-Type |
|------|------|---------|--------|----------|--------------|
| Query | URL | ~2KB | 公开 | GET请求、筛选、分页 | - |
| Path | URL | 小 | 公开 | 资源ID | - |
| JSON Body | Body | 大 | 隐藏 | POST/PUT复杂数据 | `application/json` |
| FormData | Body | 大 | 隐藏 | 文件上传、混合表单 | `multipart/form-data` |
| URL-encoded | Body | 中 | 隐藏 | 简单表单 | `application/x-www-form-urlencoded` |
| Headers | Header | 中 | 公开 | 认证、元数据 | - |
| Cookies | Header | 4KB | 公开 | 会话、偏好 | - |

## ✅ 选择建议

- **查询/筛选** → Query Parameters
- **资源标识** → Path Parameters
- **提交表单数据** → JSON 或 URL-encoded
- **文件上传** → FormData
- **认证信息** → Headers (Authorization)
- **会话状态** → Cookies