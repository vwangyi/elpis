import { Injectable, LoggerService, OnModuleInit } from '@nestjs/common';
import 'winston-daily-rotate-file';
import chalk from 'chalk';
import dayjs from 'dayjs';
import {
  Logger as WinstonLogger,
  createLogger,
  format,
  transports
} from 'winston';

/**
 * 自定义日志器 —— 集成 Winston 实现日志文件持久化
 *
 * 实现 NestJS 的 LoggerService 接口，可通过 app.useLogger() 替换内置日志器，
 * 也可通过 @Inject(MyLogger) 注入到任意 provider 中使用。
 *
 * 功能：
 * - 控制台彩色格式化输出
 * - 按日期滚动持久化到 info / error 两个日志文件
 * - 自动压缩归档、定期清理
 */
@Injectable()
export class MyLogger implements LoggerService, OnModuleInit {
  private logger: WinstonLogger;

  onModuleInit() {
    this.logger = createLogger({
      level: 'debug',
      transports: [
        // 控制台输出 —— 彩色格式化
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.printf(({ context, level, message, timestamp }) => {
              const appStr = chalk.blue('[Nest]');
              const contextStr = chalk.yellow(`[${context}]`);
              return `${appStr} ${timestamp} ${level} ${contextStr} : ${message}`;
            })
          )
        }),
        // 文件持久化 —— info 级别，按日滚动
        new transports.DailyRotateFile({
          dirname: process.cwd() + '/src/logs',
          filename: 'app-%DATE%.info.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20M',
          maxFiles: '7d',
          format: format.combine(
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            format.json()
          ),
          level: 'info'
        }),
        // 文件持久化 —— error 级别，按日滚动
        new transports.DailyRotateFile({
          dirname: process.cwd() + '/src/logs',
          filename: 'app-%DATE%.error.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20M',
          maxFiles: '14d',
          format: format.combine(
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            format.json()
          ),
          level: 'error'
        })
      ]
    });
  }

  log(message: any, context: string) {
    const timestamp = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    this.logger.log('info', message, { context, timestamp });
  }

  info(message: any, context: string) {
    const timestamp = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    this.logger.info(message, { context, timestamp });
  }

  warn(message: any, context: string) {
    const timestamp = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    this.logger.warn(message, { context, timestamp });
  }

  error(message: any, context: string) {
    const timestamp = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    this.logger.error(message, { context, timestamp });
  }

  debug(message: any, context: string) {
    const timestamp = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    this.logger.debug(message, { context, timestamp });
  }
}
