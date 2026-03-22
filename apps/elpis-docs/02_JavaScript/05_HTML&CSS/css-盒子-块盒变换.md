# 块盒transform

> 大小形状位置等的改变

```css
.box {
  width: 100px;
  height: 100px;
  background-color: red;
  /* 旋转 */
  transform: rotate(45deg);
  /* 缩放 */
  transform: scale(1.5);
  /* 倾斜(用得少) */
  transform: skew(30deg);
  /* 平移(用得多) */
  transform: translate(50%, 50%);
  
  /* 合并 */
  transform: rotate(45deg) translateX(300px);
}
```