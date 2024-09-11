const express = require('express')
const history = require('connect-history-api-fallback')
const compression = require('compression')
const {join} = require('node:path')
const path = require('path')
const fetch = require('node-fetch');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express()
const port = process.env.PORT || 3000;
const distFolder = join(process.cwd(), 'dist')

// API呼叫設定
const API_TOKEN = process.env['API_TOKEN'] || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImU1YjdhYmMwMTVlNGFiNzhlNjM2ODgwZDViNGY0ZGZlZDhmNzNjNTNjODEzZTNjZGY3NTMwZjllY2ZjNzA2NDEiLCJwYXNzd29yZCI6IjNkOTFiNTg1MDRhNmN'
const API_URL = process.env['API_URL'] || 'https://uat-dns-only.funcoin.tw'
const proxyApiList = [
  'pre_checkin/get_member_data',
  'pre_checkin/upload_image',
  'pre_checkin/add_member_data',
  'pre_checkin/get_checkin_qr'
]

app.use(compression())

// API
app.get('/ready', (req, res) => {
  res.send('ping')
})

app.get('/dunqian/pre_checkin/:token', async (req, res) => {
  try {
    console.log(`${API_URL}/dunqian/pre_checkin/${req.params.token}`);
    const response = await fetch(`${API_URL}/dunqian/pre_checkin/${req.params.token}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_TOKEN}`,
      }
    });

    if (!response.ok) {
      // 如果遠端 API 回傳錯誤，則將錯誤傳回給客戶端
      return res.status(response.status).json({ error: 'Failed to fetch data' });
    }

    const resData = await response.json(); // 解析為 JSON 格式
    res.json(resData); // 將資料傳回給客戶端
  } catch (error) {
    // 錯誤處理
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

proxyApiList.forEach(path=> {
  app.use(`/dunqian/${path}`, createProxyMiddleware({
    target: `${API_URL}`, // 你的遠端 API 的 URL
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
      // 設定 Authorization header
      proxyReq.setHeader('Authorization', `Bearer ${API_TOKEN}`);
    },
    onError: (err, req, res) => {
      res.status(500).json({ error: 'Proxy error', details: err.message });
    }
  }));
})


app.use(history())

app.use(express.static(distFolder))
app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})