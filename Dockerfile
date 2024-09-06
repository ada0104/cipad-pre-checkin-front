# 第一階段產生dist資料夾
FROM node:18.19.0-alpine as builder

# 指定預設/工作資料夾
WORKDIR /usr/app

COPY ./ ./

# 安裝dependencies
RUN npm install

# COPY src src

# 指定建立build output資料夾，--prod為Production Mode
RUN npm run build


# pull nginx image
FROM node:18.19.0-alpine

# 從第一階段的檔案copy
COPY --from=builder /usr/app/node_modules /usr/app/node_modules