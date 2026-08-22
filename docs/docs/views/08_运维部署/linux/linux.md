## 
```shell
# 删除文件夹
rm -r 文件夹名称

# 删除文件
rm -r 文件

# 只是查看某个文件
cat example.txt




# 创建一个 nginx 使用的 资源目录
sudo mkdir -p /var/www/elpis

# 方法二：如果文件在服务器上，直接复制
cp -r /root/elpis-view/dist/* /var/www/elpis/

# 验证文件
ls -la /var/www/elpis/
```

## 输出
```shell
echo 123
```

## 端口占用
```shell
# 比如 当你 想要启动 8081端口时（或其他端口 3032等 ） 发现端口占用 

# 你一定要知道 你将要启动服务的端口号是多少 


mac
# 拿到 端口对应的 pid 
sudo lsof -i :8081 

# 杀掉端口
sudo kill -9 PID



window 



cd .. 
cd 目录
pwd 
rm -rf 文件夹  // 递归删除某个文件夹# mac 系统 自带命令


# 系统命令  mac window linux 统信国产系统

cd /usr/bin
pwd # 显示当前目录
ls # 显示当前目录下的文件
clear # 清屏
mkdir 文件夹名 # 创建文件夹
touch 文件名 # 创建文件
rm 文件名 # 删除文件
rm -rf 文件夹名 # 删除文件夹
mv 文件名 文件名 # 移动文件
cp 文件名 文件名 # 复制文件
cp -r 文件夹名 文件夹名 # 复制文件夹
cat 文件名 # 查看文件内容
echo '内容' > 文件名 # 写入文件
echo '内容' >> 文件名 # 追加文件

vim 文件名路径 # 编辑文件  i 编辑 esc 退出 :wq 保存并退出 :q! 不保存退出        
sudo nano 文件名路径 # 编辑文件  ctrl+o 保存 ctrl+x 退出

```



vim 编辑器 






```shell
# 命令行注释 以#开头表示为注释
# 命令行粘贴
ctrl + v 或者 鼠标右键 或者 鼠标中键(滚轮) 
# 显示当前路径
pwd 
# 显示当前文件夹目录
ls 
# 去D盘(windows专属)
D:
# cd .. 退回上一级
cd ..
# cd ~ 回到电脑根路径 mac专属
cd ~
# 切换到D盘
d:
# 切换到E盘
e:
# 清空屏幕
clear 
# 清屏指令 cls是clears的简称
cls 
# 按上箭头 显示上一条命令
上 
# 打断当前命令 取消当前命令
ctrl + c

# 列出当前目录下所有文件
dir
# 进入到某个目录某个文件夹
cd 文件夹名/路径 -- windows 路径加引号

#创建某个目录路径
md 目录名
# 删除某个目录路径
rd 目录名

`.`表示当前目录

`..`表示上一级目录

` ↑ `      键盘上键 调出历史指令记录

`某某 --version`    `某某 -V`   查看某某版本号

cmd窗口停掉服务器  两次ctrl+c

# 文件夹操作
mkdir 文件夹名  # 增
rm -rf 文件夹名  # 删
mv 旧文件夹名 新文件夹名  # 重命名
ls # 查看当前文件夹的文件列表
ll # 查文件列表 

# 文件操作
touch 文件名   # 增 新建一个文件
rm -rf 文件名  # 删 删除一个文件
vi 文件名 # 改内容 编辑文件 用vi编辑器
mv 旧文件名 新文件名  # 重命名
tail 文件名    # 查看文件 (windows不行)

# 编辑文件(windows不好使) 
vi编辑器
vi 文件路径
- 1 按 i # 进入编辑模式  上下左右移动光标 修改 
- 4 按 esc # 退出编辑模式
- 5 输入 :wq  # 保存并退出         注意:是英文的 经常不切换中英文导致不能退出
- 5 输入 :wq! # 强制保存并退出
- 6 输入 :q   # 不保存退出     
- 6 输入 :q!  # 强制不保存退出

 
右击cmd窗口上方区域的属性




echo 参数  // 打印出参数
pwd // 输出当前的目录
ls // 展示当前目录中有哪些文件或目录
cd 路径 // cd可以去其他目录
mkdir 新目录名 // 创建一个新目录
rmdir 目录名 // 删除一个目录
touch 文件名.txt // 创建一个文件
rm 文件名.txt // 删除一个文件
cp 文件名.txt 路径 // 复制一个文件到指定路径
mv 文件名.txt 路径 // 移动一个文件到指定路径


open ~/.bash_profile  # 用mac默认的文本编辑器打开指定文件
cd ..
cd ~/




```