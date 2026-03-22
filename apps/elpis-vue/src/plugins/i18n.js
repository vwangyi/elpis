import english from "./dictionaries/english.js";
import chinese from "./dictionaries/chinese.js";

const options = { english, chinese };

/**
 *
 * @param key
 * @returns
 * 使用的方式： <h1>{{ $t('${词典}.hello') }}</h1>
 *
 * 使用方式可改为  {{ $t('你好')}}  用中文转其他语言
 */
function translate(key) {
  // key >>> `词典.hello`
  const list = key.split("."); // ['词典', 'hello']
  const result = list.reduce((o, i) => {
    if (o) return o[i];
  }, options);
  return result;
}

export default {
  install: app => {
    // app.config.globalProperties 挂一个 全局可用的 $t() 方法. 原理就是 原型链
    app.config.globalProperties.$t = translate;
  }
};
