<template>
  <div
    class="simple-unified-editor"
  >
    <div
      ref="editorRef"
      class="editor-area"
      contenteditable="true"
      @input="handleInput"
      @keydown.tab.prevent="
        handleTab
      "
      @paste="handlePaste"
      :data-placeholder="
        placeholder
      "
    ></div>
  </div>
</template>

<script setup>
import {
  ref,
  onMounted
} from 'vue';

const editorRef = ref(null);
const placeholder = ref(
  '开始输入 Markdown...'
);
const markdownText = ref('');

const handleInput = () => {
  markdownText.value =
    editorRef.value.innerText;
  renderInlineFormatting();
};

const renderInlineFormatting =
  () => {
    const html =
      markdownText.value
        .replace(
          /^# (.+)$/gm,
          '<h1>$1</h1>'
        )
        .replace(
          /^## (.+)$/gm,
          '<h2>$1</h2>'
        )
        .replace(
          /\*\*(.+?)\*\*/g,
          '<strong>$1</strong>'
        )
        .replace(
          /\*(.+?)\*/g,
          '<em>$1</em>'
        )
        .replace(
          /`(.+?)`/g,
          '<code>$1</code>'
        )
        .replace(
          /\n/g,
          '<br>'
        );

    editorRef.value.innerHTML =
      html;
  };

const handleTab = event => {
  event.preventDefault();
  document.execCommand(
    'insertText',
    false,
    '    '
  );
};

const handlePaste = event => {
  event.preventDefault();
  const text =
    event.clipboardData.getData(
      'text/plain'
    );
  document.execCommand(
    'insertText',
    false,
    text
  );
};

onMounted(() => {
  editorRef.value.focus();
});
</script>

<style scoped>
.simple-unified-editor {
  width: 100%;
  height: 300px;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.editor-area {
  width: 100%;
  height: 100%;
  padding: 16px;
  font-size: 16px;
  line-height: 1.6;
  outline: none;
  overflow-y: auto;
  font-family:
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI', Roboto,
    sans-serif;
}

.editor-area:empty:before {
  content: attr(
    data-placeholder
  );
  color: #999;
}

.editor-area h1 {
  font-size: 1.8em;
  margin: 0.5em 0;
  color: #333;
}

.editor-area h2 {
  font-size: 1.4em;
  margin: 0.4em 0;
  color: #555;
}

.editor-area strong {
  font-weight: bold;
  color: #333;
}

.editor-area em {
  font-style: italic;
  color: #666;
}

.editor-area code {
  font-family:
    'SFMono-Regular',
    Consolas, monospace;
  background: #f6f8fa;
  padding: 2px 4px;
  border-radius: 3px;
  font-size: 0.9em;
}
</style>
