<script setup>
/* 富文本编辑器 */
import { onBeforeUnmount, ref, shallowRef, onMounted } from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import '@wangeditor/editor/dist/css/style.css'; // 引入 css
const mode = 'default'; // 编辑器模式，支持 'default' 和 'simple'

import { Boot } from '@wangeditor/editor';
import module from '@wangeditor/plugin-md';
// 注册 markdown 插件
Boot.registerModule(module);
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();
// 内容 HTML
const valueHtml = ref('<p>hello</p>');

// 模拟 ajax 异步获取内容
onMounted(() => {
  setTimeout(() => {
    valueHtml.value = '<p>模拟 Ajax 异步设置内容</p>';
  }, 1500);
});

const toolbarConfig = {};

// 给 wangeditor 添加简单的 markdown 快捷键
const editorConfig = {
  placeholder: '请输入内容...',
  hoverbarKeys: {
    link: {
      menuKeys: ['editLink', 'unLink', 'viewLink']
    }
  },
  EXTEND_CONF: {
    // 自定义快捷键
    markdownShortcuts: {
      '**': 'bold', // **文本** 加粗
      '*': 'italic', // *文本* 斜体
      '# ': 'header1', // # 标题
      '## ': 'header2', // ## 标题
      '[]': 'todo' // [ ] 待办事项
    }
  }
};
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

const handleCreated = editor => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};
</script>

<template>
  <div class="rich-editor">
    <div style="border: 1px solid #ccc">
      <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />
      <Editor
        style="height: 500px; overflow-y: hidden"
        v-model="valueHtml"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="handleCreated"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.rich-editor {
  width: 100%;
  height: 100%;
  color: #fff;
}

:deep(.w-e-bar) {
  background-color: transparent;
  color: #fff;
}
:deep(.w-e-text-container) {
  background-color: transparent;
  color: #fff;
}
</style>
