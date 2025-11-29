FROM node:16.20.2-alpine

WORKDIR /app

# 复制 package 文件
COPY package.json yarn.lock ./

# 安装依赖
RUN yarn install

# 复制源代码
COPY . .

# 暴露端口
EXPOSE 8080

# 启动命令
CMD ["yarn", "dev"]
