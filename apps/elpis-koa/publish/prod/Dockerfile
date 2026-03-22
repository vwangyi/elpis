# 配置node环境
FROM node:18

# 设置工作目录
RUN mkdir -p /app/elpis

# 进入工作目录
WORKDIR /app/elpis

# 复制当前目录下的所有文件到工作目录
COPY . /app/elpis/

# 设置环境变量
ENV Timezone=Asia/Shanghai

# 暴露端口
EXPOSE 8081 

# npm run beta就是 package.json 中设置的脚本"beta": "_ENV='beta' port=8081 node ./index.js" 
# 脚本中设置端口是8081是因为 dockerfile中暴露的端口是8081
ENTRYPOINT npm run beta 
