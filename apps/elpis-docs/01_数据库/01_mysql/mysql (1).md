作为一名前端也必须学好数据库 另外学好数据库和Java完全没有关系！！！！！！ 

+ 数据库应用场景： 当我们需要持久化存储（存在硬盘上）就需要存储到数据库中





## sql语法


+ 

## 数据库的 数据类型
> 数值
>

+ tinyint  十分小的数据。     占1字节
+ smallint。 较小的数据       占2个字节
+ mediumint。中等大小的数据   占3个字节
+ int          标准的整数            4个字节。 最常用 
+ bigint      较大的数据            8个字节
+ float。       浮点数               4个字节
+ double       浮点数双精度      8个字节
+ decimal。    字符串形式的浮点数        金融系统的钱 一般是decimal类型



> 字符串
>

+ char    字符串固定大小的   0-255
+ varchar。    可变字符串        0-65535   常用 
+ tinytext       微型文本           2^8 -1      
+ text           文本串               2^16 - 1.     保存 大文本



> 时间 日期
>

+ date  YYYY-MM-DD  日期格式
+ time  HH: mm: ss.    时间格式
+ datetime YYYY-MM-DD HH: mm: ss   最常用的时间格式
+ timestamp 时间戳         较为常用
+ year。  年份



> null
>

+ 没有值 





## 数据库的字段属性 （重点）


Unsigned：

+ 无符号的整数
+ 声明了 该列 不能为负数





zerofill:

+ 0填充
+ 不足的位数 用0填充。int(3) , 5 >>> 005



自增：

+ 通常理解为自增，自动在上一条记录的基础上 + 1 （默认）
+ 通常用来设计唯一的主键 index 必须是整数类型
+ 可以自定义设计主键自增的起始值 和 步长



非空

+ 非空就是不能为nulll



默认：

+ 设置默认值
+ 比如 性别默认为未知



注释：

+ 



## 创建 表
+ 重点： 在实际 工作中 创建表一般是用可视化界面创建 然后通过查看历史记录得到 sql语句 （这是最快的）

```sql

show create database 数据库名 -- 查看已经创建库的sql语句
show create table 数据表名 -- 查看已经创建表的sql语句。重点 
desc 表名 -- 显示表结构
```



```sql
-- 语法公式
create table [if not exists] `表名` (
  `字段名` 列类型 [属性] [索引] [注释],
  ...
  `字段名` 列类型 [属性] [索引] [注释]
)[表类型] [字符集类型] [注释]
```

```sql
  -- 字段名和数据类型 必须在前面   表名和字段名尽量用``包裹
create table if not exists `student` (

  -- not null 表示非空
  -- default null 表示设置默认值为null
  -- auto_increment 表示自增
  -- comment '' 表示写注释
  `id` int(4) not null auto_increment comment '这是表示学号',
  `name` varchar(30) not null default '未知用户' comment '这是表示姓名',
  `pwd` varchar(20) not null default '123456' comment '这是表示姓名',
  `gender` varchar(2) not null default '女' comment '这是表示性别',
  `birthday` datetime default null comment '这是表示出生日期',
  `address` varchar(100) default null comment '这是表示家庭住址',
  `email` varchar(50) default null comment '邮箱',
  -- 设置 这张表的主键为 id 
  primary key(`id`)
   
) engine=innodb default charset=utf8

```

## 修改
> 修改 数据库表字段
>

```sql
-- 修改表名  
语法： alter table 旧表名 rename as 新表名
alter table teacher rename as teacher1;

-- 增加表字段
语法： alter table 表名 add 字段名 列属性;
alter table techer1 add age int(11);

-- 修改表字段
语法： alter table 表名 modify 字段名 [列属性];   -- modify 只能修改字段类型和约束
alter table teacher modify age varchar(11); -- 修改约束  

语法： alter table 表名 change 旧字段名 新字段名 [列属性]; -- change 不能修改字段类型和约束
alter table 表名 change age age1 int(1); -- 字段重命名


-- 删除表字段
语法： alter table 表名 drop 字段名;
alter table teacher drop age1;
```



> 删除 数据库表字段
>

```sql
语法： drop table [if exists] 表名; 
drop table if exists teacher1; -- 删除表
```

== 所有的创建和删除 尽量加上判断 以免报错 ==





## 表和表的 外键关系
+ 为什么了解即可 在应用层（node代码实现）外键关系 而不是用sql语言实现
+  因为会阿里巴巴规范中规定 <font style="color:#000000;">【强制】不得使用外键与级联，一切外键概念必须在应用层解决。</font>
+ <font style="color:#000000;">每次做DELETE 或者UPDATE都必须考虑外键约束，会导致开发的时候很痛苦,测试数据极为不方便。</font>







```sql
1 外键是什么（非常重要）

  外键就是两张表的关系：比如有 两张表 学生表和年级表 
  学生表中 某个学生的grade列 引用了 年级表的id (约束）。这就表示 学生表是主表 年级表是从表

  不能先删除主表 （从表无法独立存在 所以不能先删除主表）


2 sql实现外键关系 (物理外键 在硬盘上)
  2.1 创建表的时候 增加约束 （具体sql语法 百度）
  2.2 给已经创建好的两张表 增加约束 （具体sql语法 百度）


3 编程代码实现外键关系 （在代码层面）


```





##  
 

## 分页和排序
> 排序 order by
>

```sql
-- 语法： order by 字段 排序类型。 -- 排序类型 只有 升序asc 降序desc 两种

-- 需求 通过分数字段进行 成绩的 升序和降序 
select s.`StudentNo`, `StudentName`, `subjectName`, `studentResult`
from student as s
inner join result as r
on s.StudentNo = sub.`SubjectNo`
inner join `subject` as sub
on r.`SubjectNo` = sub.`SubjectNo`
where subjectName = '数据结构-1'
order by StudentResult asc
```



> 分页 limit 
>

```sql
-- 100万条数据
-- 为什么要分页？ 缓解数据库压力。一次性查询100万费劲 

-- 前端的UI组件库 分页器 是没有完整的全部表格数据的 而是点击下一页请求后端接口来获取下一页

-- 分页 limit (起始下标, )


select s.`StudentNo`, `StudentName`, `subjectName`, `studentResult` -- 查询的字段
from student as s -- student表
inner join result as r -- 连接result表
on s.StudentNo = sub.`SubjectNo` -- 条件
inner join `subject` as sub -- 连接student表
on r.`SubjectNo` = sub.`SubjectNo` -- 条件
where subjectName = '数据结构-1' -- 条件
order by StudentResult asc -- 排序 

-- 分页语法：limit 起始下标,每页条数
-- 例如：limit 5,10 将返回从下标5开始的10条数据 
limit 5,5  

-- 第一页 limit 0,5    >>> (pageIndex-1) * 5
-- 第二页 limit 5,5    >>> (pageIndex-1) * 5
-- 第三页 limit 10,5   >>> (pageIndex-1) * 5   
-- 第n页  						  >>> limit (pageIndex-1) * pageSize, pageSize 

-- 一页多少条 pageSize 
-- 当前页 pageIndex  
-- 总页数。>>> 数据总条数 / pageSize 
-- 总条数  total  



-- pageSize 一页多少条
-- (当前页 - 1) * pageSize  起始页 
-- total 总条数
-- n就是当前页
-- 数据总数 / 页面大小 = 总页数 


-- 思考 
-- 查询 “java第一学年” 课程成绩排名前十的学生 并且分数套大于80的学生信息
-- （字段为 学号 姓名 课程名称 分数 ）

select s.`StudentNo`, `StudentName`, `SubjectName`, `StudentResult`
from `student` as s
inner join `result` as r 
on s.StudentNo = r.studentNo 
inner join `subject` as sub 
on sub.`SubjectNo` = r.`SubjectNo`
where SubjectName = 'Java第一学年' and StudentResult >= 80
order by StudentResult desc 
limit 0,10

```

## 常用函数 分组和过滤
```sql

-- count 计数 统计一张表中多少条数
-- sum 求和
-- avg 平均值
-- max 最大值
-- min 最小值 

select count(studentname) from student; -- count(字段) 会忽略所有的null值
select count(*) from student; -- count(*) 不会忽略null值 本质计算行数
select count(1) from result; -- count(1) 不会忽略null值 本质计算行数

select sum(`studentResult`) as 总和 from result;
select avg(`studentResult`) as 平均分 from result;
select max(`studentResult`) as 最高分 from result;
select min(`studentResult`) as 最低分 from result;



-- 查询不同课程的平均分 最高分 最低分 
-- 核心是 根据不同的课程分组

select SubjectName, avg(studentResult),max(studentResult),min(studentResult)
from result as r 
inner join `subject` as sub
on r.`subjectNo` = sub.`SubjectNo`

-- 查出结果为 一条  因为维度是表 所有最高 最低 平均值 只有一条
列名： subjectName avg(studentResult) max(studentResult) min(studentResult)
       高等数学          803021          100                60

       
select SubjectName, avg(studentResult),max(studentResult),min(studentResult)
from result as r 
inner join `subject` as sub
on r.`subjectNo` = sub.`SubjectNo`
group by r.subjectNo -- 通过什么字段来分组   

-- 查出结果为 多条  因为维度是字段  
列名： subjectName avg(studentResult) max(studentResult) min(studentResult)
       高等数学            803021          100                60
       高等数学-1          803021          100                60

-- 分组和过滤
select 
    SubjectName, 
    avg(studentResult) as 平均分,
    max(studentResult) as 最高分,
    min(studentResult) as 最低分
from result as r 
inner join `subject` as sub
on r.`subjectNo` = sub.`SubjectNo`
group by r.subjectNo -- 通过什么字段来分组   
having 平均分 > 80 -- group by 分组后 条件用 having 过滤
```

###  


###   




