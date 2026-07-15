import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

/* probe 探针模块: 所有的探针业务都在这里 */
export const useProbeStore = defineStore('probe', () => {
  const hello = ref(0);

  const aaa = ref([]); // view object

  const pageId = ref(''); // view object 简称 VO

  function setPggeId(value: string) {
    pageId.value = value;
  }

  function sendPageId() {
    // request()
    console.log('成功');
  }
  return {
    hello,
    pageId,
    setPggeId,
    sendPageId
  };
});
