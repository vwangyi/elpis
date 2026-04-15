import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

/* probe 探针模块 */
export const useProbeStore = defineStore('probe', () => {
  const hello = ref(0);
  return {
    hello
  };
});
