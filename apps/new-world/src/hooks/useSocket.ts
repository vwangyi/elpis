import { io, type Socket } from 'socket.io-client';
import { onMounted, onUnmounted } from 'vue';

export function useSocket(url: string) {
  let socket: Socket | null = null;

  onMounted(() => {});

  onUnmounted(() => {
    socket = null;
  });

  return {};
}
