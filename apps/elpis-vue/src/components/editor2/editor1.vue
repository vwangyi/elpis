<script setup>
import {
  nextTick,
  onMounted,
  ref,
  useTemplateRef
} from 'vue';

const editor = useTemplateRef(
  'editor'
);
const inp =
  useTemplateRef('inp');

const cursorId = 'sdfsfsf'; // crypto.randomUUID();

// 渲染行内 Markdown
const renderInlineMarkdown =
  text => {
    return text
      .replace(
        /\*\*(.*?)\*\*/g,
        '<strong>$1</strong>'
      )
      .replace(
        /\*(.*?)\*/g,
        '<em>$1</em>'
      )
      .replace(
        /`(.*?)`/g,
        '<code>$1</code>'
      )
      .replace(
        /!\[(.*?)\]\((.*?)\)/g,
        '<img src="$2" alt="$1" class="inline-image">'
      )
      .replace(
        /\[(.*?)\]\((.*?)\)/g,
        '<a href="$2" class="inline-link" contenteditable="false">$1</a>'
      );
  };
// HTML 转义
const escapeHtml = text => {
  const div =
    document.createElement(
      'div'
    );
  div.textContent = text;
  return div.innerHTML;
};

function saveCursor() {
  const sel =
    window.getSelection();
  if (sel.rangeCount === 0)
    return null;

  const range =
    sel.getRangeAt(0);

  return {
    // 保存完整的Range信息
    startContainer:
      range.startContainer,
    startOffset:
      range.startOffset,
    endContainer:
      range.endContainer,
    endOffset:
      range.endOffset,

    // 保存视觉位置（用于恢复时检查）
    rect: range.getBoundingClientRect()

    // // 保存文本上下文（用于容错）
    // textBefore: this.getTextBefore(range, 50),
    // textAfter: this.getTextAfter(range, 50)
  };
}

function restoreCursor(
  cursorInfo
) {
  const sel =
    window.getSelection();
  sel.removeAllRanges();

  const range =
    document.createRange();

  try {
    // 尝试直接恢复
    range.setStart(
      cursorInfo.startContainer,
      cursorInfo.startOffset
    );
    range.setEnd(
      cursorInfo.endContainer,
      cursorInfo.endOffset
    );
  } catch (e) {
    // 如果节点不存在，使用文本上下文恢复
    this.restoreByContext(
      cursorInfo
    );
    return;
  }

  sel.addRange(range);
}
// 记录一下光标位置
function insertCursorMarker() {
  const selection =
    window.getSelection();
  if (
    selection.rangeCount === 0
  )
    return null;
  const range =
    selection.getRangeAt(0);
  const span =
    document.createElement(
      'span'
    );
  // 创建一个唯一的ID
  const id = `cursor-${crypto.randomUUID()}`;

  console.log('id', id);

  span.id = id;
  span.style.cssText = `
    display: inline-block;
    width: 0;
    height: 0;
    overflow: hidden;
    opacity: 0;
    pointer-events: none;
    position: absolute;
  `;
  span.setAttribute(
    'data-cursor-marker',
    'true'
  );

  // 插入标记
  range.insertNode(span);

  return id;
}

function createMarkerElement(
  id
) {
  const marker =
    document.createElement(
      'span'
    );
  marker.id = id;

  // 关键样式：完全隐藏且不影响布局
  marker.style.cssText = `
            all: initial !important; /* 重置所有样式 */
            display: inline !important;
            width: 0 !important;
            height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            font-size: 0 !important;
            line-height: 0 !important;
            opacity: 0 !important;
            visibility: hidden !important;
            position: static !important;
            pointer-events: none !important;
            user-select: none !important;
            overflow: hidden !important;
        `;

  // 添加识别属性
  marker.setAttribute(
    'data-cursor-marker',
    'true'
  );
  marker.setAttribute(
    'data-marker-type',
    'basic'
  );

  // 插入零宽空格，确保元素存在
  marker.textContent =
    '\u200B'; // 零宽空格

  return marker;
}
function saveCursor1() {
  const selection =
    window.getSelection();
  if (!selection.rangeCount)
    return null;

  const range =
    selection.getRangeAt(0);

  // 创建唯一ID
  const markerId = `cursor_marker_${Date.now()}_${this.markerCount++}`;

  // 创建标记元素
  const marker =
    createMarkerElement(
      markerId
    );

  // 在光标位置插入标记
  range.insertNode(marker);

  // 将光标移到标记后，避免标记影响用户输入
  const newRange =
    document.createRange();
  newRange.setStartAfter(
    marker
  );
  newRange.collapse(true);

  selection.removeAllRanges();
  selection.addRange(
    newRange
  );

  // 记录标记信息
  const markerInfo = {
    id: markerId,
    node: marker,
    timestamp: Date.now()
  };

  this.activeMarkers.set(
    markerId,
    markerInfo
  );

  return markerInfo;
}

/* 处理光标 */
function handleCursor(html) {
  // 保存光标: 把光标位置 通过 <span id="editor-cursor"></span> 给光标占位
  const selection =
    window.getSelection();

  /* case1: 没有光标 */
  if (
    selection.type ===
      'None' &&
    selection.rangeCount === 0
  ) {
  }
  /* case2: 存在光标且没有选中文本 */
  if (
    selection.type ===
      'Caret' &&
    selection.rangeCount === 1
  ) {
    const range =
      selection.getRangeAt(0);
    /*  */
    if (
      range.startContainer ===
        range.endContainer &&
      range.startOffset ===
        range.endOffset
    ) {
      console.log(
        '光标位置在 ',
        html,
        range.startContainer,
        range.startOffset
      );

      const span =
        document.createElement(
          'span'
        );
      span.id = cursorId;
      // span.className = "cursor-marker";
      // span.setAttribute("data-cursor-marker", "true");
      // span.setAttribute("data-timestamp", Date.now());

      // 移除上一次的
      const oldMarker =
        document.getElementById(
          cursorId
        );
      if (oldMarker) {
        oldMarker.remove();
        console.log(
          '通过ID移除了旧标记'
        );
      }
      // 添加标记
      console.log(
        '把dom插入到光标位置'
      );
      range.insertNode(span); // 把dom插入到光标位置
    }
  }
  /* case3: 光标选中文本 */
  if (
    selection.type ===
      'Range' &&
    selection.rangeCount > 0
  ) {
  }

  const saveCursor = () => {};
  // 恢复光标
  const restoreCursor =
    () => {};

  return [
    saveCursor,
    restoreCursor
  ];
}

// 处理所有标题级别 #1-6
function handleTitle(html) {
  // '>## '  '<div>##&nbsp;</div>'
  const headingRegex =
    /<div>(#{1,6})\s+(.*?)<\/div>/g;

  return html.replace(
    headingRegex,
    (
      match,
      hashes,
      content
    ) => {
      const level =
        hashes.length; // #的数量就是标题级别
      return `<h${level}>${content.trim()}</h${level}>`;
    }
  );
}

// 恢复光标
function moveToMarker(
  markerId
) {
  const marker =
    document.getElementById(
      markerId
    );
  if (!marker) return;

  const selection =
    window.getSelection();
  selection.removeAllRanges();

  const range =
    document.createRange();

  // 将光标设置在标记之前
  range.setStartBefore(
    marker
  );
  range.collapse(true);

  selection.addRange(range);

  // 移除标记
  marker.remove();

  // 可选：滚动到光标位置
  marker.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest'
  });
}
function handleInput(event) {
  let html = '';

  if (
    !editor.value.innerHTML.includes(
      '<div>'
    )
  ) {
    html = `<div>${editor.value.innerHTML}</div>`;
  } else {
    html = `<div><div>${editor.value.innerHTML.replace(/<div>/, `</div><div>`)}</div>`;
  }

  html = handleTitle(html);
  const [
    saveCursor,
    restoreCursor
  ] = handleCursor(html);

  editor.value.innerHTML =
    html;

  const selection =
    window.getSelection();
  const span =
    document.getElementById(
      cursorId
    );
  const range =
    document.createRange();
  console.log(
    '找到光标',
    cursorId
  );
  console.log(span);
  if (span) {
    range.selectNode(span);
    selection.addRange(range);
  }
  console.log('html', html);

  return;

  // console.dir(event.target.innerText);
  const lines =
    event.target.innerText.split(
      '\n\n'
    );
  // console.log(editor.value.innerHTML);

  console.log(
    'HTML格式字符串:',
    JSON.stringify(
      event.target.innerHTML
    )
  );
  console.log(
    '文本内容格式字符串:',
    JSON.stringify(
      event.target.textContent
    )
  );

  let renderedHtml = '';

  for (
    let i = 0;
    i < lines.length;
    i++
  ) {
    const line = lines[i];

    // 处理空行
    if (line.trim() === '') {
      renderedHtml +=
        '<div class="empty-line"><br></div>';
      continue;
    }

    // 处理代码块开始
    if (
      line
        .trim()
        .startsWith('```')
    ) {
      const language =
        line
          .trim()
          .substring(3)
          .trim() || '';
      let codeContent = '';
      i++;
      while (
        i < lines.length &&
        !lines[i]
          .trim()
          .startsWith('```')
      ) {
        codeContent +=
          lines[i] + '\n';
        i++;
      }
      renderedHtml += `
        <div class="code-block" contenteditable="false">
          <div class="code-header">
            <span class="language">${language || 'text'}</span>
            <button class="copy-btn" onclick="copyCode(this)">复制</button>
          </div>
          <pre><code>${escapeHtml(codeContent)}</code></pre>
        </div>
      `;
      continue;
    }
    // 处理标题
    if (
      line.match(/^#{1,6}\s/)
    ) {
      const level =
        line.match(
          /^(#+)\s/
        )[1].length;
      const content =
        line.substring(
          level + 1
        );
      renderedHtml += `<h${level} class="live-heading">${content}</h${level}>`;
      continue;
    }
    // 处理列表
    if (
      line.match(/^[-*+]\s/)
    ) {
      const content =
        line.substring(2);
      renderedHtml += `<div class="list-item"><span class="bullet">•</span> ${renderInlineMarkdown(content)}</div>`;
      continue;
    }

    // 有序列表
    if (
      line.match(/^\d+\.\s/)
    ) {
      const match =
        line.match(
          /^(\d+)\.\s/
        );
      const number = match[1];
      const content =
        line.substring(
          number.length + 2
        );
      renderedHtml += `<div class="list-item"><span class="number">${number}.</span> ${renderInlineMarkdown(
        content
      )}</div>`;
      continue;
    }

    // 引用
    if (
      line.startsWith('> ')
    ) {
      const content =
        line.substring(2);
      renderedHtml += `<blockquote class="live-quote">${renderInlineMarkdown(content)}</blockquote>`;
      continue;
    }

    // 分割线
    if (
      line.match(
        /^[-*_]{3,}$/
      )
    ) {
      renderedHtml +=
        '<hr class="live-hr">';
      continue;
    }

    // 普通段落
    renderedHtml += `<div class="paragraph">${renderInlineMarkdown(line)}</div>`;
  }

  // 1. 记录光标位置
  const markerId =
    saveCursor();

  console.log(
    '记录光标位置',
    markerId,
    renderedHtml
  );

  // 2. 更新内容
  editor.value.innerHTML =
    renderedHtml;

  console.log(
    editor.value.innerText
  );

  // 3. 恢复光标位置edHtml;

  // restoreCursor(markerId)
  // moveToMarker(markerId);
  // console.log('恢复光标位置', markerId)
}

const textInput = ref('');
function handleInput1(e) {
  console.log(
    JSON.stringify(
      e.target.value
    )
  );
  textInput.value =
    e.target.value;
}

const text = ref('13123');

onMounted(() => {});
</script>

<template>
  <!-- <textarea  contenteditable="true" type="text" :value="textInput" @input="handleInput1" /> -->
  <div
    class="editor"
    ref="editor"
    contenteditable="true"
    @input="handleInput"
  ></div>
</template>

<style lang="scss" scoped>
.editor {
  width: 100%;
  height: 100%;
  outline: none;
}
</style>
