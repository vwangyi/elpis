<script setup lang="ts">
import {
  ref,
  reactive,
  nextTick,
  onMounted,
  onBeforeUnmount,
  computed,
  watch
} from 'vue';
import { io, type Socket } from 'socket.io-client';
import { message } from 'ant-design-vue';
import {
  SendOutlined,
  UserOutlined,
  ReloadOutlined,
  PoweroffOutlined
} from '@ant-design/icons-vue';
import { P } from 'vue-router/dist/index-BN0B0y8a.js';

/* ================================================================
 *  类型定义（对齐后端 chat.gateway.ts / chat.entity.ts）
 * ================================================================ */

interface ChatMsg {
  id?: number;
  room?: string;
  username: string;
  content: string;
  createTime?: string;
  type?: 'user' | 'system';
}

interface OnlineUser {
  username: string;
  joinTime: number;
}

interface HistoryPayload {
  list: ChatMsg[];
  total: number;
  page: number;
  pageSize: number;
}

/* ================================================================
 *  配置
 * ================================================================ */

const CHAT_NAMESPACE = '/chat';
const DEFAULT_ROOM = 'public';

/* ================================================================ *
  你好
 * ================================================================ */

/* ================================================================
 * 状态
 * ================================================================ */
let socket: Socket | null = null;
const nickname = ref('');
const joined = ref(false);
const connecting = ref(false);
const inputMsg = ref('');
const msgList = ref<ChatMsg[]>([]);
const onlineUsers = ref<OnlineUser[]>([]);
const typingUsers = ref<Set<string>>(new Set());

// 节流相关（非响应式）
let typingTimer: ReturnType<typeof setTimeout> | null = null;
let lastTypingSent = false;
/**
 * 0. 销毁socket对象
 */
function closeSocket() {
  socket?.close();
  socket = null;
}

/**
 * 1. 创建socket对象
 */
function createSocket(): Socket {
  closeSocket();
  socket = io('/chat', {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 2000
  });
  return socket;
}
/**
 * 2. 绑定所有事件
 */
function batchEventBinding(s: Socket) {
  // s?.on('')
}

/**
 * 3. 进入聊天室
 */
function enterChatRoom() {
  const name = nickname.value.trim();
  if (!name) {
    message.warning('请输入昵称');
    return;
  }
  const s = createSocket();
  batchEventBinding(s);
  s.on('connect', () => {
    if (joined.value && nickname.value) {
      s.emit('join', { username: nickname.value, room: DEFAULT_ROOM });
      return;
    }
    s.emit('join', { username: name, room: DEFAULT_ROOM });
    joined.value = true;
    connecting.value = false;
    message.success(`欢迎加入聊天室，${name}`);
  });
  // 连接失败
  s.on('connect_error', () => {
    if (!joined.value) {
      connecting.value = false;
      message.error('连接服务器失败，请确认后端服务已启动');
      disconnectSocket();
    }
  });
}

function connectSocket(): Socket {
  disconnectSocket();
  socket = io(CHAT_NAMESPACE, {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 2000
  });
  console.log(socket);
  return socket;
}

function getSocket(): Socket | null {
  return socket;
}

function disconnectSocket(): void {
  socket?.close();
  socket = null;
}

function emitEvent<T = unknown>(event: string, payload?: T): void {
  socket?.emit(event, payload);
}

/* ================================================================
 *  Socket 事件绑定
 * ================================================================ */

function bindSocketEvents(s: Socket) {
  // 连接建立 —— 后端会 emit('connected', { socketId })
  s.on('connected', (data: { socketId: string }) => {
    console.log('[chat] 已连接，socketId =', data.socketId);
  });

  // 断线重连后自动重新加入房间
  s.on('connect', () => {
    console.log('xxxxxxxxxxxxxx', '断线重连后自动重新加入房间');
    if (joined.value && nickname.value) {
      s.emit('join', { username: nickname.value, room: DEFAULT_ROOM });
    }
  });

  // 历史消息（join 后服务端自动下发 / 翻页请求）
  s.on('history', (data: HistoryPayload) => {
    msgList.value = (data.list || []).map(m => ({ ...m, type: 'user' }));
  });

  // 收到聊天消息
  s.on('chatMessage', (msg: ChatMsg) => {
    msgList.value.push({ ...msg, type: 'user' });
    typingUsers.value.delete(msg.username);
  });

  // 上线通知
  s.on('userJoined', (data: { username: string; time: string }) => {
    msgList.value.push({
      username: 'system',
      content: `${data.username} 加入了聊天室`,
      createTime: data.time,
      type: 'system'
    });
  });

  // 下线通知
  s.on('userLeft', (data: { username: string; time: string }) => {
    msgList.value.push({
      username: 'system',
      content: `${data.username} 离开了聊天室`,
      createTime: data.time,
      type: 'system'
    });
    typingUsers.value.delete(data.username);
  });

  // 在线用户列表
  s.on('onlineUsers', (data: { users: OnlineUser[] }) => {
    onlineUsers.value = data.users || [];
  });

  // 正在输入（后端只转发给同房间其他人，自己不会收到自己发的）
  s.on('typing', (data: { username: string; typing: boolean }) => {
    if (data.typing) typingUsers.value.add(data.username);
    else typingUsers.value.delete(data.username);
  });

  // 被顶号（同名登录）
  s.on('kicked', (data: { message: string }) => {
    message.warning(data.message || '您已在其他地方登录');
    leaveRoom(true);
  });

  // 错误
  s.on('error', (data: { message: string }) => {
    message.error(data.message || '发生错误');
  });

  // 断线
  s.on('disconnect', () => {
    if (joined.value) {
      message.warning('与服务器的连接已断开，正在尝试重连...');
    }
  });
}

/* ================================================================
 *  业务方法
 * ================================================================ */

/** 加入聊天室 */
function joinRoom() {
  const name = nickname.value.trim();
  if (!name) {
    message.warning('请输入昵称');
    return;
  }

  connecting.value = true;
  const s = connectSocket();
  bindSocketEvents(s);

  // 首次连接成功后发送 join
  s.on('connect', () => {
    console.log('xxxxxxxxxxxxxx', '首次连接成功后发送');

    s.emit('join', { username: name, room: DEFAULT_ROOM });
    joined.value = true;
    connecting.value = false;
    message.success(`欢迎加入聊天室，${name}`);
  });

  // 连接失败（首次）
  s.on('connect_error', () => {
    if (!joined.value) {
      connecting.value = false;
      message.error('连接服务器失败，请确认后端服务已启动');
      disconnectSocket();
    }
  });
}

/** 退出聊天室 */
function leaveRoom(silent = false) {
  disconnectSocket();
  joined.value = false;
  msgList.value = [];
  onlineUsers.value = [];
  typingUsers.value.clear();
  lastTypingSent = false;
  if (!silent) message.info('已退出聊天室');
}

/** 发送消息 */
function sendMessage() {
  const content = inputMsg.value.trim();
  if (!content) return;
  if (!getSocket() || !joined.value) {
    message.warning('请先加入聊天室');
    return;
  }

  // 后端 CreateChatDto: { room, username, content }
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

/** 正在输入提示（节流，2s 内不重复发送） */
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

/** 刷新历史消息 */
function refreshHistory() {
  if (!getSocket() || !joined.value) return;
  emitEvent('history', { page: 1, pageSize: 50 });
  message.info('已刷新最新历史消息');
}

/** 组件卸载时清理 */
function dispose() {
  clearTimeout(typingTimer!);
  typingTimer = null;
  disconnectSocket();
  joined.value = false;
  lastTypingSent = false;
}

/* ================================================================
 *  组件视图逻辑
 * ================================================================ */

const messagesRef = ref<HTMLElement | null>(null);

/** 格式化时间：今天显示 HH:mm，跨天显示 M-D HH:mm */
function formatTime(time?: string | number | Date) {
  if (!time) return '';
  const d = new Date(time);
  const now = new Date();
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return sameDay
    ? `${hh}:${mm}`
    : `${d.getMonth() + 1}-${d.getDate()} ${hh}:${mm}`;
}

function scrollToBottom() {
  nextTick(() => {
    const el = messagesRef.value;
    if (el) el.scrollTop = el.scrollHeight;
  });
}

// 消息数量变化时自动滚动到底部
watch(
  () => msgList.value.length,
  () => scrollToBottom()
);

const typingText = computed(() => {
  const names = [...typingUsers.value];
  if (!names.length) return '';
  if (names.length === 1) return `${names[0]} 正在输入...`;
  return `${names.slice(0, 2).join('、')} 正在输入...`;
});

function handleInputKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

/* ---------- 生命周期 ---------- */
onMounted(() => {
  scrollToBottom();
});

onBeforeUnmount(() => {
  dispose();
});
</script>

<template>
  <div class="chat-view">
    <!-- 未加入：昵称登录页 -->
    <div
      v-if="!joined"
      class="join-panel"
    >
      <div class="join-card">
        <h2>💬 WebSocket 聊天室</h2>
        <p class="sub">输入昵称，加入公共聊天室</p>
        <a-input
          v-model:value="nickname"
          size="large"
          placeholder="请输入昵称"
          :maxlength="20"
          @press-enter="joinRoom()"
        >
          <template #prefix>
            <UserOutlined />
          </template>
        </a-input>
        <a-button
          type="primary"
          size="large"
          block
          :loading="connecting"
          style="margin-top: 16px"
          @click="joinRoom()"
        >
          进入聊天室
        </a-button>
      </div>
    </div>

    <!-- 已加入：聊天主界面 -->
    <div
      v-else
      class="chat-room"
    >
      <!-- 头部 -->
      <div class="room-header">
        <div class="room-title">
          💬 公共聊天室
          <span class="online-count">
            （{{ onlineUsers.length }} 人在线）
          </span>
        </div>
        <div class="header-actions">
          <a-button
            size="small"
            @click="refreshHistory()"
          >
            <template #icon>
              <ReloadOutlined />
            </template>
            刷新
          </a-button>
          <a-button
            size="small"
            danger
            @click="leaveRoom()"
          >
            <template #icon>
              <PoweroffOutlined />
            </template>
            退出
          </a-button>
        </div>
      </div>

      <div class="room-body">
        <!-- 消息区 -->
        <div
          ref="messagesRef"
          class="messages"
        >
          <div
            v-for="(msg, index) in msgList"
            :key="msg.id ?? `idx-${index}`"
            class="msg-row"
            :class="{
              system: msg.type === 'system',
              self: msg.type === 'user' && msg.username === nickname.trim()
            }"
          >
            <!-- 系统消息 -->
            <div
              v-if="msg.type === 'system'"
              class="system-msg"
            >
              {{ msg.content }}
              <span class="sys-time">{{ formatTime(msg.createTime) }}</span>
            </div>

            <!-- 用户消息 -->
            <template v-else>
              <div class="avatar">
                {{ msg.username.slice(0, 1).toUpperCase() }}
              </div>
              <div class="bubble-wrap">
                <div class="msg-meta">
                  <span class="msg-username">{{ msg.username }}</span>
                  <span class="msg-time">{{ formatTime(msg.createTime) }}</span>
                </div>
                <div class="bubble">{{ msg.content }}</div>
              </div>
            </template>
          </div>

          <!-- 空状态 -->
          <div
            v-if="msgList.length === 0"
            class="empty-state"
          >
            还没有消息，发一条试试吧 👋
          </div>
        </div>

        <!-- 在线用户侧栏 -->
        <div class="user-panel">
          <div class="panel-title">在线成员（{{ onlineUsers.length }}）</div>
          <div
            v-for="user in onlineUsers"
            :key="user.username"
            class="user-item"
            :class="{ self: user.username === nickname.trim() }"
          >
            <span class="user-dot"></span>
            <span class="user-name">{{ user.username }}</span>
            <span
              v-if="user.username === nickname.trim()"
              class="me-tag"
              >我</span
            >
          </div>
        </div>
      </div>

      <!-- 输入区 -->
      <div class="input-area">
        <div class="typing-tip">{{ typingText }}</div>
        <div class="input-row">
          <a-textarea
            v-model:value="inputMsg"
            placeholder="输入消息，Enter 发送，Shift + Enter 换行"
            :auto-size="{ minRows: 1, maxRows: 4 }"
            :maxlength="2000"
            @keydown="handleInputKeydown"
            @input="updateTyping()"
          />
          <a-button
            type="primary"
            :disabled="!inputMsg.trim()"
            @click="sendMessage()"
          >
            <template #icon>
              <SendOutlined />
            </template>
            发送
          </a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.chat-view {
  width: 100%;
  height: 100%;
  background: #f5f7fa;
}

/* ---------- 登录页 ---------- */
.join-panel {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .join-card {
    width: 360px;
    padding: 40px 32px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
    text-align: center;

    h2 {
      margin-bottom: 8px;
    }

    .sub {
      color: #999;
      margin-bottom: 24px;
    }
  }
}

/* ---------- 聊天室 ---------- */
.chat-room {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.room-header {
  height: 52px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background: #fff;
  border-bottom: 1px solid #eee;

  .room-title {
    font-size: 16px;
    font-weight: 600;

    .online-count {
      font-size: 13px;
      font-weight: 400;
      color: #999;
    }
  }

  .header-actions {
    display: flex;
    gap: 8px;
  }
}

.room-body {
  flex: 1;
  display: flex;
  min-height: 0;
}

/* 消息区 */
.messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;

  .msg-row {
    display: flex;
    margin-bottom: 14px;

    &.self {
      flex-direction: row-reverse;

      .bubble-wrap {
        align-items: flex-end;

        .msg-meta {
          flex-direction: row-reverse;
        }
      }

      .bubble {
        background: #1677ff;
        color: #fff;
      }
    }

    &.system {
      justify-content: center;
    }
  }

  .system-msg {
    font-size: 12px;
    color: #999;
    background: #eee;
    border-radius: 10px;
    padding: 3px 12px;

    .sys-time {
      margin-left: 6px;
      color: #bbb;
    }
  }

  .avatar {
    width: 36px;
    height: 36px;
    flex-shrink: 0;
    border-radius: 50%;
    background: linear-gradient(135deg, #67c23a, #1677ff);
    color: #fff;
    font-size: 15px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 8px;
  }

  .bubble-wrap {
    display: flex;
    flex-direction: column;
    max-width: 55%;

    .msg-meta {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 4px;

      .msg-username {
        font-size: 12px;
        color: #666;
      }

      .msg-time {
        font-size: 11px;
        color: #bbb;
      }
    }

    .bubble {
      background: #fff;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 14px;
      line-height: 1.6;
      word-break: break-word;
      white-space: pre-wrap;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
    }
  }

  .empty-state {
    text-align: center;
    color: #ccc;
    font-size: 14px;
    margin-top: 40px;
  }
}

/* 在线用户 */
.user-panel {
  width: 200px;
  flex-shrink: 0;
  background: #fff;
  border-left: 1px solid #eee;
  padding: 12px;
  overflow-y: auto;

  .panel-title {
    font-size: 13px;
    font-weight: 600;
    color: #333;
    margin-bottom: 10px;
  }

  .user-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 8px;
    border-radius: 6px;
    font-size: 13px;
    color: #333;

    &:hover {
      background: #f5f5f5;
    }

    &.self {
      background: #e6f4ff;
    }

    .user-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #52c41a;
    }

    .user-name {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .me-tag {
      font-size: 11px;
      color: #1677ff;
      border: 1px solid #1677ff;
      border-radius: 4px;
      padding: 0 4px;
    }
  }
}

/* 输入区 */
.input-area {
  flex-shrink: 0;
  background: #fff;
  border-top: 1px solid #eee;
  padding: 10px 16px 14px;

  .typing-tip {
    height: 18px;
    font-size: 12px;
    color: #999;
  }

  .input-row {
    display: flex;
    gap: 10px;
    align-items: flex-end;
  }
}
</style>
