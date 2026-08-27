# 如何搭建npm 私服 


## 官网：https://www.verdaccio.org/zh-CN/docs/what-is-verdaccio

## 配置文件
- 配置文件 可以设置权限什么的
- /Users/vwangyi/.config/verdaccio/config.yaml

## nrm 切换源
- nrm可以切换 npm官方源 自己私服源 和 淘宝源 等等
- 或
- npm config set registry https://registry.npmjs.org/
- npm config get registry

## 启动服务器
```sh
npm install verdaccio -g # 下载
verdaccio --listen 9999 # 启动私有npm包服务器
```




```shell
# https://verdaccio.org/zh-CN/

# Verdaccio 是可以帮我们快速构建npm私服的一个工具





#创建账号
npm adduser --registry http://localhost:4873/
#账号 密码 邮箱

# 发布npm
npm publish --registry http://localhost:4873/


#指定开启端口 默认 4873
verdaccio --listen 9999

# 指定安装源
npm install --registry http://localhost:4873

# 从本地仓库删除包
npm unpublish <package-name> --registry http://localhost:4873

```


# 搭建npm私有服务器

在企业应用开发中，很多时候我们要发布的包是私有的，npm上面倒是支持发布私有包，但是需要付费账号，因此更好的选择就是搭建私有服务器。

- 能够保证代码的私密性
- 因为是在局域网内部，因此下载速度更快
- 可以将发布的包做一些权限上设置，利于维护



## Verdaccio

Verdaccio 是企业开发中非常流行的用来搭建 npm 私有仓库的一个工具，通过该工具可以让我们快速的搭建一个 npm 私服。

下面是关于 Verdaccio 的一些主要特点：

- 轻量级：*Verdaccio* 采用 *Node.js* 编写，安装和运行起来非常快速。它不依赖于任何外部数据库，而是将数据存储在本地文件系统中。
- 简单的配置：*Verdaccio* 的配置非常简单，只需一个 *YAML* 文件即可。您可以轻松地指定用户权限、上游代理、缓存设置等。
- 缓存和代理：*Verdaccio* 可以作为上游 *npm* 注册表的代理，从而帮助减轻网络延迟和提高包的安装速度。同时，它还会缓存已经下载的包，以便在没有互联网连接的情况下也能正常工作。
- 访问控制：*Verdaccio* 支持基于用户和包的访问控制，您可以轻松地管理谁可以访问、发布和安装私有 *npm* 包。
- 插件支持：*Verdaccio* 支持插件，您可以扩展其功能，如添加身份验证提供程序、审计日志等。

首先第一步需要安装：

```js
npm i -g verdaccio
```

查看 verdaccio 的基本信息：

```bash
verdaccio -h
```

要启动服务器只需要输入

```bash
verdaccio
```



### Verdaccio 相关的配置

Verdaccio 基本上做到了开箱即用，但是很多时候我们需要根据项目的需求做一些配置，你可以在官网查看到 Verdaccio 所有的配置：https://verdaccio.org/docs/next/configuration



首先要说一下，Verdaccio 配置文件采用的是 YAML 格式，这是配置文件的一种常用格式，基本的语法结构由键值对组成，使用缩进来表示层级关系，键值对使用冒号分隔，键和值之间使用一个空格分隔

```yaml
person:
  name: John
  age: 30
  address:
    street: Main St.
    city: New York
```



Verdaccio 相关的一些配置：

- storage：存储包的路径
- web：网站相关的配置，录入 titile 一类的
- uplinks：上游代理，我现在搭建了私服，但是我通过私服下载某些包的时候，私服可能没有。这个时候就会从上游代理中去下载这些包，然后缓存到私服里面

```yaml
uplinks:
  npmjs:
    url: https://registry.npmjs.org/
```

- packages：这个配置项就是对权限的控制，例如：

```bash
packages:
  '@your-scope/*':
    access: $authenticated
    publish: $authenticated
    proxy: npmjs
  '**':
    access: $all
    publish: $authenticated
    proxy: npmjs
```

@your-scope/ 这个作用域包，只允许认证过的用户访问和发布，对于其他的包，所有用户都能够访问，但是只有认证过的用户才能发布，从而能够对权限做一个很好的控制。



- auth：设置用户身份的验证方法，默认采用的是 htpasswd 的方式



## 镜像管理工具nrm

nrm 是一个专门用于管理 npm 镜像的工具，英语全称就是 npm registry manager

首先我们需要安装 nrm：

```bash
npm i -g nrm
```

安装的时候可能会遇到如下的错误：

```js
const open = require('open');
^

Error [ERR_REQUIRE_ESM]: require() of ES Module /Users/jie/.nvm/versions/node/v16.17.1/lib/node_modules/nrm/node_modules/open/index.js from /Users/jie/.nvm/versions/node/v16.17.1/lib/node_modules/nrm/cli.js not supported.
```

这是因为 nrm 依赖于一个名为 open 的包，因此你在安装 nrm 的时候，同时也安装 open 即可：

```bash
npm install -g nrm open@8.4.2
```



nrm 常见的指令如下：

- nrm ls：列出你所有的可用的镜像列表
- nrm use \<registry>：切换镜像
- nrm add \<registry> \<url>：添加镜像
- nrm del \<registry>：删除镜像












=============================
是的，你的理解完全正确。在公司搭建私有NPM服务，核心思路就是把你在自己电脑上学习的流程，部署到公司的中央服务器上。

这样做能让所有同事共用一个稳定的私有源，安全地管理和共享公司内部的NPM包。以下是具体的部署步骤和注意事项：

### 🛠️ 如何在公司服务器上搭建Verdaccio

1.  **准备服务器并安装环境**
    通常公司会提供一台Linux虚拟机或云服务器。你需要拥有SSH登录权限，并在其上安装好 **Node.js**（官方建议使用最新的LTS版本）和 **npm**。

2.  **全局安装Verdaccio**
    登录服务器，通过npm将Verdaccio安装为全局命令：
    ```bash
    npm install -g verdaccio
    ```

3.  **初始化并配置**
    *   首次运行 `verdaccio` 命令，程序会在当前用户目录下自动生成一个基础配置文件`config.yaml`，通常是`~/.config/verdaccio/config.yaml`。
    *   你需要对这个YAML配置文件进行编辑，以符合企业需求，核心关注以下几个部分：
        *   **监听地址**：修改 `listen` 参数（如 `listen: 0.0.0.0:4873`），让服务不再只允许本机访问，而是能接收来自公司内网其他机器的请求。
        *   **用户认证**：配置 `auth` 部分，开启 `htpasswd` 认证。这会要求用户登录，可以有效防止未经授权的上传和删除，这也是生产环境的重要一步。
        *   **包管理权限**：在 `packages` 区域进行精细的权限划分。例如，配置 `'@company/*'` 开头的包仅允许认证用户访问和发布，以此作为团队私有包的命名规范。
        *   **上游源（Uplinks）**：配置 `uplinks` 指向淘宝镜像（`https://registry.npmmirror.com`）等国内源，可以大幅提升公共依赖包的下载速度。

4.  **以服务形式后台运行**
    在生产环境直接跑`verdaccio`命令不安全（终端关闭服务即终止），必须将其守护进程化。推荐以下两种方式：
    *   **推荐：使用 `pm2`**
        这是最便捷、流行的Node.js进程管理工具。安装`pm2`后，只需一条命令即可让Verdaccio在后台运行并自动重启。
        ```bash
        npm install -g pm2
        pm2 start verdaccio
        pm2 save
        pm2 startup
        ```
    *   **企业级：配置为 `systemd` 服务**
        如果你的服务器使用的是Linux系统，可以注册为`systemd`服务。这种方式更稳定、原生，由系统直接管理，能实现开机自启和异常退出后自动重启，是大多数公司服务器的首选。

### 🔧 生产环境的关键配置：反向代理与HTTPS

当公司服务器需要对外提供服务时（例如，让外网同事或远程开发环境也能访问），只开放一个端口可能显得不够专业。最佳实践是在Verdaccio前面再架设一层**反向代理**（如Nginx或Apache）。

*   **为什么要加反向代理？**
    1.  **统一入口**：您可以将多个服务（如Verdaccio、公司内部NPM文档站点等）统一通过80（HTTP）和443（HTTPS）端口向外暴露，而不是让用户记一个奇怪的4873端口号。
    2.  **实现HTTPS**：在代理层（如Nginx）配置SSL证书，是启用HTTPS最简单且最推荐的方法。这能确保公司核心业务代码在公网传输时的安全。
    3.  **负载均衡**：如果未来团队规模扩大，Verdaccio成为瓶颈，反向代理可以方便地将流量分发到多个Verdaccio实例上。

*   **Nginx反向代理配置关键点**：
    通常在Nginx配置文件中，你需要将特定域名的所有请求代理转发到Verdaccio的服务地址（例如 `proxy_pass http://127.0.0.1:4873;`）。

### 💡 别忘了客户端配置

服务器搭建好后，团队成员需要在各自的本地电脑上配置NPM客户端，才能使用这个私服。

*   **设置Registry**：最简单的方式是使用npm命令将源指向公司服务器：`npm set registry http://你的服务器IP或域名:4873/`。
*   **使用nrm管理源**：更推荐使用`nrm`（NPM Registry Manager）这个工具。你可以用`nrm add company http://你的服务器IP:4873/`添加私有源地址，用`nrm use company`一键切换，方便在公司私服和公共源之间来回切换。

从你个人电脑上的小实验，到公司级的中央服务，部署逻辑是完全一致的。把这些步骤梳理清楚，很快就能为团队搭建起一个稳定可靠的私有NPM仓库了。