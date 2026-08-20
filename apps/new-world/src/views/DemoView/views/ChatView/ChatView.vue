<script setup lang="ts">
import {
  ref,
  nextTick,
  onMounted,
  onBeforeUnmount,
  computed,
  watch
} from 'vue';
import { storeToRefs } from 'pinia';
import {
  SendOutlined,
  UserOutlined,
  ReloadOutlined
} from '@ant-design/icons-vue';
import { useChatStore } from '@/stores/chat';

/* ---------- store ---------- */
const chatStore = useChatStore();
const {
  nickname,
  joined,
  connecting,
  inputMsg,
  msgList,
  onlineUsers,
  typingUsers
} = storeToRefs(chatStore);

const messagesRef = ref<HTMLElement | null>(null);

/* ---------- 工具 ---------- */
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

// 消息数量变化时滚动到底部
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
    chatStore.sendMessage();
  }
}

/* ---------- 生命周期 ---------- */
onMounted(() => {
  scrollToBottom();
});

onBeforeUnmount(() => {
  chatStore.dispose();
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
          @press-enter="chatStore.joinRoom()"
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
          @click="chatStore.joinRoom()"
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
            @click="chatStore.refreshHistory()"
          >
            <template #icon>
              <ReloadOutlined />
            </template>
            刷新
          </a-button>
          <a-button
            size="small"
            danger
            @click="chatStore.leaveRoom()"
            >退出</a-button
          >
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
            @input="chatStore.updateTyping()"
          />
          <a-button
            type="primary"
            :disabled="!inputMsg.trim()"
            @click="chatStore.sendMessage()"
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
