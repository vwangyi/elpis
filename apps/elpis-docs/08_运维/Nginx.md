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

