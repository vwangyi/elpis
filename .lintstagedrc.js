export default {
  "*.{js,ts,mjs,cjs,json,tsx,css,less,scss,vue,html,md}": [
    "cspell lint --no-progress --no-must-find-files" // 没有文件时不报错
  ],
  "*.{js,ts,vue,md}": ["prettier --write", "eslint"]
};
