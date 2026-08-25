import { ref, computed, readonly } from 'vue';
import { defineStore } from 'pinia';

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0);
  const doubleCount = computed(() => count.value * 2);
  function increment() {
    count.value++;
  }

  return {
    count: readonly(count), // ref需要readonly包裹 防止外部直接赋值
    doubleCount, // computed不需要readonly包裹
    increment
  };
});
