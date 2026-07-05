<script>
import { defineComponent, h } from 'vue';

export function withAuth(WrappedComponent) {
  return defineComponent({
    name: 'WithAuth',
    setup(props, { attrs, slots }) {
      // 模拟登录状态（实际项目从 store 或 localStorage 获取）
      const isLoggedIn = true;

      return () => {
        if (!isLoggedIn) {
          // 未登录：显示提示
          return h('div', {}, '⚠️ 请先登录');
        }

        // 已登录：渲染被包装组件，透传所有属性和插槽
        return h(WrappedComponent, attrs, slots);
      };
    }
  });
}
</script>
