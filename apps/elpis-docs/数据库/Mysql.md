+ 你说你会 mysql 接收拷打

mysql 

monggodB

kafaka







```sql
mysql -u账号 -p // 直接回车 手动输入密码 登录数据库
```

+ 基础语法

```sql

mysql -uroot -p123456; -- 登录数据库连接 root是账号 123456是密码
exit; -- 退出数据库连接 

show databases; -- 查看所有数据库

use 数据库名; -- 切换数据库

show tables; -- 查看数据库中所有表

describe student; -- 显示数据库中所有表的信息
 
create database if not exists `数据库名`; -- 如果不存在就创建数据库

drop database if exists `数据库名`; -- 如果存在就删除数据库
 
```



