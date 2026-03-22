# ajax课程todo练习服务

## 启动

```shell
docker-compose build
docker-compose up -d
```

## 接口文档

### 增

> 服务地址: 'http://192.168.26.24/todo'
> 请求方法: 'POST'
> 参数:
>
> - `name`: 姓名
> - `description`: 描述

> 响应:
>
> - `code`: 状态码
> - `msg`: 消息

### 删

> 服务地址: 'http://192.168.26.24/todo/:{id}'
> 请求方法: 'DELETE'
> 响应:
>
> - `code`: 状态码
> - `msg`: 消息

### 改

> 服务地址: 'http://192.168.26.24/todo/:{id}'
> 请求方法: 'PUT'
> 响应:
>
> - `code`: 状态码
> - `msg`: 消息

### 查

#### 查询所有

> 服务地址: 'http://192.168.26.24/todo/list'
> 请求方法: 'GET'
> 响应:
>
> - `code`: 状态码
> - `msg`: 消息
> - `data`: 数据

#### 查询单个

> 服务地址: 'http://192.168.26.24/todo/:{id}'
> 请求方法: 'GET'
> 响应:
>
> - `code`: 状态码
> - `msg`: 消息
> - `data`: 数据
