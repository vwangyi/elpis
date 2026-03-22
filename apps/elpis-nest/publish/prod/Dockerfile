

# 从 Docker Hub 镜像仓库 中 选择一个node镜像 node20版本
FROM node:20 

# 创建一个目录
RUN mkdir -p /app/elpis-core

# 进入这个目录
WORKDIR /app/elpis-core

# 把当前目录下所有文件 复制 到 指定目录
COPY . /app/elpis-core

# 设置环境变量
ENV TimeZone=Asia/Shanghai 

# 暴露一个端口   这里暴露的端口和 pageage.json中 npm run prod 的端口一致 
#  "prod": "_ENV='prod' PORT=8081 node ./index.js",
EXPOSE 8081

# 执行 npm run prod 
ENTRYPOINT npm run prod 

