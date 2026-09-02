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

## -----------------------------------------------------------------------------------------------------------

在 NestJS 项目中，**`chat.gateway.ts` 存在而 `chat.controller.ts` 不存在，是完全正常且合理的设计**。

这并非 NestJS 强制要求，而是根据**通信协议**和**业务场景**做出的架构选择。简单来说：**聊天用 WebSocket（网关），网页用 HTTP（控制器）。**

---

### 1. 核心区别：Controller 与 Gateway 的分工

| 特性         | **Controller（控制器）**                  | **Gateway（网关）**                              |
| :----------- | :---------------------------------------- | :----------------------------------------------- |
| **所属模块** | `@nestjs/common`                          | `@nestjs/websockets`                             |
| **通信协议** | **HTTP/HTTPS**（请求-响应模式）           | **WebSocket**（全双工、持久连接）                |
| **典型用途** | RESTful API、页面路由、文件上传           | 实时推送、双向通信、广播                         |
| **触发方式** | 客户端主动发起 `GET/POST/PUT/DELETE` 请求 | 客户端发送 `emit` 事件，或服务端主动 `emit` 推送 |

---

### 2. 为什么聊天模块通常只需要 Gateway？

聊天应用的核心场景是 **“实时收发消息”**：

1. **双向通信**：用户 A 发消息给用户 B，服务端需要**立即推送**给 B，而不是等 B 下次刷新页面去拉取。HTTP 做不到服务端主动推，而 WebSocket 天生支持。
2. **长连接保活**：WebSocket 建立连接后一直保持，适合高频互动的场景（如在线聊天、弹幕）。
3. **房间/广播机制**：NestJS 的 `@WebSocketGateway` 配合 `@SubscribeMessage`，可以轻松实现 `server.to(room).emit()` 广播消息，比用 HTTP 轮询优雅得多。

**因此，如果聊天模块只做实时通信，完全不需要 Controller，所有逻辑写在 Gateway 里就够了。**

---

### 3. 什么时候会同时需要 Controller 和 Gateway？

虽然聊天核心用 WebSocket，但在实际项目中，**聊天模块往往也会搭配 Controller**，用于处理非实时的业务需求，例如：

1. **获取历史消息**：用户打开聊天窗口，需要加载最近 20 条消息。这个用 HTTP 的 `GET /chat/messages` 更合适（因为是一次性的数据拉取，没必要走 WebSocket）。
2. **上传图片/文件**：发送图片消息，通常先用 HTTP 上传文件，拿到 URL 后再通过 WebSocket 发送消息体。文件上传用 HTTP 更成熟（支持分片、进度条）。
3. **设置已读状态**：用户阅读消息后，发送一个 `PATCH /chat/messages/1/read` 标记已读，用 RESTful 语义更清晰。

**此时，你会同时拥有 `chat.controller.ts`（处理历史记录、文件上传）和 `chat.gateway.ts`（处理实时推送）。**

---

### 4. 你的项目只有 Gateway 的可能原因

1. **功能简单**：目前只实现了“实时收发”，历史消息功能还没做，或者历史消息通过其他方式（如数据库直接查）处理了。
2. **前后端约定**：前端通过 WebSocket 发送 `getHistory` 事件来拉取历史，所以不需要 RESTful API。
3. **微服务边界划分**：实时通信归 `ChatModule`，而历史消息、文件上传归 `MessageModule` 或 `FileModule` 管理，职责分离。

---

### 5. 总结一句话

- **如果聊天只要“实时通信”**：`chat.gateway.ts` 就够了，不用 `controller`。
- **如果聊天需要“历史记录 + 实时通信”**：两者都要，`controller` 负责非实时接口，`gateway` 负责实时推送。

你的项目当前只有 `gateway`，说明它目前专注于解决“实时互发消息”这个核心需求，这是正确的起步方式。等需要加历史消息、文件上传等功能时，再补上 `controller` 也不迟。
