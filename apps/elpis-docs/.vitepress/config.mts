import { defineConfig } from "vitepress";
export default defineConfig({
  lang: "zh-CN",
  title: "WANGYI",
  description: "A VitePress Site",
  themeConfig: {
    /**
     * 顶部导航栏 https://vitepress.dev/reference/default-theme-config 
     */
    nav: [
      // {
      //   text: "简历",
      //   link: "/00_简历/00_简历.md",
      //   activeMatch: "^/00_简历/",
      // },
      {
        text: "JavaScript",
        link: "/02_JavaScript/01_Nodejs/index.md",
        activeMatch: "^/02_JavaScript/"
      },
      { text: "构建工具", link: "/03_构建工具/01_Webpack/00_简介.md" }, // rollup webpack vite esbuild
      {
        text: "前端框架",
        link: "/04_前端框架/00_Vue/00_Vue是什么.md",
        activeMatch: "^/04_前端框架/"
      },
      {
        text: "后端框架",
        link: "/05_后端框架/01_Koa/index.md",
        activeMatch: "^/05_后端框架/"
      },
      {
        text: "数据库",
        link: "/01_数据库/index.md",
        activeMatch: "^/01_数据库/"
      },
      {
        text: "业务场景",
        link: "/06_业务/01_可视化/01_canvas.md",
        activeMatch: "^/06_业务/"
      },
      {
        text: "常见算法",
        link: "/09_常见算法/01_数据结构与算法/index.md",
        activeMatch: "^/09_常见算法/"
      },
      {
        text: "运维部署",
        link: "/08_运维/环境/mac.md",
        activeMatch: "^/08_运维/"
      },
      {
        text: "人工智能",
        link: "/07_AI/01_AI-agent.md",
        activeMatch: "^/07_AI/"
      }

      // { text: "数据库", link: "/数据库/" }, // mysql redis mongodb

      // { text: "数据结构算法", link: "/数据结构算法/" }, // 数据结构与算法题
      // { text: "设计模式", link: "/设计模式/" }, // 常用设计模式
      // { text: "网络", link: "/网络/" }, // HTTP TCP UDP WebSocket
      // { text: "单词", link: "/单词/" }, // 前端相关单词
    ],
    // sidebar >>>
    // {
    //   "/Nodejs/": [ // 前缀为 /Nodejs/ 的路由会使用这个侧边栏配置
    //     {
    //       text: "Nodejs", // 二级目录名称
    //       collapsed: false,
    //       items: [
    //         {
    //           text: "文件1", // 显示的文本
    //           link: "/Nodejs/文件1.md", // 跳转的路由地址
    //         },
    //       ],
    //     },
    //   ],
    // };
    sidebar: {
      "/02_JavaScript/": [
        {
          text: "Nodejs",
          items: [
            {
              text: "Nodejs",
              link: "/02_JavaScript/01_Nodejs/index.md"
            }
          ]
        },
        {
          text: "TypeScript",
          items: [
            {
              text: "变量声明",
              link: "/02_JavaScript/00_TypeScript/index.md"
            }
          ]
        },
        {
          text: "变量",
          items: [
            {
              text: "变量声明",
              link: "/02_JavaScript/01_变量/01_变量声明.md"
            },
            {
              text: "数据类型",
              link: "/02_JavaScript/01_变量/02_数据类型.md"
            }
          ]
        },
        {
          text: "函数",
          items: [
            {
              text: "函数声明",
              link: "/02_JavaScript/02_函数/01_函数声明.md"
            }
          ]
        },
        {
          text: "面向对象",
          items: [
            {
              text: "原型链",
              link: "/02_JavaScript/03_面向对象/00_原型链.md"
            },
            {
              text: "类",
              link: "/02_JavaScript/03_面向对象/01_类.md"
            },
            {
              text: "封装继承多态",
              link: "/02_JavaScript/03_面向对象/03_封装继承多态.md"
            },
            {
              text: "数组",
              link: "/02_JavaScript/03_面向对象/02_数组.md"
            },
            {
              text: "字符串",
              link: "/02_JavaScript/03_面向对象/04_字符串.md"
            }
          ]
        },
        {
          text: "异步编程",
          items: [
            {
              text: "回调函数",
              link: "/02_JavaScript/04_异步编程/01_回调函数.md"
            },
            {
              text: "Promise",
              link: "/02_JavaScript/04_异步编程/02_Promise.md"
            },
            {
              text: "async/await",
              link: "/02_JavaScript/04_异步编程/03_async-await.md"
            }
          ]
        },
        {
          text: "HTML/CSS",
          items: [
            {
              text: "HTML",
              link: "/02_JavaScript/05_HTML-CSS/01_HTML.md"
            },
            {
              text: "CSS",
              link: "/02_JavaScript/05_HTML-CSS/02_CSS.md"
            },
            {
              text: "scss",
              link: "/02_JavaScript/05_HTML-CSS/03_scss.md"
            },
            {
              text: "tailwidd",
              link: "/02_JavaScript/05_HTML-CSS/04_scss.md"
            }
          ]
        }
      ],
      "/03_构建工具/": [
        {
          text: "架构",
          items: [
            {
              text: "multirepo",
              link: "/03_构建工具/00_架构/01_multirepo.md"
            },
            {
              text: "monorepo",
              link: "/03_构建工具/00_架构/02_monorepo.md"
            }
          ]
        },
        {
          text: "Webpack",
          items: [
            {
              text: "简介",
              link: "/03_构建工具/01_Webpack/00_简介.md"
            },
            {
              text: "入口出口",
              link: "/03_构建工具/01_Webpack/01_入口出口.md"
            },
            {
              text: "处理vue文件",
              link: "/03_构建工具/01_Webpack/02_处理vue文件.md"
            },
            {
              text: "处理js文件",
              link: "/03_构建工具/01_Webpack/03_处理js文件.md"
            },
            {
              text: "处理样式文件",
              link: "/03_构建工具/01_Webpack/04_处理样式文件.md"
            },
            {
              text: "处理图片资源",
              link: "/03_构建工具/01_Webpack/05_处理图片资源.md"
            },
            {
              text: "处理html资源",
              link: "/03_构建工具/01_Webpack/06_处理html资源.md"
            },
            {
              text: "devServer",
              link: "/03_构建工具/01_Webpack/07_devServer.md"
            },

            {
              text: "SourceMap",
              link: "/03_构建工具/01_Webpack/10_SourceMap.md"
            },
            {
              text: "TreeShaking",
              link: "/03_构建工具/01_Webpack/04_TreeShaking.md"
            },
            {
              text: "Loader",
              link: "/03_构建工具/01_Webpack/06_Loader加载器.md"
            },
            {
              text: "军哥webpack",
              link: "/03_构建工具/01_Webpack/军哥webpack.md"
            },
            {
              text: "Babel",
              link: "/03_构建工具/01_Webpack/05_Babel.md"
            }
          ]
        }
      ],
      "/04_前端框架/": [
        {
          text: "Vue",
          items: [
            {
              text: "简介",
              link: "/04_前端框架/00_Vue/00_Vue是什么.md"
            },
            {
              text: "依赖注入 provide/inject",
              link: "/04_前端框架/00_Vue/03_依赖注入.md"
            },
            {
              text: "异步组件",
              link: "/04_前端框架/00_Vue/06_异步组件.md"
            }
          ]
        },
        {
          text: "Nuxt",
          items: [
            {
              text: "简介",
              link: "/04_前端框架/03_Nuxt/index.md"
            },
          ]
        }
      ],
      "/06_业务/": [
        {
          text: "业务sense",
          items: [
            {
              text: "业务sense",
              link: "/06_业务/00_业务sense/index.md"
            }
          ]
        },
        {
          text: "可视化",
          items: [
            {
              text: "canvas",
              link: "/06_业务/01_可视化/01_canvas.md"
            },
            {
              text: "svg",
              link: "/06_业务/01_可视化/02_svg.md"
            },
            {
              text: "echarts",
              link: "/06_业务/01_可视化/03_echarts.md"
            }
          ]
        },
        {
          text: "音视频",
          items: [
            {
              text: "video/audio",
              link: "/06_业务/02_音视频/01_video-audio.md"
            },
            {
              text: "音视频",
              link: "/06_业务/02_音视频/01_音视频业务.md"
            },
            {
              text: "播放器",
              link: "/06_业务/02_音视频/02_视频播放器.md"
            },
            {
              text: "webRTC",
              link: "/06_业务/02_音视频/02_webRTC.md"
            }
          ]
        },

        {
          text: "表单表格",
          items: [
            {
              text: "表单",
              link: "/06_业务/03_表单表格/01_表单.md"
            },
            {
              text: "表格",
              link: "/06_业务/03_表单表格/02_表格.md"
            }
          ]
        },

        {
          text: "编辑器",
          items: [
            {
              text: "编辑器",
              link: "/06_业务/04_编辑器/00_编辑器.md"
            }
          ]
        },
        {
          text: "微前端",
          items: [
            {
              text: "qiankun",
              link: "/06_业务/07_微前端/index.md"
            }
          ]
        },
        {
          text: "低代码",
          items: [
            {
              text: "低代码",
              link: "/06_业务/08_低代码/index.md"
            }
          ]
        },
        {
          text: "服务监控",
          items: [
            {
              text: "服务监控",
              link: "/06_业务/09_服务监控/index.md"
            }
          ]
        }
      ],
      "/09_常见算法/": [
        {
          text: "数据结构与算法",
          items: [
            {
              text: "二叉树",
              link: "/09_常见算法/01_数据结构与算法/index.md"
            }
          ]
        },
        {
          text: "设计模式",
          items: [
            {
              text: "观察者模式",
              link: "/09_常见算法/02_设计模式/index.md"
            }
          ]
        }
      ],
      "/08_运维/": [
        {
          text: "环境",
          items: [
            {
              text: "mac",
              link: "/08_运维/环境/mac.md"
            },
            {
              text: "windows",
              link: "/08_运维/环境/windows.md"
            },
          ]
        },
        {
          text: "nvm命令",
          link: "/08_运维/nvm/nvm命令.md"
        },
        {
          text: "nginx",
          link: "/08_运维/nginx/nginx.md"
        },
        {
          text: "版本控制",
          items: [
            {
              text: "git",
              link: "/08_运维/版本控制/git.md"
            },
            {
              text: "svn",
              link: "/08_运维/版本控制/svn.md"
            }
          ]
        },
        {
          text: "adb",
          link: "/08_运维/adb/adb.md"
        },
        {
          text: "linux",
          link: "/08_运维/linux/linux.md"
        },
        {
          text: "部署",
          link: "/08_运维/部署.md"
        },
      ]
    },
    socialLinks: [{ icon: "github", link: "https://github.com/vwangyi" }]
  }
});
