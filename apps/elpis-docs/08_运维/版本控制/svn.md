# svn
 

## svn 常用命令
```shell

# 克隆项目 类似 git clone 
svn checkout 地址 
svn checkout svn://192.168.202.11/project/10_CODE/22_IPTV移动腾讯专区/01_客户端代码/web_new/web省内大屏epg/广东移动新Launcher/语音AI专区正式版/迭代版本/Branchs/Branch1.5.0

# 查看状态 类似 git status
svn status 

# 拉取远程最新代码 更新到最新版本（类似git pull）
svn update

# 提交代码 类似 git 的 add + commit + push 
svn add new-file.js 
svm commit -m "xx"

# 放弃当前目录及子目录的所有修改  放弃所有未提交的修改（最常用）
svn revert -R .


# 查看文件状态
svn status

# 状态标识说明：
# ?   未版本控制的新文件
# A   已添加到版本控制
# M   已修改的文件  
# D   已标记删除的文件
# C   冲突的文件
# !   缺失的文件

# 更新整个工作副本
svn update

# 更新特定目录
svn update src/

# 更新到特定版本
svn update -r 1234

# 添加新文件
svn add newfile.java

# 撤销单个文件的修改
svn revert UserService.java

# 提交所有修改
svn commit -m "修复用户登录bug"




### 遇到svn 不能删除文件  强制删除就可以推送成功
# 1. 删除本地文件（如果还存在）
rm 文件名

# 2. 从 SVN 中删除记录
svn delete 文件名

# 3. 如果提示文件不存在，使用 --force 强制删除
svn delete --force 文件名

# 4. 提交更改
svn commit -m "删除文件：文件名"
```
