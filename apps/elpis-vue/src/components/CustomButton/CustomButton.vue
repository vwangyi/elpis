<script setup>
import { ref, useAttrs } from 'vue';
import { omit } from 'lodash-es'; // omit($attrs, 'onClick')  用于排除对象的onclick属性
const loading = ref(false);

defineOptions({
  inheritAttrs: false // 不继承父组件的属性 到 当前组件的根元素上。如果继承会发现事件触发2次的问题
});

/*  useAttrs() 和 模版中的 $attrs 是一样的
    不通过 emit 拿 事件函数 而是 通过 attrs 拿事件函数的好处是 拿到异步函数 就可以不用单独传一个loading变量了
 */
const attrs = useAttrs(); // 和 模版中的 $attrs 是一样的

async function handleClick() {
  loading.value = true;
  try {
    await attrs.onClick?.(); // 用户传递的点击事件 是异步的 发请求的
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <el-button
    v-bind="omit($attrs, 'onClick')"
    :loading="loading"
    @click="handleClick"
  >
    <slot></slot>
  </el-button>
</template>
