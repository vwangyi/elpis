<script setup>
/**
 *
 */
import {
  onMounted,
  ref,
  useTemplateRef,
  watch
} from 'vue';
import { message } from 'ant-design-vue';

const dialog = useTemplateRef(
  'dialog'
);

const props = defineProps({
  // 弹窗是否打开
  open: {
    type: Boolean,
    default: false
  },
  // 弹窗宽度
  width: {
    type: Number,
    default: 520
  },
  // 弹窗高度
  height: {
    type: Number,
    default: 300
  },
  // 是否展示遮罩蒙层
  mask: {
    type: Boolean,
    default: true
  },
  // 是否支持 按键esc 关闭弹窗
  esc: {
    type: Boolean,
    default: false
  }
});
const emit = defineEmits([
  'update:open'
]);
/* ============================================================= 方法 ========================================================= */
const show = () => {
  if (props.mask) {
    console.log(
      '模态方式打开'
    );
    dialog.value.showModal(); // 模态方式打开
  } else {
    console.log(
      '非模态方式打开'
    );
    dialog.value.show(); // 非模态方式打开
  }
};

// 关闭弹窗
const close = () => {
  dialog.value.close();
  emit('update:open', false);
};

// 确认操作
const confirm = () => {
  closeModal();
};

// 监听关闭事件
const handleClose =
  event => {};

// 监听取消事件（按 ESC 键）
const handleCancel =
  event => {};

// 点击蒙层触发
function handleClickMask() {
  close();
}

/* 页面初始化调用 */
function init() {}

onMounted(init);

watch(
  () => props.open,
  open => {
    console.log(
      'watch open',
      open
    );
    if (open) {
      show();
    } else {
      close();
    }
  }
);
</script>

<template>
  <dialog
    ref="dialog"
    class="dialog"
    @click.stop="
      handleClickMask
    "
  >
    <div
      class="dialog-content"
      @click.stop
    >
      <slot></slot>
    </div>
  </dialog>
</template>

<style lang="scss" scoped>
/* 原生弹窗 */
.dialog {
  /* 全屏设置 */
  position: fixed;
  width: 100vw;
  height: 100vh;
  max-width: none;
  max-height: none;
  margin: 0;
  border: none;
  outline: none;
  padding: 0;
  background: transparent;
  /* 隐藏对话框的默认背景 */
  &::backdrop {
    background: rgba(
      0,
      0,
      0,
      0.7
    );
    // background: transparent;
  }
}

.dialog-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(
    -50%,
    -50%
  );
  border-radius: 8px;
  overflow: hidden;
}
</style>
