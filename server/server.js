const express = require('express')
const history = require('connect-history-api-fallback')
const compression = require('compression')
const {join} = require('node:path')
const path = require('path')
const fetch = require('node-fetch');
const { createProxyMiddleware } = require('http-proxy-middleware');
const WebSocket = require('ws');
const port = process.env.PORT || 3000;
const wsPort = process.env.WS_PORT || 8081;

const app = express()
const wss = new WebSocket.Server({ port: wsPort });

// 當有新的客戶端連接到 WebSocket 伺服器時
wss.on('connection', (ws) => {
  console.log('Client connected');
  // 每隔30秒發送 ping，檢查連線
  const interval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({
            data: '',
            branch: 'ping',
            repo: ''
        }));
      }
  }, 20000);

  // 可以添加接收訊息的監聽
  ws.on('message', (message) => {
      console.log(`Received message from client: ${message}`);
  });
  ws.on('pong', () => {
      console.log('Received pong from client');
  });
  ws.on('close', () => {
      clearInterval(interval); // 清除定時器
      console.log('Client disconnected');
  });
});


const distFolder = join(process.cwd(), 'dist')

// API呼叫設定
const API_TOKEN = process.env['API_TOKEN'] || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImU1YjdhYmMwMTVlNGFiNzhlNjM2ODgwZDViNGY0ZGZlZDhmNzNjNTNjODEzZTNjZGY3NTMwZjllY2ZjNzA2NDEiLCJwYXNzd29yZCI6IjNkOTFiNTg1MDRhNmN'
const API_URL = process.env['API_URL'] || 'https://uat-dns-only.funcoin.tw'
const proxyApiList = [
  'pre_checkin/get_member_data',
  'pre_checkin/upload_image',
  'pre_checkin/add_member_data',
  'pre_checkin/get_checkin_qr',
  'pre_checkin/send_pci_mail',
  'pms/get_order_data'
]
// 使用 middleware 處理 JSON 格式的請求內容
app.use(express.json());
app.use(compression())

// API
app.get('/ready', (req, res) => {
  res.send('ping')
})
app.post('/webhook', (req, res) => {
  const event = req.headers['x-github-event'];

  // 確認是 push
  if (event === 'push' ) {
    // 將推送事件轉到客端Ws
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                data: req.body,
                branch: req.body.ref,
                repo: req.body.repository.full_name
            }));
        }
    });
    console.log("Push to dev branch detected, triggering update scripts on all machines.", (req.body));
    res.status(200).send('Update scripts triggered on all machines');
  } else if( event === 'ping' ){
    res.status(200).send('pong');
  } else {
      res.status(400).send('Event not handled');
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



app.use(history())

app.use(express.static(distFolder))
app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})