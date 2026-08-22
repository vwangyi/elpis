

#
官网： https://developer.mozilla.org/zh-CN/docs/Web/API/Web_components



## web componets

## 京东的 micro-app



## single-spa的qiankun 



## customElement 自定义元素 
- https://developer.mozilla.org/zh-CN/docs/Web/API/Web_components/Using_custom_elements

- 什么是自定义元素 有什么用
```html

```


## shadowDOM 影子DOM
- https://developer.mozilla.org/zh-CN/docs/Web/API/Web_components/Using_shadow_DOM
- 可以实现样式隔离
```html

```

## 模版和插槽 template和slot 



```html
<!DOCTYPE html>
<html lang="en"> 
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Document</title>
</head>

<body>
<template id="my-button-template">
    <slot name="title">
        <div>插槽默认值</div>
    </slot>
    <input type="text" />
    <button>新增</button>
</template>

<button is="my-button">按钮</button>

<custom-button name="app-button" url="https://www.baidu.com" value="99">
    <div slot="title">
        <h2>新增按钮（我是传递的插槽）</h2>
    </div>
</custom-button>
<script>
    class MyButton extends HTMLButtonElement {
        constructor() {
            super();
            const is = this.getAttribute('is'); // my-button 
            this.addEventListener('click', () => {
                alert('按钮被点击了！');
            });
        }

    }
    window.customElements.define('my-button', MyButton, { extends: 'button' });

    class CustomButton extends HTMLElement {
        constructor() {
            super();
            // this.innerHTML = `<button>hello custom button</button>`;

            // 获取传递的属性props
            const name = this.getAttribute('name');
            const url = this.getAttribute('url');
            const value = this.getAttribute('value');
            console.log('拿到传递的属性 name url value', name, url, value);

            // 创建原生dom节点
            const btn = document.createElement('button');
            btn.textContent = '自定义按钮';
            btn.addEventListener('click', () => {
                alert('自定义按钮被点击了！');
                this.setAttribute('value', parseInt(value) + 1); // 修改属性值 会触发attributeChangedCallback回调函数
                this.setAttribute('url', 'https://www.163.com'); // 修改属性值 会触发attributeChangedCallback回调函数
                this.setAttribute('value', 100)
            });

            // 创建影子DOM shadow DOM
            const shadow = this.attachShadow({ mode: 'open' });
            this.shadowRoot.innerHTML = `
                <style>
                    button {
                        color: red;
                    }
                </style>
            `;


            // 使用模板
            const template = document.getElementById('my-button-template');
            const templateContent = template.content.cloneNode(true);
            templateContent.querySelector('input[type="text"]').value = `$${value}`; // 将属性值传递给影子DOM中的input元素


            /* 三选一 解开 */
            // this.appendChild(btn); // 挂在到当前元素上
            // this.shadowRoot.appendChild(btn); // 挂在当前元素的影子DOM上
            this.shadowRoot.appendChild(templateContent); // 挂在当前元素的影子DOM上

        }
        connectedCallback() {
            console.log('当自定义元素第一次被连接到文档 DOM 时被调用。')
        }
        disconnectedCallback() {
            console.log('当自定义元素与文档 DOM 断开连接时被调用。')
        }
        adoptedCallback() {
            console.log('当自定义元素被移动到新文档时被调用。')
        }
        attributeChangedCallback(name, olcValue, newValue) {
            console.log('当自定义元素的一个属性被增加、移除或更改时被调用。')
            console.log(name, olcValue, newValue);
        }
        static get observedAttributes() {
            return ['name', 'url', 'value']; // 监听哪些属性的变化
        }
    }

    window.customElements.define('custom-button', CustomButton);
</script>
</body>

</html>
```


 