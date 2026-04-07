import {
  ref,
  computed
} from 'vue';
import { defineStore } from 'pinia';

/* skin 皮肤模块 */
export const useSkinStore =
  defineStore('skin', () => {
    // 鼠、牛、虎、兔、龙、蛇、马、羊、猴、鸡、狗、猪。
    const skin = ref('');

    return { skin };
  });
