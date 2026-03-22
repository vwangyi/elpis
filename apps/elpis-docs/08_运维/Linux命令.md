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





