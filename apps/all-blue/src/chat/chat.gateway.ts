import { Logger, ValidationPipe } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';

// 在线用户信息（内存态，断线即移除）
interface OnlineUser {
  socketId: string;
  username: string;
  room: string;
  joinTime: number;
}

@WebSocketGateway({
  namespace: '/chat',
  cors: { origin: '*' } // 开发环境允许跨域
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  // socketId -> 用户信息
  private readonly onlineUsers = new Map<string, OnlineUser>();

  constructor(private readonly chatService: ChatService) {}

  /* ---------- 生命周期 ---------- */

  handleConnection(client: Socket) {
    this.logger.log(`客户端连接: ${client.id}`);
    // 未加入房间前不广播，等客户端 emit('join') 携带昵称
    client.emit('connected', { socketId: client.id });
  }

  handleDisconnect(client: Socket) {
    const user = this.onlineUsers.get(client.id);
    this.onlineUsers.delete(client.id);
    if (user) {
      // 广播离开消息 + 最新在线列表
      this.server.to(user.room).emit('userLeft', {
        username: user.username,
        time: new Date().toISOString()
      });
      this.emitOnlineUsers(user.room);
      this.logger.log(`${user.username} 离开房间 ${user.room}`);
    }
    this.logger.log(`客户端断开: ${client.id}`);
  }

  /* ---------- 业务事件 ---------- */

  // 加入房间：记录用户、加入 socket room、下发历史消息、广播上线
  @SubscribeMessage('join')
  async handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { username: string; room?: string }
  ) {
    const username = String(body?.username || '')
      .trim()
      .slice(0, 50);
    const room =
      String(body?.room || 'public')
        .trim()
        .slice(0, 50) || 'public';

    if (!username) {
      client.emit('error', { message: '昵称不能为空' });
      return;
    }

    // 同名用户顶号：踢掉旧连接（保持一个昵称一个连接）
    for (const [socketId, user] of this.onlineUsers) {
      if (user.username === username) {
        this.server.to(socketId).emit('kicked', {
          message: '您的昵称在其他地方登录'
        });
        this.onlineUsers.delete(socketId);
      }
    }

    this.onlineUsers.set(client.id, {
      socketId: client.id,
      username,
      room,
      joinTime: Date.now()
    });
    await client.join(room);

    // 单独下发历史消息给新加入的用户
    const history = await this.chatService.findHistory(room, 1, 50);
    client.emit('history', history);

    // 房间内广播上线通知 + 在线列表
    this.server.to(room).emit('userJoined', {
      username,
      time: new Date().toISOString()
    });
    this.emitOnlineUsers(room);
    this.logger.log(`${username} 加入房间 ${room}`);
  }

  // 发送消息：校验 -> 入库 -> 广播到所在房间
  @SubscribeMessage('chatMessage')
  async handleChatMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody(new ValidationPipe({ whitelist: true })) body: CreateChatDto
  ) {
    const user = this.onlineUsers.get(client.id);
    if (!user) {
      client.emit('error', { message: '请先加入聊天室' });
      return;
    }
    const content = String(body?.content || '').trim();
    if (!content) {
      client.emit('error', { message: '消息内容不能为空' });
      return;
    }

    // 持久化并广播（广播使用入库后的完整数据，保证时间/ID 一致）
    const saved = await this.chatService.create({
      room: user.room,
      username: user.username,
      content: content.slice(0, 2000)
    });

    this.server.to(user.room).emit('chatMessage', saved);
  }

  // 正在输入提示：只转发给房间内其他人
  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { typing: boolean }
  ) {
    const user = this.onlineUsers.get(client.id);
    if (!user) return;
    client.to(user.room).emit('typing', {
      username: user.username,
      typing: !!body?.typing
    });
  }

  // 主动获取在线用户列表
  @SubscribeMessage('onlineUsers')
  handleGetOnlineUsers(@ConnectedSocket() client: Socket) {
    const user = this.onlineUsers.get(client.id);
    if (user) {
      client.emit('onlineUsers', { users: this.getOnlineUsers(user.room) });
    }
  }

  // 主动获取历史消息（翻页）
  @SubscribeMessage('history')
  async handleHistory(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { page?: number; pageSize?: number }
  ) {
    const user = this.onlineUsers.get(client.id);
    if (!user) return;
    const history = await this.chatService.findHistory(
      user.room,
      Math.max(1, Number(body?.page) || 1),
      Math.min(100, Number(body?.pageSize) || 50)
    );
    client.emit('history', history);
  }

  /* ---------- 私有工具 ---------- */

  // 统计某房间在线用户并广播
  private emitOnlineUsers(room: string) {
    this.server.to(room).emit('onlineUsers', {
      users: this.getOnlineUsers(room)
    });
  }

  private getOnlineUsers(room: string) {
    return [...this.onlineUsers.values()]
      .filter(user => user.room === room)
      .map(({ username, joinTime }) => ({ username, joinTime }));
  }
}
