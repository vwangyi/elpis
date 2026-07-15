# grid布局



```css
grid 是二维布局, 可以同时处理行和列 两个维度上的布局。
.parent {
        display: grid; 
        
        /* 3 设置子盒子的位置 */
        grid-template-areas: 
          "header header header" 
          "sidebar main main" 
          "footer footer footer";  
        header {
            grid-area: header;
        }
        sidebar {
            grid-area: sidebar;
        }
        main {
            grid-area: main;
        }
        footer {
            grid-area: footer;
        }
 
 
         
     
        /* 如果x轴 y轴都占 3 份 一共9个子盒子 items  第10个之后都算多出来的items项 */
        grid-auto-rows: 50px;   /* 设置多出来的items项的高度 */
        grid-auto-columns: 50px;   /* 设置多出来的items项的宽度 */ 

        /*   */
        /* 主轴 x轴 */
        justify-content: center;
        justify-content: end;
        justify-content: space-between;  /* 两端对齐(镜像) */
        justify-content: flex-end;
        justify-content: baseline;
        justify-content: stretch; 
        /* 侧轴 y轴 */
        align-content: center;
        align-content: end;
        align-content: space-between;  /* 两端对齐(镜像) */
        align-content: flex-end;
        align-content: baseline;
        align-content: stretch;  
    }

    .parent .son { 

      /* 和 父盒子的 justify-items align-items 用法一致 只是主体不同 子盒子使用只针对自己 */
      justify-self: center;
      justify-self: end;
      justify-self: space-between;  /* 两端对齐(镜像) */
      justify-self: flex-end;
      justify-self: baseline;
      justify-self: stretch;

      align-self: center;
      align-self: end;
      align-self: space-between;  /* 两端对齐(镜像) */
      align-self: flex-end;
      align-self: baseline;
      align-self: stretch;
      
      place-self: center center; /* 简写 */ 
    }
```

