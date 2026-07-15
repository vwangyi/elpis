import { unref, watch } from 'vue';

/**
 * 页面上 常常实现 绑定事件 卸载时移除事件 这里封装一个hooks解决
 * useEventListener(window, 'move', function(e) {console.log(e)})
 * 以后绑定事件 就用这个hooks 不用原生的了
 * const haha = useTemplateRef('haha') 
    useEventListener(haha,  'mousemove', function(e: Event) {
    console.log('mousemove', e)
    })
 */

// 调用方式：useEventListener(window, 'click', () => {})

// 参数1 不传默认是 window 可以传ref对象 用来绑定事件
// 参数2 事件名
// 参数3 事件处理函数
// 参数4 配置对象 可选
// useEventListener(window, 'click', () => {}, {})
export function useEventListener(...args) {
  /**
   * 这一句写的非常优雅 实现的是 第一个参数可传可不传 不传就是window
   * 因为第二个参数 一定是string
   * 所以 如果第一个参数是string 那就表示没传第一个参数
   * 再所以 第一个参数不是string 那就表示传了第一个参数
   * 注意 args.shift() 会影响原数组 后面的args就没有第一个参数了
   */
  const target = typeof args[0] === 'string' ? window : args.shift();

  // 为什么用watch 而不用 onMounted, onUnmounted
  // 因为某个组件可能是 v-if="false"过几秒才true onMounted挂载钩子就拿不到
  // 所以用监听
  return watch(
    () => unref(target),
    (element, _, onCleanup) => {
      if (!element) return;

      // 此时 argsArray 中只剩下 [event, handler, options?]
      // 解构时进行类型断言
      const [event, handler, options] = args;

      if (!event || !handler) return;

      element.addEventListener(event, handler, options);
      /**
       * onCleanup传入的回调 有两个时机会调用
       * 1 页面卸载之前调用
       * 2 当前watch传入的回调 调用之前 会先调用onCleanup
       */
      onCleanup(() => {
        element.removeEventListener(event, handler, options);
      });
    },
    { immediate: true }
  );
}
