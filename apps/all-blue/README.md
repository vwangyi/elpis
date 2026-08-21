# 山治的梦想 ------ 传说之海 AllBlue

- `npm i -g @nestjs/cli`: `用npm全局下载nest命令 得到nest命令`

- `nest g res 模块名`: `新增一个模块`
- `nest g mi 模块名`: `给这个模块加中间件`
- `nest g gu 模块名`: `给这个模块加路由守卫`

- `nest build -b webpack`: `打包`

## 接口

开始写nest接口了 （需要看完所有nest课程）

user模块

redis

登录状态持久化

1. cookie （客户端）
2. localStorage/sessionStorage （客户端）
3. session （服务端）
   4.jwt token （服务端）

客户端不安全 js可以直接操作cookie和web storage

Session+cookie方案 需要多 维护一张表（服务器成本高一般只有有钱的大厂会采用这个方案，只考虑安全 不考虑维护成本 不缺钱就用这个）

Jwt方案（是大中小厂都会使用的方案 既考虑服务器维护成本 又考虑安全 就用 jwt）

Auth权限模块
User用户模块

RBAC权限管理 和 ACL

user表 role表 权限表

1. 写entity实体 或 数据库表
   用@Entity() 修饰类
   用@PrimaryGeneratedColumn修饰id 表示 自增id
   用@Column() 表示是一个普通列
   @OneToOne() 表示 一对一
   @OneToMary() 表示 一对多
   @MaryToOne() 多对一
   @MaryToMary() 多对多
   @JoinColumn()
   @JoinTable()

2. 写service
   用@Injectable() 修饰类 表示是可注入的类
   用 @InjectEntityManager() 或 @InjectRepository() 来操作数据库
   entityManager方式是事务常用（同时操作多张表）repository是操作一张表

3. 写controller  
   用@Controller修饰类、
   用@Inject() 修饰注入的service 、
   用@Post @Get等 修饰方法、
   用@Body @Param @Query修饰 接收前端传递的参数）
   写守卫
   自定义装饰器

先在module里面exports导出当前service 其他模块的controller中通过 @Inject() 引入service

POST /todo
DELETE /todo/:id

发布订阅模式 websocket 前端发布消息 后端订阅 或 后端发布消息 前端订阅
