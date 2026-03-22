const log4js = require("log4js");
/**
 * 日志工具
 * 外部调用 app.logger.info()  app.logger.error() 就可以记录到硬盘
 * @param {*} app
 * @returns
 */
module.exports = app => {
  let logger;

  if (app.env.isDev()) {
    // 打印到 控制台 即可
    logger = console;
  } else {
    // 把日志输出到硬盘上 (日志落盘)
    log4js.configure({
      appenders: {
        console: {
          type: "console"
        },
        // 日志 文件切割
        dateFile: {
          type: "dateFile",
          filename: "./logs/application.log",
          pattern: ".yyyy-MM-dd" // 以年月日切割日志
        }
      },
      categories: {
        default: {
          appenders: ["console", "dateFile"],
          level: "trace"
        }
      }
    });
    logger = log4js.getLogger();
  }
  app.logger = logger;
  console.info(`-- [init] load logger done --`);
};
