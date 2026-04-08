



master(main)分支  和 生产环境一致
hotfix分支：当main分支 也就是生产环境出现问题 就用 主分支为基线 创建hotfix分支 合并到main分支和dev分支









 # git
- https://mp.weixin.qq.com/s/TLZnGJJ5b3xuC7vUe5eIhw

 

## git 和 svn 
```shell

# git命令 克隆仓库
git clone 地址

# git命令 克隆指定分支
git clone -b dev 地址

# svn令 克隆仓库
svn checkout 地址 
svn checkout svn://192.168.202.11/project/10_CODE/22_IPTV移动腾讯专区/01_客户端代码
svn checkout svn://192.168.202.11/project/10_CODE/22_IPTV移动腾讯专区/01_客户端代码
svn co 地址 # 简写 

# git 提交代码
git add .
git commit -m "你的提交日志信息"
git push origin main 

# svm 提交代码  
svn add new-file.html # 添加单个文件
svn add . # 添加所有
svn commit -m "你的提交日志信息"

# git 拉取代码
git pull origin main
svn update 

# git 查看状态
git status 
svn status # svn 查看状态
```

## 末尾


## git 
## git 回滚
```javascript

1 获取 commit 哈希值
使用 git log 查看所有提交的详细信息。
使用 git log --oneline 查看简化版本的提交历史，获取 commit ID 和提交信息。
使用 git log <file_name> 查看特定文件的提交历史。

2 使用 git reset（会修改历史记录）
// 硬回滚  这种方法会将 HEAD 移动到指定的 commit，并且清除工作区和暂存区的所有更改。所有本地未提交的修改都会丢失。
git reset --hard 8485ca24fa0bea941e78ef222059d09fa165e348

// 软回滚  这会将 HEAD 移动到 <commit_id>，但是保留工作区中的修改，并且暂存区（staging area）也不会被清除。这意味着你可以稍后选择提交这些修改。
git reset --soft <commit_id>

// 软硬混合回滚 这种方法会将 HEAD 移动到指定的 commit，并且重置暂存区的内容，但保留工作区的更改。也就是说，已暂存的更改会被撤销，但文件内容依然保留在工作区。
git reset --mixed <commit_id>


3 使用 git checkout（不修改历史记录）

4 使用 git revert（保留历史记录，适合多人协作）
```





```javascript
incoming 进来的 
```



git 命令

```shell
// 克隆仓库
git clone -b 分支名 远程地址  


# 新建分支
git checkout -b 新分支名 # 基于当前分支 创建新分支并切换到新分支 （常用）
git branch 新分支名 # 基于当前分支 创建新分支 
git checkout 分支名 # 切换到指定分支
 

git branch -a  # 查看分支 简写
git branch -all  # 查看分支
git log --graph --pretty=oneline --abbrev-commit --all  # 查看分支合并图
 
# 删除分支 
git branch -d 本地分支名 # 删除本地分支 （会检查当前分支是否合并过）
git branch -D 本地分支名 # 强制删除本地分支 （不做任何检查 强制删除 （少用））
 
git push origin -d 分支名  # 删除远程分支
  
git branch -dr origin/远程分支名 # 删除追踪分支 只是删除了本地分支和远程分支的关联


# 直接删除.git 隐藏文件夹 重新git init 重新建立版本库







git clone -b master http:xx 

git checkout -b dev origin/dev // 新建本地dev分支和远程dev分支保持一致 
```

master分支（固定存在） 永远和生产保持一致 

dev （固定存在）分支 永远和开发环境保持一致  拉取master   提交到 master 



main >>> dev >>> featrue-a : featrue-a 功能分支基于dev 合并到dev  使用完 删除该分支 

main >>> hotfix-a  : hotfix-a 分支    热修复分支 基于master分支 提交到master （处理生产的问题）



1 readme文件

2 .gitignore  -- 添加git忽略文件 /node_module package-lock.json

3 pageage.json  用npm init生成   添加 开发依赖和生产依赖  npm i 生成node_modules 

4 创建index.js 项目入口文件. 用 node index.js 启动服务 



