<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

// 如果没有安装 marked，可以使用简单的转换函数
// 或者使用 CDN: <scri src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></scri>

// 配置 marked
marked.setOptions({
  breaks: true, // 自动换行
  gfm: true, // 启用 GitHub Flavored Markdown
  headerIds: false // 禁用自动生成 header id
});

// 数据
const markdownText = ref(
  '# Hello Markdown\n\n这是一个简单的 **Markdown 编辑器**。\n\n- 支持实时预览\n- 支持基本语法\n- 代码高亮\n\n```javascript\nconsole.log("Hello World")\n```\n\n> 这是一个引用\n\n[这是一个链接](https://vuejs.org)'
);
const autoRender = ref(true);
const textareaRef = ref(null);

// 工具栏按钮
const toolbarButtons = [
  {
    text: 'H1',
    action: 'h1',
    title: '一级标题'
  },
  {
    text: 'H2',
    action: 'h2',
    title: '二级标题'
  },
  {
    text: 'B',
    action: 'bold',
    title: '加粗'
  },
  {
    text: 'I',
    action: 'italic',
    title: '斜体'
  },
  {
    text: '📄',
    action: 'link',
    title: '链接'
  },
  {
    text: '🖼️',
    action: 'image',
    title: '图片'
  },
  {
    text: '📋',
    action: 'code',
    title: '代码块'
  },
  {
    text: '•',
    action: 'list',
    title: '无序列表'
  },
  {
    text: '1.',
    action: 'olist',
    title: '有序列表'
  },
  {
    text: '>',
    action: 'quote',
    title: '引用'
  },
  {
    text: '📏',
    action: 'hr',
    title: '分割线'
  },
  {
    text: '📊',
    action: 'table',
    title: '表格'
  }
];

// 统计信息
const wordCount = computed(() => {
  const text = markdownText.value.trim();
  return text ? text.split(/\s+/).length : 0;
});

const charCount = computed(() => markdownText.value.length);

const lineCount = computed(() => markdownText.value.split('\n').length);

// 渲染后的 HTML
const renderedHtml = computed(() => {
  if (!markdownText.value.trim()) {
    return '<p class="empty-preview">内容为空，请输入 Markdown 内容...</p>';
  }

  try {
    const rawHtml = marked.parse(markdownText.value);
    // 使用 DOMPurify 清理 HTML，防止 XSS 攻击
    const a = DOMPurify.sanitize(rawHtml, {
      ALLOWED_TAGS: [
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'p',
        'br',
        'hr',
        'strong',
        'em',
        'b',
        'i',
        'u',
        's',
        'blockquote',
        'code',
        'pre',
        'ul',
        'ol',
        'li',
        'table',
        'thead',
        'tbody',
        'tr',
        'th',
        'td',
        'a',
        'img',
        'div',
        'span'
      ],
      ALLOWED_ATTR: ['href', 'target', 'src', 'alt', 'title', 'class', 'id']
    });
    console.log(markdownText.value);
    console.dir(textareaRef.value.value);
    console.log(a);
    return a;
  } catch (error) {
    return `<div class="error">渲染错误: ${error.message}</div>`;
  }
});

// 处理 Tab 键缩进
const handleTab = event => {
  event.preventDefault();
  const textarea = textareaRef.value;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;

  // 插入两个空格作为缩进
  const text = markdownText.value;
  const newText = text.substring(0, start) + '  ' + text.substring(end);

  markdownText.value = newText;

  // 恢复光标位置
  setTimeout(() => {
    textarea.selectionStart = textarea.selectionEnd = start + 2;
  }, 0);
};

// 插入 Markdown 语法
const insertMarkdown = type => {
  const textarea = textareaRef.value;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selectedText = markdownText.value.substring(start, end);
  const text = markdownText.value;

  let insertText = '';
  let cursorOffset = 0;

  switch (type) {
    case 'h1':
      insertText = `# ${selectedText}`;
      cursorOffset = selectedText ? 0 : 2;
      break;
    case 'h2':
      insertText = `## ${selectedText}`;
      cursorOffset = selectedText ? 0 : 3;
      break;
    case 'bold':
      insertText = `**${selectedText}**`;
      cursorOffset = selectedText ? 0 : 2;
      break;
    case 'italic':
      insertText = `*${selectedText}*`;
      cursorOffset = selectedText ? 0 : 1;
      break;
    case 'link':
      insertText = `[${selectedText || '链接文字'}](https://example.com)`;
      cursorOffset = selectedText ? 0 : 1;
      break;
    case 'image':
      insertText = `![${selectedText || '图片描述'}](https://picsum.photos/400/300)`;
      cursorOffset = selectedText ? 0 : 2;
      break;
    case 'code':
      if (selectedText.includes('\n')) {
        insertText = `\`\`\`\n${selectedText}\n\`\`\``;
        cursorOffset = 3;
      } else {
        insertText = `\`${selectedText}\``;
        cursorOffset = selectedText ? 0 : 1;
      }
      break;
    case 'list':
      insertText = selectedText
        ? selectedText
            .split('\n')
            .map(line => `- ${line}`)
            .join('\n')
        : '- ';
      cursorOffset = 2;
      break;
    case 'olist':
      insertText = selectedText
        ? selectedText
            .split('\n')
            .map((line, i) => `${i + 1}. ${line}`)
            .join('\n')
        : '1. ';
      cursorOffset = 3;
      break;
    case 'quote':
      insertText = selectedText
        ? selectedText
            .split('\n')
            .map(line => `> ${line}`)
            .join('\n')
        : '> ';
      cursorOffset = 2;
      break;
    case 'hr':
      insertText = '\n---\n';
      cursorOffset = 1;
      break;
    case 'table':
      insertText = `| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |\n| Cell 3   | Cell 4   |`;
      cursorOffset = 0;
      break;
  }

  const newText = text.substring(0, start) + insertText + text.substring(end);
  markdownText.value = newText;

  // 设置新的光标位置
  setTimeout(() => {
    if (selectedText) {
      textarea.selectionStart = start;
      textarea.selectionEnd = start + insertText.length;
    } else {
      textarea.selectionStart = textarea.selectionEnd = start + cursorOffset;
    }
    textarea.focus();
  }, 0);
};

// 手动渲染
const manualRender = () => {
  const preview = document.querySelector('.preview-content');
  preview.style.display = 'block';
};

// 导出内容
const exportContent = () => {
  const blob = new Blob([markdownText.value], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `markdown-${new Date().getTime()}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// 组件挂载时聚焦
onMounted(() => {
  if (textareaRef.value) {
    textareaRef.value.focus();
  }
});
</script>
<template>
  <div class="markdown-editor">
    <div class="editor-container">
      <!-- 编辑区 -->
      <div class="editor-section">
        <div v-if="false" class="section-header">
          <h3>编辑</h3>
          <div class="toolbar">
            <button
              v-for="btn in toolbarButtons"
              :key="btn.action"
              @click="insertMarkdown(btn.action)"
              :title="btn.title"
              class="toolbar-btn"
            >
              {{ btn.text }}
            </button>
          </div>
        </div>
        <textarea
          ref="textareaRef"
          v-model="markdownText"
          class="editor-textarea"
          placeholder="请输入 Markdown 内容..."
          @input="handleInput"
          @keydown.tab.prevent="handleTab"
        ></textarea>
      </div>

      <!-- 预览区 -->
      <div class="preview-section">
        <div v-if="false" class="section-header">
          <h3>预览</h3>
          <div class="preview-controls">
            <label>
              <input type="checkbox" v-model="autoRender" />
              自动渲染
            </label>
            <button @click="exportContent" class="export-btn">导出</button>
          </div>
        </div>
        <div
          class="preview-content"
          v-html="renderedHtml"
          v-show="autoRender"
        ></div>
        <div v-show="!autoRender" class="render-prompt">
          <button @click="manualRender" class="render-btn">点击渲染</button>
        </div>
      </div>
    </div>

    <!-- 字数统计 -->
    <div class="stats">
      <span>字数：{{ wordCount }}</span>
      <span>字符数：{{ charCount }}</span>
      <span>行数：{{ lineCount }}</span>
    </div>
  </div>
</template>

<style scoped>
.markdown-editor {
  display: flex;
  flex-direction: column;
  height: 80vh;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  color: #dedede;
  background-color: #363b41;
}

.editor-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.editor-section,
.preview-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0; /* 防止 flex 溢出 */
}

.editor-section {
  border-right: 1px solid #e0e0e0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
}

.section-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.toolbar {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.toolbar-btn {
  padding: 6px 12px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.toolbar-btn:hover {
  background: #f0f0f0;
  border-color: #bbb;
}

.preview-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.export-btn,
.render-btn {
  padding: 6px 12px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.export-btn:hover,
.render-btn:hover {
  background: #0056b3;
}

.editor-textarea {
  flex: 1;
  padding: 16px;
  border: none;
  resize: none;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.6;
  outline: none;
}

.preview-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
}

.render-prompt {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  color: #666;
}

.stats {
  padding: 12px 16px;
  background: #f8f9fa;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 20px;
  font-size: 12px;
  color: #666;
}

/* 预览区域样式 */
.preview-content :deep(h1) {
  font-size: 2em;
  margin: 0.67em 0;
  border-bottom: 2px solid #eee;
  padding-bottom: 0.3em;
}

.preview-content :deep(h2) {
  font-size: 1.5em;
  margin: 0.75em 0;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.3em;
}

.preview-content :deep(h3) {
  font-size: 1.25em;
  margin: 0.83em 0;
}

.preview-content :deep(p) {
  margin: 1em 0;
}

.preview-content :deep(code) {
  background: #f6f8fa;
  padding: 2px 4px;
  border-radius: 3px;
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-size: 0.9em;
}

.preview-content :deep(pre) {
  background: #f6f8fa;
  padding: 12px;
  border-radius: 6px;
  overflow-x: auto;
  border: 1px solid #e1e4e8;
}

.preview-content :deep(pre code) {
  background: none;
  padding: 0;
}

.preview-content :deep(blockquote) {
  border-left: 4px solid #ddd;
  margin: 1em 0;
  padding-left: 1em;
  color: #666;
}

.preview-content :deep(ul, ol) {
  padding-left: 2em;
}

.preview-content :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 1em 0;
}

.preview-content :deep(th, td) {
  border: 1px solid #ddd;
  padding: 8px 12px;
  text-align: left;
}

.preview-content :deep(th) {
  background: #f6f8fa;
  font-weight: 600;
}

.preview-content :deep(a) {
  color: #0366d6;
  text-decoration: none;
}

.preview-content :deep(a:hover) {
  text-decoration: underline;
}

.preview-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}

.empty-preview {
  color: #999;
  text-align: center;
  padding: 40px;
  font-style: italic;
}

.error {
  color: #dc3545;
  padding: 16px;
  background: #f8d7da;
  border-radius: 4px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .editor-container {
    flex-direction: column;
  }

  .editor-section {
    border-right: none;
    border-bottom: 1px solid #e0e0e0;
    height: 50%;
  }

  .toolbar {
    max-width: 300px;
    overflow-x: auto;
  }

  .stats {
    flex-wrap: wrap;
    gap: 10px;
  }
}
</style>
