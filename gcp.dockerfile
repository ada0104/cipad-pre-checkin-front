# 第一階段產生dist資料夾
FROM asia-east1-docker.pkg.dev/development2-389802/hexa-docker/cipad-pre-checkin-front:build as builder

# 指定預設/工作資料夾
WORKDIR /usr/app

COPY ./ ./

RUN npm run build

ENV NODE_ENV=production
ENV PORT=80

CMD ["node", "/usr/app/server/server.js"]
