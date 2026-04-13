import * as log4js from 'log4js';
/**
 * 日志记录中间件
 * 外部调用 app.logger.info()  app.logger.error() 就可以记录到硬盘
 */

export function logger(app) {
  app.logger = 'logger@';

  // 项目初始化执行
  return async function (ctx, next) {
    // 当用户访问才执行

    // 这里的 ctx.app === app 是全等的 true

    console.log(ctx.app.logger);
    console.log('logger context', app === ctx.app, ctx.app);

    console.log(JSON.stringify(ctx.app.logger));

    const start = Date.now();

    // 记录请求信息
    console.log(`→ ${ctx.method} ${ctx.url}`);

    await next();
    // 记录响应信息
    const ms = Date.now() - start;
    console.log(`← ${ctx.method} ${ctx.url} - ${ctx.status} - ${ms}ms`);
  };

  // let logger;

  // if (app.env.isDev()) {
  //   // 打印到 控制台 即可
  //   logger = console;
  // } else {
  //   // 把日志输出到硬盘上 (日志落盘)
  //   log4js.configure({
  //     appenders: {
  //       console: {
  //         type: 'console'
  //       },
  //       // 日志 文件切割
  //       dateFile: {
  //         type: 'dateFile',
  //         filename: './logs/application.log',
  //         pattern: '.yyyy-MM-dd' // 以年月日切割日志
  //       }
  //     },
  //     categories: {
  //       default: {
  //         appenders: ['console', 'dateFile'],
  //         level: 'trace'
  //       }
  //     }
  //   });
  //   logger = log4js.getLogger();
  // }
  // app.logger = logger;
  // console.info(`-- [init] load logger done --`);
}
