import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

/* 服务监控 */
export const useMonitoringStore = defineStore('monitoring', () => {
  const count = ref(0);

  // 用户停留时间
  const durationOfStay = ref([0, 0]);

  function setStart(value: number) {
    durationOfStay.value[0] = value;
  }
  function setEnd(value: number) {
    durationOfStay.value[1] = value;
  }

  return { count };
});

/**
 * 服务监控和数据埋点

1. 监控程序错误：
2. 监控性能瓶颈
3. 监控用户行为

1. 收集为什么报错 做了什么操作报错 报错的行号列号
2. FCP 等性能指标 有没有明显问题
3. 用户行为：用户停留 用户点击 

收集数据越多 开发成本越高 数据越详细

和前端相关的就是 数据埋点 ，数据埋点是服务监控的一个环节而已 

要么自己做 要么用开源的 神策 sentry

用户行为埋点 统一日志记录 权限与安全控制 性能监控 缓存处理

监控性能和监控错误 对业务代码没有侵入性
对用户行为的埋点 会对业务代码有侵入性


 */
