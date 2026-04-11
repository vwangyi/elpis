



## 修改 Hosts 文件
### 一、Hosts 文件的作用与原理

**Hosts 文件**是一个本地的、无后缀名的系统文件，用于将**主机名（域名）映射到 IP 地址**。它的优先级**高于 DNS 服务器**。

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

### 二、macOS 修改 Hosts 文件的详细步骤

#### 1. 打开终端（Terminal）
- 通过 Spotlight（`Cmd + 空格`）搜索 “Terminal” 并打开。
- 或进入“启动台” → “其他” → “终端”。

#### 2. 查询 GitHub 当前可用的 IP 地址（可选，但推荐）
由于 GitHub 的 IP 可能变化，建议先获取最新可用 IP：
- 访问 [ipaddress.com](https://www.ipaddress.com/) 或 [whatismyipaddress.com](https://whatismyipaddress.com/)。
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

> 你也可以暂时跳过查询，先尝试社区常用的 IP（如上），如果无效再重新查询。

#### 3. 编辑 Hosts 文件
在终端中输入以下命令（使用 `nano` 编辑器，对新手友好）：
```bash
sudo nano /etc/hosts
```
- 输入你的 macOS 登录密码（输入时不显示，直接回车即可）。
- 用方向键将光标移到文件末尾。

添加以下内容（将示例 IP 替换为你查询到的）：
```bash
# GitHub Hosts Start
140.82.112.3    github.com
185.199.108.153 assets-cdn.github.com
199.232.69.194  github.global.ssl.fastly.net
# GitHub Hosts End
```

#### 4. 保存并退出
- `nano`：按 `Control + O` 保存，回车确认；再按 `Control + X` 退出。
- 如果用 `vim`：按 `Esc`，输入 `:wq`，回车。

#### 5. 刷新 DNS 缓存（使修改立即生效）
macOS 会缓存 DNS 解析结果，需要清除缓存：

**对于 macOS 10.10.4 及以上版本**（绝大多数用户）：
```bash
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder
```
**对于更老版本**（如 OS X 10.9 及以下）：
```bash
sudo killall -HUP mDNSResponder
```

#### 6. 验证是否生效
- 打开浏览器访问 `https://github.com`。
- 或在终端执行 `ping github.com`，看是否返回你设置的 IP。

---

### 三、注意事项

1. **IP 地址会失效**：GitHub 的 IP 可能动态变化，如果之后访问又变慢，需要重新查询并更新 Hosts。
2. **不要删除原有内容**：只需在末尾追加，不影响系统默认配置。
3. **备份原始文件**：修改前建议备份：
   ```bash
   sudo cp /etc/hosts /etc/hosts.backup
   ```
4. **安全性**：不要随意添加不信任的 IP，避免被钓鱼。
5. **代理冲突**：如果使用 VPN 或代理软件（如 Clash、Surge），可能绕过 Hosts 设置。此时可关闭代理或调整规则。

---

### 四、Windows / Linux 简要步骤（供参考）

**Windows**：
1. 以管理员身份打开记事本，打开 `C:\Windows\System32\drivers\etc\hosts`。
2. 添加映射行。
3. 打开命令提示符（管理员）执行 `ipconfig /flushdns`。

**Linux**：
1. 终端执行 `sudo nano /etc/hosts`。
2. 添加映射行。
3. 重启网络服务或执行 `sudo systemctl restart NetworkManager`（视发行版而定）。

---

### 五、自动化管理工具（推荐）

手动更新 IP 较麻烦，可使用 **SwitchHosts** 自动从远程获取最新 GitHub Hosts：
- 下载 [SwitchHosts](https://github.com/oldj/SwitchHosts/releases)。
- 添加“远程”规则，URL 填 `https://raw.hellogithub.com/hosts`。
- 开启自动更新即可。

这样无需手动维护，长期稳定。

---

通过上述步骤，你应该能顺利修改 Hosts 文件并解决 GitHub 访问问题。如果仍然无法访问，可能是网络环境或 IP 已变，可尝试更换其他方案（如代理或镜像站）。
