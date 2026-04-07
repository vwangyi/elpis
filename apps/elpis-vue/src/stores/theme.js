import {
  ref,
  computed
} from 'vue';
import { defineStore } from 'pinia';

/* theme 主题模块 */
export const useThemeStore =
  defineStore('theme', () => {
    const LOCAL_THEME_KEY =
      '__theme__';
    const match =
      window.matchMedia(
        '(prefers-color-scheme: dark)'
      );

    // 支持的主题类型
    const themes = ref([
      {
        value: 'dart',
        title: '暗色主题'
      },
      {
        value: 'light',
        title: '浅色主题'
      },
      {
        value: 'OS',
        title: '跟随系统'
      }
    ]);
    const theme =
      ref('light'); // dart | light | OS

    // dart | light  htmlTheme将和html上的值保持一致
    const htmlTheme =
      computed(() => {
        if (
          theme.value === 'OS'
        ) {
          return match.matches
            ? 'dark'
            : 'light';
        }
        return theme.value;
      });

    function init() {
      const localTheme =
        localStorage.getItem(
          LOCAL_THEME_KEY
        ); // 先看上一次有没有选择主题
      if (localTheme) {
        theme.value =
          localTheme;
      } else {
        theme.value =
          match.matches
            ? 'dark'
            : 'light'; // 如果没有就采用浏览器系统主题
      }
    }

    function setTheme() {
      // 给html标签 追加属性 data-theme
      document.documentElement.setAttribute(
        'data-theme',
        value
      );
      // 持久化存储
      localStorage.setItem(
        LOCAL_THEME_KEY,
        value
      );
      // 更新当前内存中变量
      theme.value = value;

      // 触发事件，让其他组件知道主题变化, 其他组件 document.addEventListener("themechange",() => {})
      document.dispatchEvent(
        new window.CustomEvent(
          'themechange',
          {
            detail: {
              theme: value
            }
          }
        )
      );
    }

    /* 使用主题 */
    function applyTheme(
      value
    ) {
      if (!themes.some(value))
        return; // 不允许传不支持的类型

      if (value === 'OS') {
        // 只有当用户选择 跟随系统 我们才监听
        //   value = match.matches ? "dark" : "light";
        match.addEventListener(
          'change',
          setTheme
        );
      } else {
        match.removeEventListener(
          'change',
          setTheme
        );
      }

      setTheme();
    }

    /* 切换主题 */
    function toggleTheme() {
      applyTheme(
        theme.value ===
          'light'
          ? 'dark'
          : 'light'
      );
    }

    init();
    return {
      themes,
      theme,
      applyTheme,
      toggleTheme
    };
  });
