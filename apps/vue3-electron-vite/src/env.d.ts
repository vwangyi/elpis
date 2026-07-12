/// <reference types="vite/client" />

// 让ts认识css文件
declare module '*.css' {
  const content: string;
  export default content;
}

// 让ts认识vue文件
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const component: DefineComponent<object, object, any>;
  export default component;
}
