import {
  ref,
  computed
} from 'vue';
import { defineStore } from 'pinia';
import * as AuthApi from '@/api/auth';
import * as userApi from '@/api/user';

/* auth 鉴权模块 */
export const useAuthStore =
  defineStore(
    'auth',
    () => {
      const userInfo =
        ref(null); // 当前登录用户信息 不存在表示未登录

      async function sendEmailCode(
        email
      ) {
        const result =
          await AuthApi.sendEmailCode(
            email
          );
        return result;
      }

      async function loginByEmailAndCode({
        email,
        code
      }) {
        await AuthApi.loginByEmailAndCode(
          { email, code }
        );
        await findUserInfo(); // 登录成功后获取用户信息
      }

      /* 获取当前登录用户信息 */
      async function findUserInfo() {
        const res =
          await userApi.findUserInfo();
        userInfo.value = {
          ...res.data,
          userId:
            res.data?.user_id
        };
      }

      /* 清空当前登录用户信息 */
      function clearUserInfo() {
        userInfo.value = null;
      }

      async function logout() {
        await AuthApi.logout();
        clearUserInfo();
      }

      return {
        userInfo,
        sendEmailCode,
        loginByEmailAndCode,
        logout,
        findUserInfo,
        clearUserInfo
      };
    },
    {
      persist: {
        storage: localStorage,
        pick: ['userInfo']
      }
    }
  );
