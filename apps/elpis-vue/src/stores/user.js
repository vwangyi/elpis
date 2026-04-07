import {
  ref,
  computed
} from 'vue';
import { defineStore } from 'pinia';

/* user 用户模块 */
export const useUserStore =
  defineStore('user', () => {
    const list = ref([]); // 用户列表
    const user = ref({}); // 用户详情

    /* 增 */
    async function create() {}

    /* 删 */
    async function remove(
      userId
    ) {
      // const user = list.value.find((item) => item.userId === userId);
    }

    /* 改 */
    async function update() {}

    /* 查列表 */
    async function findAll() {
      // const result = await userApi.findAll();
      // list.value = result;
    }
    /* 查详情 */
    async function findOne() {
      // const result = await userApi.findOne();
      // user.value = result;
    }

    return {
      list,
      user,
      create,
      remove,
      update,
      findAll,
      findOne
    };
  });
