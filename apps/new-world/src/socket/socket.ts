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
// 后端 WebSocket 地址（all-blue 服务，命名空间 /chat）
const SOCKET_BASE_URL =
  import.meta.env.VITE_SOCKET_BASE_URL || window?.location?.origin || '';
export const CHAT_NAMESPACE = '/chat';
export const SOCKET_URL = `${SOCKET_BASE_URL}${CHAT_NAMESPACE}`; // 'http://localhost:3000/chat'
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
