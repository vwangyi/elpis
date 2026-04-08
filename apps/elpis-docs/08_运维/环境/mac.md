# mac装环境


## iterm2
```sh
# https://www.iterm2.com/
# 1. 只把 ierm2 改为暗色模式： iterm2 settings appearance General Theme dark

# 2. 安装ohmyz >>> https://ohmyz.sh/ 
- 注意安装 myz 之后 可能会破坏 nvm node 等环境变量配置 所以先安装 myz 再安装 nvm node 等 或重新配置nvm的环境变量
- 官网提供的是国外源  
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
下面是国内源
sh -c "$(curl -fsSL https://gitee.com/mirrors/oh-my-zsh/raw/master/tools/install.sh)"




# 3. 安装 zsh-autosuggestions 插件  github地址可能会失败 多试几次
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions

# 用任意编辑器打开配置文件
open ~/.zshrc   # 或使用 vim/nano

# 把 plugins=(git) 改为 plugins=(git zsh-autosuggestions)

source ~/.zshrc # 重新加载配置 或 重启命令行

# 提示历史记录 按右键 -> 就会补全
```
 

## git
```sh
# iterm2中使用 git 触发提示安装git
git --version 
```


## brew 
- 使用中科大镜像安装 Homebrew 命令行输入下面命令
```sh
/bin/bash -c "$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/Homebrew.sh)"
或
/bin/zsh -c "$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/Homebrew.sh)"
```


## nvm
```sh
brew install nvm 
nvm # 下载 nvm 成功 却不能使用 nvm 命令 说明没有配置 nvm 的环境变量
```
- 配置环境变量 （全部复制粘贴执行）
```sh
echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.zshrc
echo '[ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"' >> ~/.zshrc
echo '[ -s "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm" ] && \. "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm"' >> ~/.zshrc
```
- 刷新配置
```sh
source ~/.zshrc # 或 重启命令行后 应该可以使用nvm了
``` 

## node
```sh
nvm install 18.19.1
```

## pnpm 
```sh
npm i pnpm -g
```

## vscode
- https://code.visualstudio.com/insiders

- 用code命令打开vscode
```sh
# vscode中快捷键 Cmd + Shift + P 搜索 'Shell Command: Install 'code' command in PATH'
code elpis # 用vscode 打开elpis文件夹
```

- 光标平滑移动
```sh
# 1. mac 电脑设置  键盘 > 键重复速率 > 设置为最快
# 2. mac 电脑设置  键盘 > 重复前延迟 > 设置为最短
# 3. 命令行执行
    # For VSCode 稳定版
    defaults write com.microsoft.VSCode ApplePressAndHoldEnabled -bool false
    # For VSCode Insiders 测试版
    defaults write com.microsoft.VSCodeInsiders ApplePressAndHoldEnabled -bool false
# 4. vscode 设置
    打开设置：按下 Cmd + , 搜索 editor.cursorSmoothCaretAnimation 设置为 on 
    vscode 设置 搜索 'editor.cursorBlinking' 设置为 smooth 
    # "editor.cursorSmoothCaretAnimation": "on" 
    # "editor.cursorBlinking": "smooth"
```

- vscode插件
```sh 
Chinese 汉化 vscode
GitHub Copilot 
ESLint
prettier
EditorConfig for VS Code
image preview
any-rule 
```

## TypeScript
```sh
npm i -g typescript # 拿到tsc命令 
tsc xxx.ts # 编译TS文件得到JS文件
```


## mysql
- https://downloads.mysql.com/archives/community/  选择8.0.19 安装 mysql 

- 配置 mysql 环境变量 
```shell
vim ~/.zshrc # 用 vim 编辑器 打开 ~/.zshrc 配置文件 

# 按下 i 进入编辑模式
# 按下 esc 退出编辑模式
# 退出编辑模式后 输入 :wq 按下回车 是保存 
# 关闭命令行 重新打开 重启命令行
      
PATH=$PATH:/usr/local/mysql/bin # 追加一行
# mac 会自动启动mysql 不用手动启动 
mysql --verion # 这是mysql命令
mysql -u root -p密码 # -p后面紧跟密码 不要有空格    登录mysql后就可以使用sql命令了 

show databases; # 查看所有数据库  这是 sql命令
```

## 截图软件
- https://pixpin.cn/

## 清理软件 cleaner


## nginx
- 安装nginx


## Mac系统本地部署


