import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

/* app 根模块 */
export const useAppStore = defineStore('app', () => {
  const hello = ref(0);

  return {
    hello
  };
});
