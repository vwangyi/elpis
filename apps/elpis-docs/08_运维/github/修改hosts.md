



## 修改 Hosts 文件
### 一、Hosts 文件的作用与原理

Hosts 文件是一个本地的系统文件，用于将主机名（域名）映射到 IP 地址。它的优先级高于DNS服务器。

**工作流程**：  
当你在浏览器输入 `github.com` 时，系统会：
1. 先检查 **Hosts 文件**中是否有 `github.com` 的记录。
2. 如果有，直接使用该记录指定的 IP 地址访问。
3. 如果没有，才会向配置的 **DNS 服务器**（如 `8.8.8.8`）发起查询。

**修改 Hosts 的意义**：  
- 绕过 DNS 污染或解析错误，强制指定正确的 IP。
- 加速访问（直连 CDN 或更优线路）。
- 屏蔽网站（将域名指向 `127.0.0.1`）。

--- 
#### 2.获取最新的github的ip 
‌DigWebInterface‌ (https://digwebinterface.com/)
‌DNS Stuff‌ (https://dnsstuff.com/)
‌IPVoid‌ (https://ipv.io/)
[ipaddress.com](https://www.ipaddress.com/)
[whatismyipaddress.com](https://whatismyipaddress.com/)
可百度 获取 github.com 最新的ip地址

- 查询以下域名并记录 IPv4 地址：
  - `github.com`
  - `assets-cdn.github.com`（可选）
  - `github.global.ssl.fastly.net`（可选）

例如（**示例 IP，请勿直接使用**）：
```
140.82.112.3    github.com
185.199.108.153 assets-cdn.github.com
199.232.69.194  github.global.ssl.fastly.net
```  

#### 3. 编辑 Hosts 文件
在终端中输入以下命令（使用 `vim` 编辑器，对新手友好）：
```bash 
sudo vim /etc/hosts
```
- 输入你的 macOS 登录密码（输入时不显示，直接回车即可）。
- 用方向键将光标移到文件末尾。

追加以下内容（将示例 IP 替换为你查询到的）：
```bash
# GitHub Hosts Start
140.82.112.3    github.com 
# GitHub Hosts End
```

#### 4. 保存并退出 
- 如果用 `vim`：1.按 `i`进入编辑  2.按 `Esc`，输入 `:wq`，回车。

#### 5. 刷新DNS缓存
```bash
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder
``` 
#### 6. 验证是否生效
- 打开浏览器访问 `https://github.com`。
- 或在终端执行 `ping github.com`，看是否返回你设置的 IP。
### 五、自动化管理工具（推荐）

手动更新 IP 较麻烦，可使用 **SwitchHosts** 自动从远程获取最新 GitHub Hosts：
- 下载 [SwitchHosts](https://github.com/oldj/SwitchHosts/releases)。
- 添加“远程”规则，URL 填 `https://raw.hellogithub.com/hosts`。
- 开启自动更新即可。

这样无需手动维护，长期稳定。
 