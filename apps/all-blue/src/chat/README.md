# Chat 聊天室模块（WebSocket）

- nest g res chat 选择 WebSockets 生成脚手架
- 基于 socket.io（`@nestjs/platform-socket.io`），命名空间 `/chat`

## 功能

- 加入/离开房间（`join`，断线自动离开）
- 昵称唯一（重名顶号，旧连接收到 `kicked`）
- 聊天消息入库（MySQL `chat_message` 表）并广播到房间
- 历史消息分页（`history`，默认 50 条）
- 在线用户列表（`onlineUsers`）
- "正在输入"提示（`typing`）

## 事件协议

| 事件                      | 方向             | Payload                                   | 说明                        |
| ------------------------- | ---------------- | ----------------------------------------- | --------------------------- |
| `connected`               | 服务端 -> 客户端 | `{ socketId }`                            | 连接建立                    |
| `join`                    | 客户端 -> 服务端 | `{ username, room? }`                     | 加入房间                    |
| `history`                 | 服务端 -> 客户端 | `{ list, total, page, pageSize }`         | 历史消息（join 后自动下发） |
| `chatMessage`             | 双向             | `{ room, username, content, createTime }` | 发送/接收消息               |
| `userJoined` / `userLeft` | 服务端 -> 客户端 | `{ username, time }`                      | 上线下线通知                |
| `onlineUsers`             | 服务端 -> 客户端 | `{ users: [{ username, joinTime }] }`     | 在线用户                    |
| `typing`                  | 双向             | `{ username, typing }`                    | 正在输入                    |
| `kicked` / `error`        | 服务端 -> 客户端 | `{ message }`                             | 异常通知                    |
