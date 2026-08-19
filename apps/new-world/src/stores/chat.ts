import { ref } from 'vue';
import { defineStore } from 'pinia';
import { message } from 'ant-design-vue';
import type { Socket } from 'socket.io-client';
import {
  DEFAULT_ROOM,
  connectSocket,
  disconnectSocket,
  getSocket,
  emitEvent,
  type ChatMsg,
  type OnlineUser
} from '@/socket/socket';

/* chat 模块 */
export const useChatStore = defineStore('chat', () => {
  /* ---------- 状态 ---------- */
  const nickname = ref(''); // 昵称输入框
  const joined = ref(false); // 是否已进入聊天室
  const connecting = ref(false);
  const inputMsg = ref(''); // 消息输入框
  const msgList = ref<ChatMsg[]>([]);
  const onlineUsers = ref<OnlineUser[]>([]);
  const typingUsers = ref(new Set<string>());

  let typingTimer: ReturnType<typeof setTimeout> | null = null;
  let lastTypingSent = false;

  /* ---------- Socket 事件绑定 ---------- */
  function bindSocketEvents(socket: Socket) {
    socket.on('connect', () => {
      // 断线重连后自动重新加入房间
      if (joined.value && nickname.value) {
        socket.emit('join', {
          username: nickname.value,
          room: DEFAULT_ROOM
        });
      }
    });

    // 历史消息（join 后服务端自动下发）
    socket.on('history', (data: { list: ChatMsg[] }) => {
      msgList.value = (data.list || []).map(m => ({ ...m, type: 'user' }));
    });

    // 收到聊天消息
    socket.on('chatMessage', (msg: ChatMsg) => {
      msgList.value.push({ ...msg, type: 'user' });
      typingUsers.value.delete(msg.username);
    });

    // 上线/下线通知
    socket.on('userJoined', (data: { username: string }) => {
      msgList.value.push({
        username: 'system',
        content: `${data.username} 加入了聊天室`,
        type: 'system'
      });
    });
    socket.on('userLeft', (data: { username: string }) => {
      msgList.value.push({
        username: 'system',
        content: `${data.username} 离开了聊天室`,
        type: 'system'
      });
      typingUsers.value.delete(data.username);
    });

    // 在线用户
    socket.on('onlineUsers', (data: { users: OnlineUser[] }) => {
      onlineUsers.value = data.users || [];
    });

    // 正在输入
    socket.on('typing', (data: { username: string; typing: boolean }) => {
      if (data.typing) typingUsers.value.add(data.username);
      else typingUsers.value.delete(data.username);
    });

    // 被顶号
    socket.on('kicked', (data: { message: string }) => {
      message.warning(data.message || '您已在其他地方登录');
      leaveRoom(true);
    });

    // 错误
    socket.on('error', (data: { message: string }) => {
      message.error(data.message || '发生错误');
    });

    socket.on('disconnect', () => {
      if (joined.value) {
        message.warning('与服务器的连接已断开，正在尝试重连...');
      }
    });
  }

  /* ---------- 加入聊天室 ---------- */
  function joinRoom() {
    const name = nickname.value.trim();
    if (!name) {
      message.warning('请输入昵称');
      return;
    }
    connecting.value = true;
    const socket = connectSocket();
    bindSocketEvents(socket);

    socket.on('connect', () => {
      socket.emit('join', { username: name, room: DEFAULT_ROOM });
      joined.value = true;
      connecting.value = false;
      message.success(`欢迎加入聊天室，${name}`);
    });

    socket.on('connect_error', () => {
      if (!joined.value) {
        connecting.value = false;
        message.error('连接服务器失败，请确认后端服务已启动');
        disconnectSocket();
      }
    });
  }

  /* ---------- 退出聊天室 ---------- */
  function leaveRoom(silent = false) {
    disconnectSocket();
    joined.value = false;
    msgList.value = [];
    onlineUsers.value = [];
    typingUsers.value.clear();
    lastTypingSent = false;
    if (!silent) message.info('已退出聊天室');
  }

  /* ---------- 发送消息 ---------- */
  function sendMessage() {
    const content = inputMsg.value.trim();
    if (!content) return;
    if (!getSocket() || !joined.value) {
      message.warning('请先加入聊天室');
      return;
    }
    emitEvent('chatMessage', {
      room: DEFAULT_ROOM,
      username: nickname.value.trim(),
      content
    });
    inputMsg.value = '';
    // 发送后停止 typing 提示
    emitEvent('typing', { typing: false });
    lastTypingSent = false;
  }

  /* ---------- 正在输入提示（节流） ---------- */
  function updateTyping() {
    if (!getSocket() || !joined.value) return;
    const typing = !!inputMsg.value.trim();
    if (typing !== lastTypingSent) {
      emitEvent('typing', { typing });
      lastTypingSent = typing;
    }
    clearTimeout(typingTimer!);
    typingTimer = setTimeout(() => {
      if (lastTypingSent) {
        emitEvent('typing', { typing: false });
        lastTypingSent = false;
      }
    }, 2000);
  }

  /* ---------- 加载更多历史 ---------- */
  function refreshHistory() {
    if (!getSocket() || !joined.value) return;
    emitEvent('history', { page: 1, pageSize: 50 });
    message.info('已刷新最新历史消息');
  }

  /* ---------- 组件卸载时清理 ---------- */
  function dispose() {
    clearTimeout(typingTimer!);
    typingTimer = null;
    disconnectSocket();
    joined.value = false;
    lastTypingSent = false;
  }

  return {
    // 状态
    nickname,
    joined,
    connecting,
    inputMsg,
    msgList,
    onlineUsers,
    typingUsers,
    // 操作
    joinRoom,
    leaveRoom,
    sendMessage,
    updateTyping,
    refreshHistory,
    dispose
  };
});
