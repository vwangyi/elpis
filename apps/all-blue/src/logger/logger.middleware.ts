import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { MyLogger } from './my-logger';

/**
 * 请求日志中间件
 *
 * 在路由处理程序之前/之后执行，收集请求参数、请求体、请求方法、IP 地址等信息，
 * 根据响应状态码分级记录日志。
 *
 * 在 AppModule 中通过 consumer.apply(LoggerMiddleware).forRoutes('*') 全局注册。
 */
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  @Inject(MyLogger)
  private logger: MyLogger;

  use(req: Request, res: Response, next: NextFunction) {
    const statusCode = res.statusCode;
    const logFormat = `
    ################################################
    Request original url: ${req.originalUrl}
    Method: ${req.method}
    IP: ${req.ip}
    Status code: ${statusCode}
    Params: ${JSON.stringify(req.params)}
    Query: ${JSON.stringify(req.query)}
    Body: ${JSON.stringify(req.body)}
    ################################################
    `;
    next();

    if (statusCode >= 500) {
      this.logger.error(logFormat, 'Request LoggerMiddleware');
    } else if (statusCode >= 400) {
      this.logger.warn(logFormat, 'Request LoggerMiddleware');
    } else {
      this.logger.log(logFormat, 'Request LoggerMiddleware');
    }
  }
}
