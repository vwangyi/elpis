<template>
  <div class="unified-markdown-editor">
    <!-- 工具栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <button
          v-for="btn in formatButtons"
          :key="btn.action"
          @click="insertMarkdown(btn.action)"
          :title="btn.title"
          class="toolbar-btn"
        >
          <span v-html="btn.icon"></span>
        </button>
      </div>
      <div class="toolbar-right">
        <button
          @click="toggleMode"
          class="mode-toggle"
          :title="editMode === 'preview' ? '切换到编辑模式' : '切换到预览模式'"
        >
          {{ editMode === "edit" ? "👁️ 预览" : "✏️ 编辑" }}
        </button>
        <button @click="exportContent" class="export-btn" title="导出">📥 导出</button>
      </div>
    </div>

    <!-- 统一编辑区域 -->
    <div
      ref="editorRef"
      class="unified-editor"
      :contenteditable="editMode === 'edit'"
      @input="handleInput"
      @paste="handlePaste"
      @keydown="handleKeydown"
      @blur="handleBlur"
      @mouseup="saveSelection"
      @focus="restoreSelection"
      :class="{ 'preview-mode': editMode === 'preview' }"
    >
      <!-- 这里的内容会被动态渲染 -->
    </div>

    <!-- 字数统计 -->
    <div class="footer-stats">
      <span>字数：{{ wordCount }}</span>
      <span>字符数：{{ charCount }}</span>
      <span>模式：{{ editMode === "edit" ? "编辑" : "预览" }}</span>
    </div>

    <!-- 格式化面板（悬浮） -->
    <div v-if="showFormatPanel" class="format-panel" :style="formatPanelStyle">
      <button @click="formatText('bold')" title="加粗">B</button>
      <button @click="formatText('italic')" title="斜体">I</button>
      <button @click="formatText('link')" title="链接">🔗</button>
      <button @click="formatText('code')" title="代码"><></button>
      <button @click="hideFormatPanel">×</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from "vue";
import { marked } from "marked";
import DOMPurify from "dompurify";

// 配置 marked
marked.setOptions({
  breaks: true,
  gfm: true,
  headerIds: false
});

// 状态
const editorRef = ref(null);
const editMode = ref("edit"); // 'edit' 或 'preview'
const showFormatPanel = ref(false);
const formatPanelStyle = ref({ top: "0", left: "0" });
const currentSelection = ref(null);

// 初始内容
const initialContent = `# 一体化 Markdown 编辑器

这是一款像 **Typora** 一样的一体化编辑器，编辑和预览在同一区域。

## 基本功能
- **实时渲染**：输入时自动转换 Markdown 语法
- **混合编辑**：纯文本和渲染内容同时显示
- **快捷操作**：选中文本显示格式面板

## 使用方法
1. 直接输入 Markdown 语法
2. 选中文本会出现格式工具栏
3. 点击右上角按钮切换模式

## 代码示例
\`\`\`javascript
// 这是一个示例
function hello() {
  console.log('Hello Markdown!')
}
\`\`\`

> 提示：试试选中一些文字看看效果！`;

// 工具栏按钮
const formatButtons = [
  { icon: "H1", action: "h1", title: "一级标题" },
  { icon: "H2", action: "h2", title: "二级标题" },
  { icon: "<b>B</b>", action: "bold", title: "加粗" },
  { icon: "<i>I</i>", action: "italic", title: "斜体" },
  { icon: "📋", action: "code", title: "代码块" },
  { icon: "•", action: "list", title: "无序列表" },
  { icon: "1.", action: "olist", title: "有序列表" },
  { icon: ">", action: "quote", title: "引用" },
  { icon: "📏", action: "hr", title: "分割线" },
  { icon: "🖼️", action: "image", title: "插入图片" },
  { icon: "🔗", action: "link", title: "插入链接" }
];

// 字数统计
const contentText = ref(initialContent);
const wordCount = computed(() => {
  const text = contentText.value.trim();
  return text ? text.split(/\s+/).length : 0;
});

const charCount = computed(() => contentText.value.length);

// 保存选区
const saveSelection = () => {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    if (editorRef.value.contains(range.commonAncestorContainer)) {
      currentSelection.value = range.cloneRange();

      // 显示格式面板
      if (!range.collapsed) {
        const rect = range.getBoundingClientRect();
        const editorRect = editorRef.value.getBoundingClientRect();
        showFormatPanel.value = true;
        formatPanelStyle.value = {
          top: `${rect.top - editorRect.top - 40}px`,
          left: `${rect.left - editorRect.left + rect.width / 2}px`,
          transform: "translateX(-50%)"
        };
      } else {
        showFormatPanel.value = false;
      }
    }
  }
};

// 恢复选区
const restoreSelection = () => {
  if (currentSelection.value) {
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(currentSelection.value);
  }
};

// 输入处理
const handleInput = event => {
  const html = event.target.innerHTML;
  contentText.value = htmlToMarkdown(html);

  // 如果是编辑模式，实时渲染
  if (editMode.value === "edit") {
    nextTick(() => {
      renderMixedContent();
    });
  }
};

// HTML 转 Markdown（简化版）
const htmlToMarkdown = html => {
  let text = html;

  // 移除渲染的标签，恢复 Markdown
  text = text
    .replace(/<h1[^>]*>(.*?)<\/h1>/g, "# $1\n\n")
    .replace(/<h2[^>]*>(.*?)<\/h2>/g, "## $1\n\n")
    .replace(/<strong[^>]*>(.*?)<\/strong>/g, "**$1**")
    .replace(/<b[^>]*>(.*?)<\/b>/g, "**$1**")
    .replace(/<em[^>]*>(.*?)<\/em>/g, "*$1*")
    .replace(/<i[^>]*>(.*?)<\/i>/g, "*$1*")
    .replace(/<code[^>]*>(.*?)<\/code>/g, "`$1`")
    .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/g, "[$2]($1)")
    .replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/g, "![$2]($1)")
    .replace(/<ul[^>]*>(.*?)<\/ul>/gs, (match, p1) => {
      return p1.replace(/<li[^>]*>(.*?)<\/li>/g, "- $1\n") + "\n";
    })
    .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/g, "> $1\n\n")
    .replace(/<div[^>]*class="code-block"[^>]*>(.*?)<\/div>/g, "```\n$1\n```\n\n")
    .replace(/<br>/g, "\n")
    .replace(/<\/?[^>]+(>|$)/g, ""); // 移除其他标签

  return text.trim();
};

// 渲染混合内容（编辑模式下）
const renderMixedContent = () => {
  if (!editorRef.value || editMode.value === "preview") return;

  const lines = contentText.value.split("\n");
  let renderedHtml = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // 空行
    if (line.trim() === "") {
      renderedHtml += '<div class="empty-line"><br></div>';
      continue;
    }

    // 代码块开始
    if (line.trim().startsWith("```")) {
      const language = line.trim().substring(3).trim() || "";
      let codeContent = "";
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeContent += lines[i] + "\n";
        i++;
      }
      renderedHtml += `
        <div class="code-block" contenteditable="false">
          <div class="code-header">
            <span class="language">${language || "text"}</span>
            <button class="copy-btn" onclick="copyCode(this)">复制</button>
          </div>
          <pre><code>${escapeHtml(codeContent)}</code></pre>
        </div>
      `;
      continue;
    }

    // 标题
    if (line.match(/^#{1,6}\s/)) {
      const level = line.match(/^(#+)\s/)[1].length;
      const content = line.substring(level + 1);
      renderedHtml += `<h${level} class="live-heading">${content}</h${level}>`;
      continue;
    }

    // 列表项
    if (line.match(/^[-*+]\s/)) {
      const content = line.substring(2);
      renderedHtml += `<div class="list-item"><span class="bullet">•</span> ${renderInlineMarkdown(content)}</div>`;
      continue;
    }

    // 有序列表
    if (line.match(/^\d+\.\s/)) {
      const match = line.match(/^(\d+)\.\s/);
      const number = match[1];
      const content = line.substring(number.length + 2);
      renderedHtml += `<div class="list-item"><span class="number">${number}.</span> ${renderInlineMarkdown(content)}</div>`;
      continue;
    }

    // 引用
    if (line.startsWith("> ")) {
      const content = line.substring(2);
      renderedHtml += `<blockquote class="live-quote">${renderInlineMarkdown(content)}</blockquote>`;
      continue;
    }

    // 分割线
    if (line.match(/^[-*_]{3,}$/)) {
      renderedHtml += '<hr class="live-hr">';
      continue;
    }

    // 普通段落
    renderedHtml += `<div class="paragraph">${renderInlineMarkdown(line)}</div>`;
  }

  // 保存光标位置
  const selection = window.getSelection();
  const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

  // 更新内容
  editorRef.value.innerHTML = renderedHtml;

  // 恢复光标位置
  if (range && editorRef.value.contains(range.startContainer)) {
    selection.removeAllRanges();
    selection.addRange(range);
  }
};

// 渲染行内 Markdown
const renderInlineMarkdown = text => {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, "<code>$1</code>")
    .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="inline-image">')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="inline-link" contenteditable="false">$1</a>');
};

// HTML 转义
const escapeHtml = text => {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
};

// 按键处理
const handleKeydown = event => {
  // Enter 键自动格式化
  if (event.key === "Enter") {
    setTimeout(() => {
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      const currentNode = range.startContainer;
      const currentLine = getCurrentLine(currentNode, range.startOffset);

      // 列表项自动继续
      if (currentLine.match(/^[-*+]\s/)) {
        event.preventDefault();
        document.execCommand("insertHTML", false, '<div class="list-item"><span class="bullet">•</span> </div>');
      }

      // 有序列表自动编号
      if (currentLine.match(/^\d+\.\s/)) {
        event.preventDefault();
        const match = currentLine.match(/^(\d+)\.\s/);
        const nextNumber = parseInt(match[1]) + 1;
        document.execCommand(
          "insertHTML",
          false,
          `<div class="list-item"><span class="number">${nextNumber}.</span> </div>`
        );
      }
    }, 0);
  }

  // Tab 键缩进
  if (event.key === "Tab") {
    event.preventDefault();
    document.execCommand("insertHTML", false, "&nbsp;&nbsp;&nbsp;&nbsp;");
  }
};

// 获取当前行内容
const getCurrentLine = (node, offset) => {
  let text = "";
  let currentNode = node;

  if (currentNode.nodeType === Node.TEXT_NODE) {
    text = currentNode.textContent;
  } else if (currentNode.nodeType === Node.ELEMENT_NODE) {
    text = currentNode.textContent;
  }

  // 简化处理：取文本到光标位置，然后找行开始
  const textBeforeCursor = text.substring(0, offset);
  const lines = textBeforeCursor.split("\n");
  return lines[lines.length - 1];
};

// 粘贴处理
const handlePaste = event => {
  event.preventDefault();
  const text = event.clipboardData.getData("text/plain");

  // 清理粘贴的文本
  const cleanedText = text.replace(/<[^>]*>/g, "");

  // 插入到光标位置
  document.execCommand("insertText", false, cleanedText);
};

// 插入 Markdown 语法
const insertMarkdown = type => {
  if (editMode.value === "preview") {
    editMode.value = "edit";
    nextTick(() => {
      performInsert(type);
    });
  } else {
    performInsert(type);
  }
};

const performInsert = type => {
  const selection = window.getSelection();
  const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

  if (!range) return;

  const selectedText = selection.toString();
  let insertText = "";

  switch (type) {
    case "h1":
      insertText = `# ${selectedText || "标题"}`;
      break;
    case "h2":
      insertText = `## ${selectedText || "子标题"}`;
      break;
    case "bold":
      insertText = `**${selectedText || "加粗文字"}**`;
      break;
    case "italic":
      insertText = `*${selectedText || "斜体文字"}*`;
      break;
    case "code":
      if (selectedText.includes("\n")) {
        insertText = `\`\`\`\n${selectedText}\n\`\`\``;
      } else {
        insertText = `\`${selectedText || "代码"}\``;
      }
      break;
    case "list":
      insertText = `- ${selectedText || "列表项"}`;
      break;
    case "olist":
      insertText = `1. ${selectedText || "列表项"}`;
      break;
    case "quote":
      insertText = `> ${selectedText || "引用内容"}`;
      break;
    case "hr":
      insertText = "\n---\n";
      break;
    case "image":
      insertText = `![${selectedText || "图片描述"}](${getRandomImage()})`;
      break;
    case "link":
      insertText = `[${selectedText || "链接文字"}](https://example.com)`;
      break;
  }

  document.execCommand("insertText", false, insertText);
  editorRef.value.focus();
};

// 获取随机图片
const getRandomImage = () => {
  const width = 400;
  const height = 300;
  return `https://picsum.photos/${width}/${height}?random=${Math.random()}`;
};

// 格式面板操作
const formatText = type => {
  insertMarkdown(type);
  hideFormatPanel();
};

const hideFormatPanel = () => {
  showFormatPanel.value = false;
};

// 切换模式
const toggleMode = () => {
  editMode.value = editMode.value === "edit" ? "preview" : "edit";

  nextTick(() => {
    if (editMode.value === "preview") {
      renderFullPreview();
    } else {
      renderMixedContent();
    }
  });
};

// 渲染完整预览
const renderFullPreview = () => {
  if (!editorRef.value) return;

  try {
    const rawHtml = marked.parse(contentText.value);
    const cleanHtml = DOMPurify.sanitize(rawHtml, {
      ALLOWED_TAGS: [
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "p",
        "br",
        "hr",
        "strong",
        "em",
        "b",
        "i",
        "u",
        "s",
        "blockquote",
        "code",
        "pre",
        "ul",
        "ol",
        "li",
        "table",
        "thead",
        "tbody",
        "tr",
        "th",
        "td",
        "a",
        "img",
        "div",
        "span"
      ],
      ALLOWED_ATTR: ["href", "target", "src", "alt", "title", "class", "id"]
    });

    editorRef.value.innerHTML = `
      <div class="full-preview">
        ${cleanHtml}
      </div>
    `;
  } catch (error) {
    editorRef.value.innerHTML = `<div class="error">渲染错误: ${error.message}</div>`;
  }
};

// 导出内容
const exportContent = () => {
  const blob = new Blob([contentText.value], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `markdown-${new Date().getTime()}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// 失焦处理
const handleBlur = () => {
  showFormatPanel.value = false;
};

// 初始化
onMounted(() => {
  renderMixedContent();
});

// 监听模式变化
watch(editMode, newMode => {
  if (newMode === "edit") {
    nextTick(() => {
      editorRef.value.focus();
    });
  }
});

// 复制代码函数（暴露给全局）
window.copyCode = button => {
  const codeBlock = button.closest(".code-block");
  const code = codeBlock.querySelector("code").textContent;
  navigator.clipboard.writeText(code).then(() => {
    const originalText = button.textContent;
    button.textContent = "已复制";
    setTimeout(() => {
      button.textContent = originalText;
    }, 2000);
  });
};
</script>

<style scoped>
.unified-markdown-editor {
  display: flex;
  flex-direction: column;
  height: 80vh;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.toolbar-left {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.toolbar-right {
  display: flex;
  gap: 12px;
  align-items: center;
}

.toolbar-btn {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
}

.toolbar-btn:hover {
  background: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.mode-toggle {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  transition: all 0.2s ease;
}

.mode-toggle:hover {
  background: white;
  transform: translateY(-2px);
}

.export-btn {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  transition: all 0.2s ease;
}

.export-btn:hover {
  background: white;
  transform: translateY(-2px);
}

.unified-editor {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  line-height: 1.8;
  outline: none;
  font-size: 16px;
  min-height: 200px;
}

.unified-editor.preview-mode {
  cursor: default;
  background: #f8f9fa;
}

.unified-editor:not(.preview-mode) {
  background: white;
}

/* 实时渲染样式 */
.live-heading {
  margin: 1.5em 0 0.5em;
  padding-bottom: 0.3em;
  border-bottom: 1px solid #eaecef;
}

.live-heading:first-child {
  margin-top: 0;
}

.paragraph {
  margin: 1em 0;
  min-height: 1.5em;
}

.empty-line {
  min-height: 1.5em;
  opacity: 0.3;
}

.list-item {
  display: flex;
  align-items: flex-start;
  margin: 0.5em 0;
  padding-left: 1em;
}

.bullet,
.number {
  margin-right: 8px;
  color: #666;
  user-select: none;
}

.number {
  font-variant-numeric: tabular-nums;
}

.live-quote {
  margin: 1em 0;
  padding: 0.5em 1em;
  border-left: 4px solid #dfe2e5;
  color: #6a737d;
  background: #f6f8fa;
  border-radius: 0 4px 4px 0;
}

.live-hr {
  border: none;
  border-top: 1px solid #dfe2e5;
  margin: 2em 0;
}

.code-block {
  background: #f6f8fa;
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  margin: 1.5em 0;
  overflow: hidden;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #e1e4e8;
  border-bottom: 1px solid #d1d5da;
  font-size: 14px;
  font-family: "SFMono-Regular", Consolas, monospace;
}

.language {
  color: #666;
  font-weight: 500;
}

.copy-btn {
  padding: 4px 8px;
  background: white;
  border: 1px solid #d1d5da;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
}

.copy-btn:hover {
  background: #f6f8fa;
}

.code-block pre {
  margin: 0;
  padding: 12px;
  overflow-x: auto;
}

.code-block code {
  font-family: "SFMono-Regular", Consolas, monospace;
  font-size: 14px;
  line-height: 1.4;
}

.inline-image {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  vertical-align: middle;
  max-height: 200px;
}

.inline-link {
  color: #0366d6;
  text-decoration: none;
  cursor: pointer;
}

.inline-link:hover {
  text-decoration: underline;
}

strong,
em,
code {
  transition: background-color 0.2s ease;
}

strong:hover,
em:hover,
code:hover {
  background-color: rgba(255, 255, 0, 0.1);
}

/* 完整预览模式 */
.full-preview {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.full-preview h1 {
  font-size: 2em;
  margin: 0.67em 0;
  border-bottom: 2px solid #eaecef;
  padding-bottom: 0.3em;
}

.full-preview h2 {
  font-size: 1.5em;
  margin: 0.75em 0;
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.3em;
}

.full-preview pre {
  background: #f6f8fa;
  padding: 16px;
  border-radius: 6px;
  overflow-x: auto;
}

/* 格式面板 */
.format-panel {
  position: absolute;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 8px;
  display: flex;
  gap: 4px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  animation: slideIn 0.2s ease;
}

.format-panel button {
  padding: 6px 12px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.format-panel button:hover {
  background: #f0f0f0;
}

/* 页脚统计 */
.footer-stats {
  padding: 12px 16px;
  background: #f8f9fa;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 20px;
  font-size: 12px;
  color: #666;
}

.footer-stats span {
  display: flex;
  align-items: center;
}

/* 动画 */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px) translateX(-50%);
  }
  to {
    opacity: 1;
    transform: translateY(0) translateX(-50%);
  }
}

/* 响应式 */
@media (max-width: 768px) {
  .unified-markdown-editor {
    height: 70vh;
  }

  .toolbar {
    flex-direction: column;
    gap: 12px;
    padding: 12px;
  }

  .toolbar-left,
  .toolbar-right {
    width: 100%;
    justify-content: center;
  }

  .unified-editor {
    padding: 16px;
    font-size: 15px;
  }

  .format-panel {
    transform: translateX(-50%) !important;
    top: auto !important;
    bottom: 20px;
    left: 50% !important;
  }
}
</style>
