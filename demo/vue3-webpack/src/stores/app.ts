import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

// 把 DTO 处理成 VO, 后端给我们的数据结构不重要 无所谓 只要给了就行
function tanstrom() {}

// /* app 根模块 */  这个模块一旦庞大 必须拆分出去
export const useAppStore = defineStore('app', () => {
  const hello = ref({}); // 只维护 我的 的 View Object   新人只关心view object
  return {
    hello
  };
});
