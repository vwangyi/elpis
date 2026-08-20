import { io, type Socket } from 'socket.io-client';

/* ---------- 类型 ---------- */
export interface ChatMsg {
  id?: number;
  username: string;
  content: string;
  createTime?: string;
  type?: 'user' | 'system';
}

export interface OnlineUser {
  username: string;
  joinTime: number;
}

/* ---------- 配置 ---------- */
// 走 vite 代理：客户端只填命名空间，socket.io 握手请求 (/socket.io) 由
// vite.config.ts 的 server.proxy['/socket.io'] 转发到后端，避免直连 localhost:3000
export const CHAT_NAMESPACE = '/chat';
export const SOCKET_URL = CHAT_NAMESPACE;
export const DEFAULT_ROOM = 'public';

/* ---------- Socket 对象管理 ---------- */
let socket: Socket | null = null;

/** 创建并返回新的 socket 连接（已存在旧连接时先关闭） */
export function connectSocket(): Socket {
  disconnectSocket();
  socket = io(SOCKET_URL, {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 2000
  });
  return socket;
}

/** 获取当前 socket 实例（未连接时为 null） */
export function getSocket(): Socket | null {
  return socket;
}

/** 关闭连接并清空实例 */
export function disconnectSocket(): void {
  socket?.close();
  socket = null;
}

/** 判断当前是否持有 socket 实例 */
export function hasSocket(): boolean {
  return socket !== null;
}

/** 通过当前 socket 发送事件 */
export function emitEvent<T = unknown>(event: string, payload?: T): void {
  socket?.emit(event, payload);
}
