### insert 增
```sql

insert into 
t_user(`字段名1`, `字段名2`)
values(`值1`, `值2`), (`值11`, `值22`) -- 可以插入多行 
```

### delete 删
```sql
// 真删除 一般不用 常用伪删除
delete from `t_user` where id=1; -- 删除t_user表的 id为1的数据 

truncate `t_user`; // truncate: 完全清空一个数据库表 表结构和索引的约束不会变

delete 和 truncate 区别？
● 相同点： 都能删除数据 都不会删除表结构
● 不同：truncate 不会影响事务 ， truncate 重新设置自增列 计数器会归零
```

### update 改
```sql
// update 修改 一定要指定 where条件 表示修改谁 
-- 修改用户id为1的 昵称和密码 注意 不加where表示所有行
update `t_user` 
set `nickname`=`新昵称`, `pwd`=md5('123456')
where id=1
```

### 
### 问：select 基础查询
```sql
-- * 表示所有字段
select * from `t_user`
select `username`, `age` from `t_user`
-- as 起别名
select `username` as 用户名, `age` as 年龄 from `t_user` as table_user; 

-- distinct 表示把查询的字段去重 
select distinct `username` from `t_user`; 

-- concat函数  把查询username字段的结果数据都加了 `姓名：` 前缀
select concat('姓名：', username) as 新名字 from `t_user`;

select 1+1 as 结果 -- 可以用sql来计算
```

### 问：where条件查询
是什么：where 条件查询就是 给查询结果进行二次筛选符合条件的

```sql
-- 查询 用户年龄在 18-35的
select `age` from `t_user` -- 先查所有的
where age >= 18 && age <= 35; -- 筛选出符合条件的

select `age` from `t_user` 
where `age` between 18 && 35; -- between也可以表示某个范围

-- 排除20岁的
select `age` from `t_user`
where `age` != 20; 

-- 运算符
=           等于
!= 或 <>    不等
>           大于
<           小于
>=          大于等于
<=          小于等于
between     在某个范围内  // id between 2 and 5  id在2-5之间 包含2和5 
like        搜索某种模式

与或非：and(&&) or(||) not(!) 
```

### 问：where模糊查询
```sql

select `name`, `age`, `nickname`, `address`, `gender` from `t_user`
where name like `张__` -- 查询3个字的 姓张的
where name like `张_` -- 查询2个字的 姓张的
where name like `张%` -- 查询 姓张的
where name like `%瑶%` -- 查询 名字带瑶的
where nickname is null -- 查询 没有昵称的
where nickname is not null -- 查询 有昵称的
where `address` in ('北京', '上海', '广州', '深圳') -- 查询地址是 北上广深的
where `gender` in (1, 2) -- 查询 已知性别的 1男 2女 3未知

where age between 18 and 25; -- 查询 年龄在 18到25之间的 包含18和25 
```

### 问：join联表查询
+ 是什么：联表查询就是 两张表连起来查询，常见的有 left join 、right join、inner join
+ left join 就是 返回左表的所有字段
+ right join 是 返回右表的所有字段
+ inner join 是 返回两个表的交集字段
+ 应用场景：需要查询的字段 来自多张表 

```sql

-- 查询缺考的同学
select s.studentNo, studentName, SubjectNo, StudentResult   
from stdudent as s 
left join result as r on s.studentNo = r.studentNo 
where StudentResult is null   -- 缺考就是没成绩 那就是null

 
-- join（联接的表）on（判断的条件） 联接查询  （join 和 on结合 联接查询）
-- where   等值查询。                        （ where 是 等值查询 ）
 
// 目前有3张表：学生表student 成绩表result 科目表subject
// 查询参加考试的同学信息 查询字段有: 学号 学生姓名 科目名 分数

-- 确定最终查询的结果字段
select s.studentNo, studentName, SubjectName, `StudentResult`
from student as s -- 一张表
-- 使用 right join 连接成绩表。查询条件是 学号相同的
right join result as r on r.studentNo = s.studentNo
-- 使用 inner join 连接 科目表 查询条件是 科目名相同的
inner join `subject` as sub on r.SubjectNo = sub.SubjectNo

 
```



### 问：select 完整语法
<!-- 这是一张图片，ocr 内容为：SELECT完整的语法: LECT语法 SELECT [ALL I DISTINCT] {* I TABLE.* I [TABLE.FIELDILAS ALIASIL,TABLE.FIELDZTAS ALIAS2]],.........]]F [AS TABLE_ALIAS] FROM TABLE_NAME ,科目 [LEFT L RIGHT 4 --联合查询 INNER JOIN TABLE_NAME2] RESULT 指定结果需满足的条件 5 [WHERE ...] 9 指定结果按照哪几个字段来分组 [GROUP BY...] (---过滤分组的记录必须满足的次要条件 7 [HAVING] 指定查询记录按一个或多个条件排序 CORDER B IT {[OFFSET ,]ROW_COUNT | ROW_COUNTOFFSET OFFSET]]; [LIMIT 指定查询的记录从哪条至哪条 注意:[]括号代表可选的,{括号代表必选得 文山日风X/城 -->
![](https://cdn.nlark.com/yuque/0/2025/png/34696752/1747536815810-4f2ca8a9-7057-44fa-aef9-7b4d029402f1.png)

```sql

select [all | distinct] -- all表示查全部  distinct表示去重  all是默认的
{* | 表名.* | [表名.字段1[as 别名1][表名.字段2[as 别名2]] [, ...]} -- 哪些字段
from 表名[as 别名]
    [left | right | inner join 表名2] -- 联合查询 join 连接的表名 on 等值判断
    [where 条件表达式] -- 指定结果需要满足的条件  条件表达式可以是 具体的值或子查询语句
    [group by 字段] -- 查询的结果按照哪几个字段来分组 
    [having ] -- 二次过滤 过滤分组后的信息 和where一样 只是位置不同 having用于group by后 （百度 having和where区别）
    [order by 升序降序] -- 指定查询记录 按一个或多个条件 进行排序
    [limit 起始下标,一页多少条] -- 分页 limit 0,5 

{} 是必需的
[] 是可选的

查询：跨表（连表查询） 跨数据库（有些是 redis库查 有些是mysql库查） 
业务层面写 用后端语言node java等

视频资源 （一般放文件服务器 不会放数据库）
图片资源 （一般放文件服务器 不会放数据库）
评论等热点数据 （一般放redis数据库）
前端一个页面的动态数据 很可能是经过很多数据库查出来的

             


             
```

## 
### 问：数据库的三大范式
+ 原子性：保证数据库表的每一列不可再分原子性数据项（数据表的每一列 不可再分）
+ 每张表 只描述一件事情：确保数据库表中的每一列都和主键相关，而不是只与主键的某一部分相关（需要针对联合主键而言）
+ 数据表中的每一列数据都和主键直接相关，而不能间接相关。

### 问：数据库的事务
> 事务是一组原子性的操作，要么全部成功，要么全部失败
>

```sql
/*
    事务的特性
    1. 原子性
    2. 一致性
    3. 隔离性
    4. 持久性
*/

将一组sql放在一个批次执行 
事务原则: ACID 原则   原子性 一致性 隔离性 持久性 (脏读, 不可重复读, 幻读...)

原子性: 事务中的所有操作，要么全部成功，要么全部失败
一致性: 事务执行前后，数据的完整性没有被破坏
持久性: 事务一旦提交，对数据库的修改就是永久性的
隔离性: 事务之间相互独立，不会相互影响

隔离级别:
    1. 读未提交: 一个事务中的修改，即使没有提交，对其他事务也是可见的
    2. 读已提交: 一个事务中的修改，必须要等到提交之后，对其他事务才是可见的
    3. 可重复读: 一个事务中的查询，多次执行结果是一致的
    4. 串行化: 所有的事务，必须按照顺序逐个执行

隔离导致的问题: 脏读, 不可重复读, 幻读
    1. 脏读: 一个事务读取到另一个事务未提交的数据
    2. 不可重复读: 一个事务多次读取同一数据，结果不一致
    3. 幻读: 一个事务多次执行相同的查询，却得到了不同的结果集


create database shop character set utf8 collate utf8_general_ci;
use shop;

create table `account`(
    `id` int(3) not null auto_increment,
    `name` varchar(20) not null,
    `money` decimal(9, 2) not null,
    primary key(`id`)
)engine=innodb default charset=utf8;

insert into account(`name`, `money`) values('zhangsan', 1000), ('lisi', 1000);


-- 模拟转账: 事务
set autocommit=0; -- 关闭自动提交
start transaction; -- 开启事务

update account set money=money-100 where id=1;
update account set money=money+100 where id=2;

commit; -- 提交事务
rollback; -- 回滚事务

set autocommit=1; -- 恢复 默认值 开启自动提交


-- 了解
savepoint 保存点名; -- 保存点
rollback to savepoint 保存点名; -- 回滚到保存点
release savepoint 保存点名; -- 删除保存点


```

### 问：
阿里巴巴规范手册规定 关联查询不得超过3张表

成本 用户体验 性能 等做取舍

有时会故意增加冗余字段 让多表查询变为单表查询 

### 问：常见的表字段
+ id 主键
+ version 乐观锁
+ is_delete 伪删除
+ gmt_create 创建时间
+ gmt_update 修改时间





### 问：数据库迁移
+ 把本地数据库 迁移 到 云数据库 



