/* 这是一个页面请求 */

module.exports = app =>
  class ViewController {
    /* 渲染页面 */
    async renderView(ctx) {
      // 打印页面请求的query和params
      const {
        query,
        params
      } = ctx.request;
      // app.logger.info(`[ViewController] ctx: ${JSON.stringify(ctx)}`);
      // app.logger.info(`[ViewController] query: ${JSON.stringify(query)}`);
      // app.logger.info(`[ViewController] params: ${JSON.stringify(params)}`);

      /**
       * 第二个参数的配置项 里面的变量 可以直接在 模版中 使用 类似 vue的template
       *
       * <div>{{ name }}</div>
       */
      // 把 public/dist/xxx.xxx.html渲染到 ctx.body中
      await ctx.render(
        // `dist/entry.${ctx.params.page}`,
        `dist/${app.env.get()}/index`,
        {
          projKey:
            ctx.query
              ?.proj_key,
          name: app.options
            ?.name,
          env: app.env.get(),
          options:
            JSON.stringify(
              app.options
            )
        }
      );
    }
  };
