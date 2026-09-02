import { defineStore } from 'pinia';
import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';
import { ref } from 'vue';
export const useChatStore = defineStore('chat', () => {
  const socket = ref<null | Socket>(null);

  function closeSocket() {
    socket.value?.close(); // close之后就不用off解绑了
    socket.value = null;
  }
  function createSocket() {
    closeSocket(); // 关闭上一次的
    socket.value = io('/chat', {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 2000
    });
  }

  function connected() {
    if (socket.value !== null) {
      socket.value.on('connected', (data: { socketId: string }) => {
        console.log('[chat] 已连接 socketId =', data.socketId);
      });
    }
  }

  async function init(name: string) {
    return new Promise((resolve, reject) => {
      socket.value?.on('connect', () => {
        // return resolve();
      });

      resolve(false);
    });
  }

  //   socket.value?.on('connected', connected); // 连接成功后
  //   socket.value?.on('disconnect', disconnect); // 收到断线了
  //   socket.value?.on('error', error); // 收到发生错误
  //   socket.value?.on('kicked', kicked); // 收到 被顶号了
  //   socket.value?.on('typing', typing); // 正在输入
  //   socket.value?.on('onlineUsers', onlineUsers); // 获取在线列表
  //   socket.value?.on('userLeft', userLeft); // 收到下线通知
  //   socket.value?.on('userJoined', userJoined); // 收到上线通知
  //   socket.value?.on('chatMessage', chatMessage); // 收到消息
  //   socket.value?.on('history', history); // 获取历史消息

  //   socket.on('message', handleMessage)
  //   socket.off('message', handleMessage)

  function connectSuccess() {}
  function connectError() {}

  socket.value?.on('connect', connectSuccess); // 断线后自动重连
  socket.value?.on('connect_error', connectError); // 连接失败触发
  return {
    init // 进入聊天室
  };
});
