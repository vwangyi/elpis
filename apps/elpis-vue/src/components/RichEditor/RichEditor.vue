<script setup>
/* 富文本编辑器 */
// import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
// import { Boot } from '@wangeditor/editor';
// import module from '@wangeditor/plugin-md';
// const { Editor, Toolbar, Boot, module } = await importWangeditor(); // import()懒加载
import {
  onBeforeUnmount,
  ref,
  shallowRef,
  onMounted
} from 'vue';
import '@wangeditor/editor/dist/css/style.css'; // 引入 css
// unplugin-auto-import 自动导入插件
import { isArray } from '@/utils/index.js';
console.log(
  'isArray',
  isArray([1, 2, 3])
);

const EditorComp =
  shallowRef(null);
const ToolbarComp =
  shallowRef(null);
// const EditorComp = shallowRef(Editor);
// const ToolbarComp = shallowRef(Toolbar);

// Boot.registerModule(module); // 注册 markdown 插件

async function importWangeditor() {
  const [
    { Editor, Toolbar },
    { Boot },
    module
  ] = await Promise.all([
    import(
      /* webpackChunkName: "@wangeditor/editor-for-vue" */ '@wangeditor/editor-for-vue'
    ),
    import(
      /* webpackChunkName: "@wangeditor/editor" */ '@wangeditor/editor'
    ),
    import(
      /* webpackChunkName: "@wangeditor/plugin-md" */ '@wangeditor/plugin-md'
    )
  ]);
  Boot.registerModule(module); // 注册 markdown 插件
  console.log('懒加载成功了');
  EditorComp.value = Editor;
  ToolbarComp.value = Toolbar;
  return {
    Editor,
    Toolbar,
    Boot,
    module
  };
}
const mode = 'default'; // 编辑器模式，支持 'default' 和 'simple'

// 编辑器实例，必须用 shallowRef
const editorRef =
  shallowRef();
// 内容 HTML
const valueHtml = ref(
  '<p>hello</p>'
);

// 模拟 ajax 异步获取内容
onMounted(async () => {
  setTimeout(() => {
    valueHtml.value =
      '<p>模拟 Ajax 异步设置内容</p>';
  }, 1500);
});

console.log('懒加载前');
onMounted(() => {
  importWangeditor();
});

const toolbarConfig = {};

// 给 wangeditor 添加简单的 markdown 快捷键
const editorConfig = {
  placeholder:
    '请输入内容...',
  hoverbarKeys: {
    link: {
      menuKeys: [
        'editLink',
        'unLink',
        'viewLink'
      ]
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
  const editor =
    editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

const handleCreated =
  editor => {
    editorRef.value = editor; // 记录 editor 实例，重要！
  };
</script>

<template>
  <div class="rich-editor">
    <div
      style="
        border: 1px solid #ccc;
      "
    >
      <ToolbarComp
        v-if="ToolbarComp"
        style="
          border-bottom: 1px
            solid #ccc;
        "
        :editor="editorRef"
        :defaultConfig="
          toolbarConfig
        "
        :mode="mode"
      />
      <EditorComp
        v-if="EditorComp"
        style="
          height: 500px;
          overflow-y: hidden;
        "
        v-model="valueHtml"
        :defaultConfig="
          editorConfig
        "
        :mode="mode"
        @onCreated="
          handleCreated
        "
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
