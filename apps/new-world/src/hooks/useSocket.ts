import { io, type Socket } from 'socket.io-client';
import { onDeactivated, onMounted, onUnmounted } from 'vue';

export function useSocket(url: string) {
  let socket: Socket | null = null;

  onMounted(() => {});

  onUnmounted(() => {
    socket?.close();
    socket = null;
  });

  onDeactivated(() => {
    socket?.close();
    socket = null;
  });

  return {};
}
