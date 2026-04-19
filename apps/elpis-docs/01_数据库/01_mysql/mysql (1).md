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




##  


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
