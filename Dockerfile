# 第一階段：建置應用程式
FROM node:18.19.0 AS builder

WORKDIR /usr/app

# 複製 package.json 和 package-lock.json，安裝依賴
COPY package*.json ./
RUN npm install -f

# 複製應用程式原始碼並建置
COPY ./ ./
RUN npm run build

# 第二階段：部署靜態檔案
FROM nginx:1.23-alpine

# 複製自定義的 Nginx 配置文件到指定路徑
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 複製建置結果到 Nginx 靜態檔案目錄
COPY --from=builder /usr/app/dist /usr/share/nginx/html

# 暴露 Nginx 的預設埠
EXPOSE 80

# 啟動 Nginx
CMD ["nginx", "-g", "daemon off;"]
