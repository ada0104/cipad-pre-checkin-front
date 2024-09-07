# cipad-pre-checkin-front 前端專案

標準Vue3架構

## 開發配置

```sh
npm install
npm run dev
```

## 一般開發Api Proxy

vite.config.ts 內指向api proxy

## 本機Api Proxy

```sh
npm front-api-proxy
```
將啟動前端Api Proxy, 會完成串接API所有設定, 前端呼叫路徑改請求 /api
vite.config.ts 內有/api轉請求設定, 必要時也可轉往各線上站別

## 運作核心

docker + node express
