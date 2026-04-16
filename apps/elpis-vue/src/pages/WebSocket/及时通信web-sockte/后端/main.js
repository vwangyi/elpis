// 是什么：
// 优缺点：
// 讲应用：主要是为了解决 HTTP 协议在实时通信领域的短板。”

// 应用场景就是 服务端需要主动给客户端发消息

// WebSocket 在建立连接后，服务器可以主动推送消息给客户端，
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);

// 创建 WebSocket 服务器，将其绑定到我们的 Express 服务器上
const wss = new WebSocket.Server({ server });

// 存储所有连接的客户端
const clients = new Set();

// 当有 WebSocket 连接建立时
wss.on('connection', function connection(ws) {
  console.log('新的客户端连接成功');
  // 将新连接添加到客户端集合
  clients.add(ws);

  // 向刚连接的客户端发送一条欢迎消息
  ws.send(
    JSON.stringify({
      type: 'system',
      message: '欢迎加入聊天室！'
    })
  );

  // 当收到来自客户端的消息时
  ws.on('message', function incoming(message) {
    console.log('收到消息: %s', message);

    try {
      // 解析前端发送的 JSON 数据
      const parsedMessage = JSON.parse(message);
      const broadcastMessage = JSON.stringify({
        type: 'chat',
        user: parsedMessage.user || 'Anonymous',
        message: parsedMessage.message,
        time: new Date().toLocaleTimeString()
      });

      // 广播消息给所有连接的客户端
      clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(broadcastMessage);
        }
      });
    } catch (error) {
      console.error('解析消息出错:', error);
    }
  });

  // 当连接关闭时
  ws.on('close', function () {
    console.log('客户端断开连接');
    // 从客户端集合中移除
    clients.delete(ws);
  });
});

// 启动服务器，监听 3000 端口
server.listen(3000, function () {
  console.log('服务器启动在 http://localhost:3000');
});
