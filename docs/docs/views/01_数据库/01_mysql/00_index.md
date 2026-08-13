# mysql

 

```sql
mysql -u账号 -p // 直接回车 手动输入密码 登录数据库
```

+ 基础语法

```sql
-- ALTER USER 'root'@'localhost' IDENTIFIED BY '123456'; 
mysql -uroot -p123456; -- 登录数据库连接 root是账号 123456是密码
exit; -- 退出数据库连接 

SHOW VARIABLES LIKE 'port'; -- 获取端口 比如 3306 

SHOW VARIABLES LIKE 'bind_address'; -- 如果值是 0.0.0.0，表示监听所有网络接口。 如果值是 127.0.0.1，表示只允许本机连接。

show databases; -- 查看所有数据库

use 数据库名; -- 切换数据库

show tables; -- 查看数据库中所有表

describe student; -- 显示数据库中所有表的信息
 
create database if not exists `数据库名`; -- 如果不存在就创建数据库

drop database if exists `数据库名`; -- 如果存在就删除数据库
 
```

```sql 
-- 创建 root@% 用户并设置密码（请将 '你的密码' 替换为实际密码）
CREATE USER 'root'@'%' IDENTIFIED BY 'Root@123456';
 
-- 1. 授予所有数据库的所有权限给 root@%
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;

-- 2. 使权限立即生效
FLUSH PRIVILEGES;

-- 3. 验证授权是否成功
SHOW GRANTS FOR 'root'@'%';
```


