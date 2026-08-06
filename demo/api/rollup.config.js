import { defineConfig } from 'rollup';
import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

function output(file, format, name) {
  return { file, format, name };
}

export default defineConfig([
  {
    input: 'src/main.js',
    output: [
      output('dist/index.cjs', 'cjs'),
      output('dist/index.js', 'es'),
      output('dist/index.browser.js', 'iife', '$') // name就是 lodash的_ jquery的$
    ],
    plugins: [resolve(), terser()]
  }
]);
