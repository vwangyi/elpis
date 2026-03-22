王者荣耀官网 pc浏览器一套  手机浏览器又是一套



## viewport 视口
视口（viewport）是用户所见得所得的网页区域，不包含地址栏工具栏 f12 等位置。

视口有三种类型：布局视口、视觉视口，理想视口。



### 布局视口
布局视口的宽度默认 980px 。css 像素  
在 pd 端浏览器可以通过 ctrl + 、ctrl -、ctrl 0 来缩放布局视口。  
在手机端浏览器无法对布局视口进行缩放。





```javascript
布局视口通过document.documentElement.clientWidth 获取 （css 像素） 著名库也是用这个
布局视口通过document.documentElement.clientHeight 获取 （css 像素）
  
<meta name="viewport" content="width=980px"/ > 

`布局视口:${document.documentElement.clientWidth} × ${document.documentElement.clientHeight}`


`布局视口(固定值不会变):${window.screen.width} × ${window.screen.height}` 
```

### 视觉视口
视觉视口是用户实际看到的区域。

在pc端浏览器 用户可以通过鼠标调整浏览器窗口大小来改变视觉视口。打开 f12 也会占用视觉视口。

在手机端浏览器 用户可以通过双指捏合屏幕 来改变视觉视口。但是一般情况下会通过meta标签禁止缩放

> 视觉视口和布局视口的关系就是，视觉视口像一个取景框一样来查看布局视口某一部分.
>

window.innerWidth 和 window.innerHeight  用户实际看到区域

或

window.visualViewport.width 和 window.visualViewport.height 可通过缩放

### 理想视口
理想视口就是 布局视口和视觉视口是一致的

不管是 pc 端浏览器 还是 手机端浏览器 都是基于理想视口进行布局的。

在 pc 端浏览器会自动处理把默认 980px 改为 当前电脑设备的宽度。

在手机端浏览器需要 添加 meta 标签 把布局视口 改为 当前手机设备的宽度。

当在手机浏览器中 需要手动设置  <meta name="viewport" content="width=device-width, initial-scale=1"> 并且移动端通常不允许缩放视口 会设置 缩放比例为1 也就是不允许缩放

```javascript
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"/ >

// width=device-width width设置为 设备宽度 
// device-width 单位是 css 像素，等于 document.documentElement.clientWidth === 100vw 

// 写多句都是 同一个意思，浏览器支持的属性不一致，兼容罢了
// initial-scale=1 表示缩放比例为1 也就是不缩放
// user-scalable=no 表示 禁止用户缩放屏幕
// maximum-scale=1,minimum-scale=1 // 最大缩放和最小缩放都是1 也是禁止缩放的意思
```



注意 我们让布局视口和视觉视口一致的方案 是通过修改布局视口为设备宽度, 来间接实现 布局视口和视觉视口一致，

布局视口宽度 === 视觉视口宽度 ===  (屏幕分辨率宽度 / window.devicePixelRatio)

document.documentElement.clientWidth 等于 window.innerWidth 等于  (window.screen.width * window.devicePixelRatio / window.devicePixelRatio)

### 屏幕分辨率（物理像素）
屏幕分辨率也叫 物理像素 设备像素 设备分辨率

每个设备唯一且固定，出厂时就确定了。

```javascript
`${window.screen.width * window.devicePixelRatio} × ${window.screen.height * window.devicePixelRatio}`
```

通过  window.screen.width 和  window.screen.height  （物理像素 px 不是逻辑像素) 

```plain
`屏幕分辨率: ${window.screen.width} × ${window.screen.height}`  // 物理像素 固定值 

`${document.documentElement.clientWidth} × ${document.documentElement.clientHeight}`
// 查看你的设备
console.log({
    '屏幕分辨率': `${window.screen.width} × ${window.screen.height}`, // 物理像素
    '设备像素比': window.devicePixelRatio,
    '布局视口': `${window.screen.width} × ${window.screen.height}`,
    '布局视口': `${document.documentElement.clientWidth} × ${document.documentElement.clientHeight}`,
    '视觉视口': `${window.innerWidth} × ${window.innerHeight}`, // CSS像素
});
document.documentElement.clientWidth


  `布局视口:${window.screen.width} × ${window.screen.height}` + '  ' +
   `布局视口:${document.documentElement.clientWidth} × ${document.documentElement.clientHeight}`
```

### 逻辑分辨率（CSS 像素 px单位）
css 像素就是 开发者在 css 中书写的 px，比如 width: 10px; 

### 设备像素比 DPR
设备像素比是 屏幕分辨率和 css 像素的比例，通过window.devicePixelRatio 获取

若window.devicePixelRatio 为 2，则表示 css 中宽高是 1px * 1px 那么物理像素 2px * 2px = 4 个物理像素点去渲染。

若window.devicePixelRatio 为 3，则表示 css 中宽高是 1px * 1px 那么物理像素 3px * 3px = 9 个物理像素点去渲染。







也就是开发者不需要关心 用户设备的 屏幕分辨率（物理像素）是多少

因为开发者 使用的是 逻辑分辨率 （css 像素）,而屏幕分辨率越大 只能说明 会用更多的物理像素去渲染 css 像素，会更清晰而已。

并不影响布局。

### vw/vh 单位
vw/vh 是基于布局视口的尺寸计算 ，布局视口通过document.documentElement.clientWidth 获取

100vw === document.documentElement.clientWidth // true 

100vh === document.documentElement.clientHeight // true 



布局视口 = `${document.documentElement.clientWidth}*${document.documentElement.clientHeight}`

视觉视口 = window.innerWidth/innerHeight

document.documentElement.clientWidth === window.innerWidth // true

document.documentElement.clientHeight === window.innerHeight // true







单位	含义	兼容性

svw / svh	最小视口尺寸（工具栏可见时）	较好

lvw / lvh	最大视口尺寸（工具栏隐藏时）	较好

dvw / dvh	动态视口尺寸（随工具栏变化）	现代浏览器

vw / vh	传统单位（布局视口）	全兼容



/* 方法2：使用overflow: overlay（谨慎使用） */

body {

    overflow: overlay; /* 滚动条悬浮，不占用空间 */

}



### rem 单位
### %单位
100% 常用于 组件封装 由调用者决定宽高。或使用包含块的宽高作为自己的宽高。



### 媒体查询


## 视口和屏幕分辨率区别
屏幕分辨率是 物理像素点的数量

视口是 css 逻辑像素单位

“视口”与“屏幕分辨率”的区别：屏幕分辨率是物理像素数量，而视口大小通常以 CSS 像素为单位，两者通过“设备像素比（DPR）”关联





## 


我

PC端项目



在PC端中 我的显示器 分辨率是 1728 * 1117 这就意味着 我的最大宽度就是1728px  盒子宽度超过就会出现滚动条 高度同理



1920 * 1080  和   问一下 小屏幕分辨率是多少123



等比缩放。 随着屏幕不断变小  会直到看不清楚 这样就不能再等比缩小了 因为都看不见了  

应该调整布局。重新出图 



兼容适配 永远不是 "相同布局" 而是 "合理布局"  不同的宽度就可能有不同的合理布局 



移动端项目



大屏项目



方案 1 ：vw方案  应用场景 pc端 移动端 兼容  postcss-px-to-viewport-8-plugin  （把px转vw）

方案2 ： rem方案  应用场景 pc端 移动端 兼容    postcss-pxtorem （把px转rem）

方案3 ：flex方案   应用场景 pc端 移动端。 flex: 1的剩余宽度 其实就是在做兼容适配了  不考虑兼容 完全可以不用 flex的剩余宽度 

方案4:  scale方案  应用场景 可视化大屏项目



设计图 总宽度为 375px  一个盒子为 100px  font-size为16px   大部分移动端页面 都是375px或750px （为什么是 375px  为什么是750  因为750是375的2倍）、

+ css媒体查询 设置html根元素的font-size 

```javascript
// 320px的屏幕下 设置 根元素的font-size为20px
@media screen and (min-width: 320px) {
   html {
     font-size: 20px;
   }
}
// 375px的屏幕下 设置 根元素的font-size为24px
@media screen and (min-width: 375px) {
   html {
     font-size: 24px;
   }
}
// 414px的屏幕下 设置 根元素的font-size为28px
@media screen and (min-width: 414px) {
   html {
     font-size: 28px;
   }
}
缺点： 
  1 需要针对不同的屏幕 编写大量的媒体查询
  2 如果动态修改宽度 不会实时响应 
```

+ js动态设置 html根元素的font-size

```javascript
// 拿到根元素 html
const。htmlElement = document.documentElement; 

function updateHtmlFontSize() {
    // 屏幕的宽度
    const htmlWidth = htmlElement.clientWidth;
    // 计算出 根元素的fontSize 
    const htmlFontSize = htmlWidth / 10;
    // 动态设置根元素的font-size
    htmlElement.style.fontSize = htmlFontSize + 'px'
}
window.addEventListener('resize', updateHtmlFontSize);
updateHtmlFontSize(); // 初始化执行
```

+ lib-flexible库

```javascript
这是淘宝编写的库 和js方式原理是一样的


webpack插件 自动把px转rem  -- postcss-pxtorem 




根元素 html的font-size 设置 vw单位 
html {
    font-size: 10vw;
}


vw有一个缺点 
在PC端 访问移动端时 可以放大

口 优势一:不需要去计算html的font-size大小
也不需要给html设置这样一个font-size;
口 优势二:不会困为设置html的font-size大小，而必须给body再设置一个font-size，防止继承;口 优势三:因为不依赖font-size的尺寸，所以不用担心某些原因html的font-size尺ぎ被篡改，页面尺寸混乱;口 优势四:ww相比于rem更加语义化，1vw刚才是1/100的viewport的大小;
口 优势五:可以具备rem之前所有的优点;


  等比缩放
```

+ PC端项目 能不能兼容 移动端 

```javascript
PC端项目 能不能兼容 移动端 ？
答： 用flex兼容 , 最好是不要兼容 而是单独写一个移动端项目
没钱的小公司 只能用flex布局兼容一下 像 京东等大厂都是 单独写一套移动端

比如 当你用手机浏览器访问 jd.com 会自动跳转 移动端项目m.jd.com 或 跳转打开京东APP 
没钱没时间 只能用 flex 兼容一下 但 移动端的效果 肯定是不好的 只能说勉强能用
```

+ vw方案

```javascript
使用 postcss-px-to-viewport-8-plugin 在 Webpack 中配置
postcss-px-to-viewport-8-plugin 是一个 PostCSS 插件，用于将 px 单位转换为视口单位（vw、vh 等），帮助你实现移动端适配。以下是在 Webpack 项目中配置该插件的完整步骤：

1. 安装依赖
首先，安装必要的依赖包：

bash
复制
npm install postcss-px-to-viewport-8-plugin postcss-loader --save-dev
或者使用 yarn：

bash
复制
yarn add postcss-px-to-viewport-8-plugin postcss-loader -D
2. 配置 Webpack
在你的 Webpack 配置文件中（通常是 webpack.config.js），添加 PostCSS 配置：

javascript
复制
module.exports = {
  // ...其他配置
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  require('postcss-px-to-viewport-8-plugin')({
                    viewportWidth: 375, // 设计稿宽度，一般是375（iPhone 6/7/8）
                    unitToConvert: 'px', // 要转换的单位
                    viewportUnit: 'vw', // 转换后的单位
                    fontViewportUnit: 'vw', // 字体使用的视口单位
                    selectorBlackList: [], // 不转换的选择器
                    minPixelValue: 1, // 最小转换值
                    mediaQuery: false, // 是否转换媒体查询中的px
                    exclude: [/node_modules/], // 排除的文件
                    include: undefined, // 包含的文件
                    landscape: false, // 是否处理横屏情况
                    landscapeUnit: 'vw', // 横屏时使用的单位
                    landscapeWidth: 812 // 横屏时使用的视口宽度
                  })
                ]
              }
            }
          }
        ]
      },
      // 对于less/sass/scss等预处理器，配置类似
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  require('postcss-px-to-viewport-8-plugin')({
                    // 同上配置
                  })
                ]
              }
            }
          },
          'less-loader'
        ]
      }
    ]
  }
}
3. 创建单独的 PostCSS 配置文件（可选）
你也可以创建一个单独的 PostCSS 配置文件 postcss.config.js：

javascript
复制
module.exports = {
  plugins: {
    'postcss-px-to-viewport-8-plugin': {
      viewportWidth: 375,
      unitToConvert: 'px',
      viewportUnit: 'vw',
      fontViewportUnit: 'vw',
      selectorBlackList: [],
      minPixelValue: 1,
      mediaQuery: false,
      exclude: [/node_modules/],
      landscape: false
    }
  }
}
然后在 Webpack 配置中简化 postcss-loader 的配置：

javascript
复制
{
  loader: 'postcss-loader'
}
4. 配置参数说明
参数	类型	默认值	描述
viewportWidth	number	375	设计稿的视口宽度
unitToConvert	string	'px'	要转换的单位
viewportUnit	string	'vw'	转换后的单位
fontViewportUnit	string	'vw'	字体使用的视口单位
selectorBlackList	array	[]	不进行转换的选择器，支持正则
minPixelValue	number	1	设置最小的转换数值
mediaQuery	boolean	false	是否转换媒体查询中的px
exclude	array/regexp	undefined	排除的文件
include	array/regexp	undefined	包含的文件
landscape	boolean	false	是否处理横屏情况
landscapeUnit	string	'vw'	横屏时使用的单位
landscapeWidth	number	812	横屏时使用的视口宽度
5. 使用示例
在你的 CSS 文件中：

css
复制
/* 输入 */
.box {
  width: 100px;
  height: 200px;
  font-size: 16px;
  margin: 10px auto;
}

/* 输出（基于375px设计稿） */
.box {
  width: 26.66667vw;
  height: 53.33333vw;
  font-size: 4.26667vw;
  margin: 2.66667vw auto;
}
注意事项
确保你的项目中已经安装了 postcss-loader，并且版本兼容

如果使用 CSS 模块，请确保配置正确

可以通过 exclude 选项排除不需要转换的文件或目录（如 node_modules）

对于 React 项目，通常配置在 webpack.config.js 或 craco.config.js（如果使用 CRACO）中

希望这个配置指南对你有所帮助！

开启新对话

```







## <font style="color:rgb(249, 250, 251);background-color:rgb(44, 44, 46);"></font>


