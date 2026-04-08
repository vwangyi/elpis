## 
完整文章说明



好处：反向代理 负载均衡 



## nginx 服务器是什么
nginx 服务器是高性能的 http 和反向代理的 web 服务器。

内存占用少 并发能力强

## 正向代理是什么
正向代理 是  代理服务器存在客户端  就是 正向代理 比如 vpn

## 反向代理是什么
代理服务器存在于 服务端，把收到的请求 分发给不同的 后端服务器，  虽然访问的是一个域名 但后面有很多台服务器 比如 baidu.com 



## 负载均衡是什么
负载均衡是

轮询：依次处理请求

加权轮询：权重高的 会处理更多的请求



## 动静分离
前端的静态资源 html css js 直接从 nginx 服务器 返回用户 不会经过 node 服务器。





## nginx常用命令有
nginx常用命令有

```shell
cd /usr/local/nginx/sbin/

./nginx # 启动ng服务器 就可以访问
./nginx -s stop # 停止服务器 就不能访问了
./nginx -s quit # 安全停止服务器
./nginx -s reload # 重新加载配置文件  改了配置文件就需要使用
```

说（是什么 优缺点 讲应用）

```plain
# 先备份！
sudo cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup

# 恢复（如需要）
sudo cp /etc/nginx/nginx.conf.backup /etc/nginx/nginx.conf
```



## 多个项目如何用 nginx 配置管理
+ nginx.conf 

```shell

###################################### 全局配置 start  很好理解 因为没有被{} 包裹 #####################################
#user  nobody;
worker_processes  1;

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;
 

###################################### 全局配置 end 很好理解 因为没有被{} 包裹 #####################################


###################################### events模块事件相关配置  start  ############################################
events {
    # 每个worker进程能够同时处理的最大连接数是 1024 也就是 浏览器请求到nginx
    # 这里的连接有哪些 比如 
    # 1 浏览器的请求到nginx
    # 2 nginx的代理到后端服务器
    # 3 nginx 到 其他第三方服务器 的连接 
    worker_connections  1024; # 如果有2个worker 那就是 2*1024=2048个连接数
}

###################################### events模块事件相关配置  end  ############################################



http {
###################################### http的全局配置 start #####################################
    include       mime.types;
    default_type  application/octet-stream; 
    sendfile        on; 
    keepalive_timeout  65; 
  
###################################### http的全局配置 end #####################################

 
###################################### 负载均衡配置 start #####################################
    upstream codewy {
        server 127.0.0.1:8080 weight=1; # 权重为1
        server 127.0.0.1:8081 weight=1; # 权重为1
    }
###################################### 负载均衡配置 end #####################################

###################################### 80端口的配置 satrt #####################################
    server {
        listen       80; 
        server_name  localhost;  # server_name 可以配置 域名 codewy.top  www.codewy.top 等等
        location / {  # 80端口 访问/的配置
            root   html;
            index  index.html index.htm; # 单页面路由 需要配置返回index.html 
            proxy_pass http://codewy; # codewy是上面的负载均衡取名  这是代理配置
        } 
        location /admin {

        }
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        } 
    }
###################################### 80端口的配置 end #####################################

###################################### 443端口的配置 satrt #####################################

    server {
       listen       443 ssl;
       server_name  localhost;

       ssl_certificate      cert.pem;
       ssl_certificate_key  cert.key;

       ssl_session_cache    shared:SSL:1m;
       ssl_session_timeout  5m;

       ssl_ciphers  HIGH:!aNULL:!MD5;
       ssl_prefer_server_ciphers  on;

       location / {
           root   html;
           index  index.html index.htm;
       }
    }
###################################### 443端口的配置 end #####################################


    # another virtual host using mix of IP-, name-, and port-based configuration
    #
    #server {
    #    listen       8000;
    #    listen       somename:8080;
    #    server_name  somename  alias  another.alias;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}

 
    include servers/*;
}

```





80 转 443    http 转 https 


## 前端 Nginx 部署
```shell

● nginx 是一个服务器
● 优缺点
● 应用场景：部署前端项目（静态资源）


应用场景：一开始用户少 不需要 nginx  当用户越来越多就需要 nginx 的能力了
一个 nginx 可以接收非常大量的请求 进行 转发给其他服务器 

nginx 优点：反向代理 负载均衡 
反向代理：可以把请求代理给其他服务器处理
负载均衡：可以设置权重 比如某些服务器的内存大 性能好 就可以多处理一些请求。



客户端 >>> nginx ( 80端口 http   443端口https) >>> 后端服务器
www.baidu.com:80/

www.baidu.com:80/ http请求 转发到 https：443端口
nginx
● 是什么：
● 优缺点：反向代理 负载均衡 动静分离 、 内存占用少 并发能力强最高支持 5w个并发连接数 

● 正向代理：安装在 前端（客户端）的服务器 就是 正向代理，
  ○ 比如 vpn 翻墙，或前端开发环境的node 服务器
● 反向代理：安装在 后端（服务端）的服务器 就是 反向代理，比如 nginx 服务器 
  ○ 比如 访问百度 www.baidu.com 大家永远都是访问这一台服务器，本质就是做了 反向代理 
  ○ 随着用户量的增加 我可以增加很多服务器 但永远只有一个 www.baidu.com 
● 前端项目 开发环境是 的 node 代理服务器就属于正向代理 而上线 nginx 后 就是 反向代理 
● 动静分离，项目中 有些请求需要后端处理 但有些请求不需要后端处理 比如访问 html css js jpg 等等静态资源。图片 音视频 js vue.js jquery.js react.js  都是静态资源
● 静态资源 直接请求后端的 nginx 服务器
● 动态资源 请求后端写的接口  
nginx 常用命令
cd /usr/local/nginx/sbin 

./nginx -s reload # 最常用 每次修改前端静态资源 都使用此命令 重启nginx
./nginx # 启动nginx
./nginx -s stop # 停止nginx 停止后就不能访问了


nginx -t # 显示nginx.conf配置文件的位置 进去之后 可以 code nginx.conf 用vscode打开


# mac 通过 brew 启动 nginx 
brew services start nginx
# mac 通过 brew重启nginx 
brew services restart nginx
# mac 通过 brew 停止nginx 
brew services stop nginx
总结 1可视化界面 更新 2 CICD工具自动化 命令脚本执行  都是全量更新 增量更新
前端部署 可视化界面操作
mac系统

nginx -t # 得到 nginx.conf配置文件的路径
打开访达

按 Cmd+Shift+G  输入路径：/opt/homebrew/var/www/

将打包后的 dist 文件夹的所有内容 拖拽到 www 目录里面 替换原有文件

前端部署 编写 CICD 工具
# 1. 构建项目
npm run build

# 2. 检查构建结果
ls -la dist/

# 3. 备份并部署
sudo cp -r /opt/homebrew/var/www /opt/homebrew/var/www.backup # 把 旧的 备份
sudo rm -rf /opt/homebrew/var/www/*  # 删除 旧的 
sudo cp -r dist/* /opt/homebrew/var/www/ # 把dist下所有内容 copy 到 nginx 

# 4. 重启 Nginx
sudo brew services restart nginx

# 5. 验证部署
curl http://localhost:8080


#!/bin/bash
echo "开始构建前端项目..."
npm run build

echo "备份原有文件..."
sudo cp -r /opt/homebrew/var/www /opt/homebrew/var/www.backup_$(date +%Y%m%d_%H%M%S)

echo "部署新版本..."
sudo rsync -av --delete dist/ /opt/homebrew/var/www/

echo "重启 Nginx..."
sudo brew services restart nginx

echo "部署完成！"

前端部署 其他方式
git hooks （免费的cicd）
增量更新
nginx.conf 解读
https://www.cnblogs.com/bluestorm/p/4574688.html 
https://www.bilibili.com/video/BV1F5411J7vK 
全局配置 
event配置
http配置
http server配置

```

+ Nginx
    - 是什么
        * Nginx是一个高性能的HTTP和反向代理 web服务器 提供邮件服务 IMAP/POP3/SMTP服务
        * Nginx 同 Apache 一样都是一种 Web 服务器。基于 REST 架构风格，以统一资源描述符（Uniform Resources Identifier）URI 或者 统一资源定位符（Uniform Resources Locator）URL 作为沟通依据，通过 HTTP 协议 提供各种网络服务。Nginx是一款 轻量级 的 Web服务器、反向代理服务器，由于它的内存占用少，启动极快，高并发能力强，在互联网项目中广泛应用  
    - 好处
        * 内存占用少
            + 低内存 高并发
        * 并发能力强
        * 简单
        * C语言写的Nginx
        * Nginx不会为每个请求 创建新的流程 而是使用异步 事件驱动的方法 在单个线程中处理请求
    - nginx相关命令
    - 应用
        * web架构
        * HTTP缓存
        * 反向代理
        * 负载均衡策略
            + 负载均衡就是用多个服务器来 处理请求 一般每个省份至少一个服务器来处理本省的请求
            + 内置策略
                - 轮询
                    * 多个服务器 每个服务器依次处理请求
                - 加权沦陷
                    * 多个服务器都有权重值 谁权重高 谁先执行
            + 扩展策略
        * 静态资源
        * 动静分离
            + 静态资源文件 不需要后端开发处理 Nginx可以直接响应给浏览器 css html png js等等 静态资源文件
                - 静态资源 使用浏览器缓存用 Nginx 配置就行
            + 动态资源 就好像 后端写的接口 是需要后端开发处理数据 并响应给前端的
                - 使用缓存 后端 设置响应头 就行
        * web socket
    - 正向代理反向代理区别
        * 相同点
            + 正向代理和反向代理 都是在 客户端和服务器之间的一个代理服务器
        * 区别
            + 正向代理是 代理服务器在客户端
                - 正向代理 对外隐藏了 真实客户端
            + 反向代理是 代理服务器在服务端
                - 反向代理 对外隐藏了 真实服务器

