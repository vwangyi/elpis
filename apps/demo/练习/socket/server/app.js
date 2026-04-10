const express = require('express');
const app = express();

// ws
const expressWs = require('express-ws');
// app装饰器
expressWs(app);

const wsList = [];

app.ws('/jiedan', (ws, req) => {
  wsList.push(ws);

  ws.on('message', msg => {
    for (const ws of wsList) {
      ws.send(`xx用户点了${msg}`);
    }
  });
});

app.get('/diancai', (req, res) => {
  for (const ws of wsList) {
    ws.send(`xx用户点了${req.query.type}`);
  }
});

app.listen(9999, () => {
  console.log('启动成功 端口为9999');
});
