import {
  ref,
  computed
} from 'vue';
import { defineStore } from 'pinia';

/* error 错误监控模块 */ // 错误监控 性能监控 行为监控
export const useErrorStore =
  defineStore('error', () => {
    const errorList = ref([]);

    /* 捕获错误 */
    function captureError(
      error
    ) {
      errorList.push(error);
    }

    /* 上报错误 */
    async function reportError() {}
    return {
      errorList,
      captureError,
      reportError
    };
  });
