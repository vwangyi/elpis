## 鼠标变小手 5

```css
.box {
  cursor: pointer; /* 鼠标变小手 */
  object-fit: cover; /* 常用img元素 */
  user-select: none; 禁止用户选中文字
  pointer-events: none; 禁止鼠标事件

  // object-fit 一般用于 img 或 video 标签
  object-fit: fill; // 会拉伸元素来填满容器 （默认值）
  object-fit: contain; // 会保持比例缩放，直到元素适合容器的最大边。
                       // 适用于需要确保图像在容器内完全可见的场景（如缩略图、相册图片等）。

  object-fit: cover; // 会按比例缩放，并确保元素完全覆盖容器，可能裁剪内容。
                     //  常用于让背景图像完全覆盖容器（如头像或封面图）。

  object-fit: none; // 会保持元素的原始尺寸，可能导致溢出或空白。
  object-fit: scale-down; // 会缩小元素，但不会放大，最多缩小到原始尺寸
}
```
