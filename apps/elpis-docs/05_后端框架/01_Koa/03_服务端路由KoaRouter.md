# KoaRouter

- github：https://github.com/koajs/router
- 官网：https://www.npmjs.com/package/@koa/router





## 前端路由 vs 后端路由



## 后端路由



## Query参数
query参数是什么：数据附加在 URL 的 `?` 后面，格式为 `key=value`，多个用 `&` 连接。


特点：
- 不适合敏感信息
- 数据量小
- 常用GET请求



# HTTP 数据传输详解

## 📊 HTTP 数据传输方式总览

HTTP 协议中，前端可以通过多种方式向后端传递数据，后端也有不同的接收方式。下面详细说明：

## 一、URL 中的数据传输

### 1. **Query Parameters（查询参数）**
数据附加在 URL 的 `?` 后面，格式为 `key=value`，多个用 `&` 连接。

**特点：**
- 可见于 URL，数据量小（通常 < 2KB）
- 适合 GET 请求、筛选条件、分页参数
- 所有用户可见，不适合敏感信息

**前端发送方式：**

```javascript
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

// 方式3：axios 自动处理
axios.get('http://api.example.com/users', {
  params: {
    page: 1,
    limit: 10,
    sort: 'desc'
  }
})

// 方式4：手动拼接（注意编码）
const keyword = encodeURIComponent('张三');
fetch(`http://api.example.com/users?keyword=${keyword}`)
```

**后端接收（Koa2）：**

```javascript
router.get('/users', async (ctx) => {
  // 获取所有查询参数
  const query = ctx.query;  // { page: '1', limit: '10', sort: 'desc' }
  
  // 获取单个参数
  const page = ctx.query.page;        // '1'
  const limit = ctx.request.query;    // 另一种写法
  const sort = ctx.query.sort;
  
  // 转换为数字类型
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  
  ctx.body = { page: pageNum, limit: limitNum };
});
```

### 2. **Path Parameters（路径参数）**
数据作为 URL 路径的一部分。

**特点：**
- RESTful 风格，语义清晰
- 适合资源标识（ID、用户名等）
- 通常用于 GET、PUT、DELETE

**前端发送方式：**

```javascript
// 方式1：直接拼接
fetch('http://api.example.com/users/123')

// 方式2：模板字符串
const userId = 123;
fetch(`http://api.example.com/users/${userId}`)

// 方式3：axios
axios.get(`http://api.example.com/users/${userId}`)
axios.get('/users/123')  // 相对路径
```

**后端接收（Koa2）：**

```javascript
router.get('/users/:id', async (ctx) => {
  // 获取路径参数
  const id = ctx.params.id;        // '123'
  const { id: userId } = ctx.params;  // 解构赋值
  
  // 多个参数
  // 路由：/users/:userId/posts/:postId
  const { userId, postId } = ctx.params;
  
  ctx.body = { userId, postId };
});
```

## 二、Request Body（请求体）

### 1. **JSON 格式（最常用）**
数据以 JSON 字符串形式放在请求体中。

**特点：**
- 支持复杂数据结构（对象、数组、嵌套）
- 数据量大，无大小限制（受服务器配置影响）
- 适合 POST、PUT、PATCH 请求
- 需要设置 `Content-Type: application/json`

**前端发送方式：**

```javascript
// 原生 fetch
fetch('http://api.example.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: '张三',
    age: 25,
    email: 'zhangsan@example.com',
    tags: ['developer', 'vue']
  })
})

// axios（自动序列化）
axios.post('http://api.example.com/users', {
  name: '张三',
  age: 25,
  email: 'zhangsan@example.com',
  tags: ['developer', 'vue']
})

// 使用 async/await
const submitData = async () => {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: '李四' })
  });
  const data = await response.json();
}
```

**后端接收（Koa2 + koa-bodyparser）：**

```javascript
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const app = new Koa();

app.use(bodyParser());

router.post('/users', async (ctx) => {
  // 获取 JSON 数据
  const body = ctx.request.body;
  
  // 获取具体字段
  const { name, age, email, tags } = ctx.request.body;
  
  // 验证数据
  if (!name) {
    ctx.status = 400;
    ctx.body = { error: '姓名不能为空' };
    return;
  }
  
  // 处理数据
  const newUser = {
    id: Date.now(),
    name,
    age: age || 0,
    email,
    tags: tags || []
  };
  
  ctx.body = { success: true, data: newUser };
});
```

### 2. **FormData 格式（文件上传 + 表单数据）**
用于上传文件和提交混合数据。

**特点：**
- 支持文件上传
- 可以同时传输文本和二进制数据
- 边界分隔符自动生成
- Content-Type 为 `multipart/form-data`

**前端发送方式：**

```javascript
// 方式1：从表单创建
const formData = new FormData(document.getElementById('myForm'));

// 方式2：手动构建
const formData = new FormData();
formData.append('name', '张三');
formData.append('age', '25');
formData.append('avatar', fileInput.files[0]);
formData.append('photos', fileInput2.files[0]);
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

**后端接收（Koa2 + koa-body）：**

```javascript
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
  // 获取文本字段
  const { name, age, tags } = ctx.request.body;
  
  // 获取文件
  const files = ctx.request.files;
  const avatar = files.avatar;
  const photos = files.photos;
  
  // 处理单个文件
  if (avatar) {
    console.log('头像:', avatar.name, avatar.size, avatar.path);
  }
  
  // 处理多个文件（同名）
  if (photos) {
    const photoList = Array.isArray(photos) ? photos : [photos];
    photoList.forEach(photo => {
      console.log('照片:', photo.name);
    });
  }
  
  ctx.body = { name, age, tags, fileCount: Object.keys(files).length };
});
```

### 3. **URL-encoded 格式（传统表单）**
数据以 `key=value&key2=value2` 格式传输。

**特点：**
- 类似 Query String 但放在 Body 中
- 适合简单表单数据
- Content-Type: `application/x-www-form-urlencoded`
- 数据量较小

**前端发送方式：**

```javascript
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

**后端接收（Koa2 + koa-bodyparser）：**

```javascript
// koa-bodyparser 自动解析 url-encoded
app.use(bodyParser());

router.post('/users', async (ctx) => {
  // 解析结果和 JSON 一样，都在 ctx.request.body
  const { name, age, city } = ctx.request.body;
  
  ctx.body = { received: { name, age, city } };
});
```

### 4. **Plain Text / XML / 其他格式**
直接发送纯文本或自定义格式。

**前端发送方式：**

```javascript
// 纯文本
fetch('http://api.example.com/log', {
  method: 'POST',
  headers: { 'Content-Type': 'text/plain' },
  body: '这是一条日志信息'
})

// XML
fetch('http://api.example.com/data', {
  method: 'POST',
  headers: { 'Content-Type': 'application/xml' },
  body: '<user><name>张三</name><age>25</age></user>'
})
```

**后端接收：**

```javascript
// 获取原始请求体
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

## 三、Headers（请求头）

**特点：**
- 传输元数据，而非业务数据
- 适合认证信息、内容类型说明

**前端设置方式：**

```javascript
fetch('http://api.example.com/users', {
  headers: {
    'Authorization': 'Bearer token123',
    'X-Request-Id': 'req-123456',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Custom-Header': 'custom value'
  }
})

// axios
axios.get('/users', {
  headers: {
    'Authorization': 'Bearer token123',
    'X-Custom-Header': 'value'
  }
})
```

**后端接收：**

```javascript
router.get('/users', async (ctx) => {
  // 获取单个请求头
  const auth = ctx.headers.authorization;
  const token = ctx.get('Authorization');  // 另一种写法
  const requestId = ctx.headers['x-request-id'];
  const contentType = ctx.headers['content-type'];
  
  // 获取所有请求头
  const allHeaders = ctx.headers;
  
  ctx.body = { auth: !!auth, requestId };
});
```

## 四、Cookies

**特点：**
- 自动携带（同域）
- 适合会话标识、用户偏好
- 大小限制（4KB）

**前端设置方式：**

```javascript
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

**后端设置和接收：**

```javascript
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

## 五、完整示例：多类型数据传输

### 前端综合示例

```javascript
// 同时使用多种方式传递数据
const userId = 123;

// 1. 路径参数：/users/123
// 2. 查询参数：?include=posts,comments
// 3. 请求体：JSON 数据
// 4. 请求头：Authorization
// 5. Cookie：自动携带

fetch(`http://api.example.com/users/${userId}?include=posts,comments`, {
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

### 后端完整接收

```javascript
router.put('/users/:id', async (ctx) => {
  // 1. 路径参数
  const userId = ctx.params.id;
  
  // 2. 查询参数
  const include = ctx.query.include;
  
  // 3. 请求体（JSON）
  const { name, email, settings } = ctx.request.body;
  
  // 4. 请求头
  const auth = ctx.headers.authorization;
  const requestId = ctx.headers['x-request-id'];
  
  // 5. Cookie
  const token = ctx.cookies.get('token');
  
  // 处理业务逻辑
  console.log({
    userId,
    include,
    name,
    email,
    settings,
    auth,
    requestId,
    token
  });
  
  ctx.body = {
    success: true,
    data: { id: userId, name, email }
  };
});
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