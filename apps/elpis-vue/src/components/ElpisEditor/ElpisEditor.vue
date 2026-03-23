<script setup>
/* Vditor 富文本编辑器 */
import { message } from 'ant-design-vue';
import { onMounted, ref } from 'vue';
import Vditor from 'vditor';
import 'vditor/src/assets/less/index'; // 引入样式
import { useEventListener } from '@/hooks/useEventListener.js';
import { useNoteStore } from '@/stores/note.js';

const props = defineProps({
  type: { type: String, default: '' }, // create | update // create表示新增 update表示修改
  data: { type: Object, default: () => ({}) }
});

const noteStore = useNoteStore();
const contentEditor = ref(null);
const editorOptions = ref({
  mode: 'ir', // wysiwyg所见即所得 | sv分屏渲染 | ir即时渲染
  theme: 'dark', // light | dark | auto
  height: window.innerHeight - 72,
  outline: {
    enable: true, // 启用大纲
    position: 'right' // 位置：left | 'right'
  },
  cache: {
    enable: false
  },
  preview: {
    theme: {
      current: 'dark' // 预览区的主题，light | dark | auto
    },
    hljs: {
      style: 'xcode', // 设置代码块主题 亮色建议 xcode 暗色建议 base16/chalk
      lineNumber: true // 代码块显示行号
    },
    markdown: {
      toc: true // 启用目录
    }
  },
  toolbarConfig: {
    hide: false, // 是否隐藏工具栏
    pin: false // 是否固定工具栏
  },

  after: () => {
    // 当前是update模式 且content有值 就设置 Markdown 内容

    console.log('props.type', props.type, props.data.content);
    if (props.type === 'update' && props.data.content) {
      contentEditor.value.setValue(props.data.content);
    }
  },
  lineNumber: true
});

/* 监听键盘按下事件 */
function handleKeyDown(event) {
  // 监听保存快捷键 ctrl+s 或 cmd+s
  if ((event.metaKey || event.ctrlKey) && event.key === 's') {
    event.preventDefault();
    saveContent();
  }

  /* 保存文章到服务器 */
  async function saveContent() {
    console.log('saveContent');
    const mdContent = contentEditor.value.getValue(); // 获取 Markdown 内容
    const htmlContent = contentEditor.value.getHTML(); // 获取 HTML 内容

    // 验证内容
    if (!mdContent.trim()) {
      console.log('文章内容不能为空', 'error');
      return;
    }

    const data = {
      content: mdContent,
      time: +new Date()
    };

    console.log('props.type', props.type);
    if (props.type === 'create') {
      await noteStore.create(data);
      console.log('数据创建成功');
    } else if (false) {
    }

    // console.log("准备保存文章内容:", mdContent);
  }
}

/* 页面初始化挂载 执行 */
function init() {
  contentEditor.value = new Vditor('editor', editorOptions.value);
  useEventListener(document, 'keydown', handleKeyDown);
}

onMounted(init);
</script>

<template>
  <div class="elpis-editor">
    <div id="editor"></div>
  </div>
</template>

<style lang="scss" scoped>
.elpis-editor {
  width: 100%;
  height: 100%;
  background-color: #141414;
}

// vditor支持主题 所以下面就作废了

// :deep(.vditor-toolbar) {
//   background-color: #1e1e1e !important;
// }

// :deep(.vditor) {
//   border: none;
//   --border-color: #1e1e1e !important;
//   --textarea-text-color: #fff !important; // 大纲目录的标题 文字颜色
//   // --panel-background-color: #141414 !important;
// }
// :deep(.vditor-ir pre.vditor-reset) {
//   background-color: #1e1e1e !important;
// }

// :deep(.vditor-outline) {
//   background-color: #1e1e1e !important;
// }

// :deep(.vditor-reset) {
//   color: #fff !important; // 编辑区 文字颜色
// }

// :deep(.hljs) {
//   color: #596069; // 代码块的文字颜色
//   color: #e18897;
//   background: #141414; // 代码块的背景颜色
// }
</style>
