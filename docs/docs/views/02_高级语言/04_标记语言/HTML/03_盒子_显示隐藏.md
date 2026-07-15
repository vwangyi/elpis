# 盒子显示隐藏

“display: none 会完全从渲染树中移除元素，不占据空间且子元素也无法显示。适合需要彻底隐藏的场景，但频繁切换会触发回流（Reflow），性能较差。” 建议使用v-if
代码：.hidden { display: none; }

visibility: hidden 会隐藏元素内容但保留其占据的空间，仅触发重绘（Repaint）。适用于需要保持布局稳定的场景，如表格行隐藏。”
代码：.invisible { visibility: hidden; }

“opacity: 0 使元素完全透明但保留交互能力（如点击事件）。常配合 transition 实现淡入淡出效果，性能优化时可用 will-change: opacity。”
代码：.transparent { opacity: 0; transition: opacity 0.3s; }

定位移出视口:“通过绝对定位将元素移到视窗外（如 left: -9999px），但会触发回流。这是旧浏览器的兼容方案，现代开发中不推荐。”代码：.off-screen {
position: absolute;
left: -9999px;
}

“clip-path: inset(100%) 裁剪元素至不可见，不触发重排 且保留DOM状态。适合需要高性能隐藏的场景（如SPA路由切换）。”
代码：.clipped { clip-path: inset(100%); }、

- 如何显示隐藏元素
  - 方案1
    - display：none
      -
      - 缺点：触发重排
      - v-show style="will-change: display
  - 方案2
    - visibility：hidden
      - 好处：保留原位置但不能点击
      - 坏处：仅仅触发重绘
  - 方案3
    - opacity：0
      - 好处：保留原位置还可以点击
      - 坏处：仅仅触发重绘
      - 使用场景：需要淡入淡出的动画
  - 方案4
    - 定位移出视口
      - 好处：兼容性好
      - 坏处：触发重排
  - 方案5
    - clip-path: inset(100%)
      - 好处：性能好 没有重排重绘
      - 好处：保留原位置但不能点击
      - 应用场景：SPA的路由切换

## 方案一：display: none;

## visibility: hidden;

## overflow: hidden;

```css
.box {
  overflow: visible; /* 默认值 */
  overflow: hidden; /* 溢出隐藏 */
  overflow: scroll; /* 始终显示滚动条 */
  overflow: auto; /* 溢出才显示滚动条 */
}
```

## clip-path: inset(100%);

## opacity: 0;

## width: 0;height: 0;

##

```css
.box {
  display: none; /* 元素整体移除 不占位置 */
  visibility: hidden; /*  DOM结构还在 只是看不见 不可以点击
    opacity: 0;   /* DOM结构还在 只是看不见 可以点击 */
  overflow: hidden; /* 定位溢出 + overflow: hidden */
  clip-path: inset(100%); /*  */

  /* width height 都设置为 0 */
  width: 500px;
  height: 500px;
  background-color: red;
}
```
