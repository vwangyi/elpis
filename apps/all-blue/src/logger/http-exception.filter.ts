import { ArgumentsHost, Catch, ExceptionFilter, Inject } from '@nestjs/common';
import { Request, Response } from 'express';
import { MyLogger } from './my-logger';

/**
 * 全局异常过滤器
 *
 * 捕获所有未处理的异常，记录请求 URL、方法、IP、状态码和异常信息到日志，
 * 并返回统一格式的错误响应。
 *
 * 在 AppModule 中通过 APP_FILTER 全局注册。
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  @Inject(MyLogger)
  private logger: MyLogger;

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const logFormat = `
    ################################################
    Request original url: ${request.originalUrl}
    Method: ${request.method}
    IP: ${request.ip}
    Status code: ${status}
    Response: ${exception.toString() + `(${exceptionResponse?.message || exceptionResponse})`}
    ################################################
    `;
    this.logger.error(logFormat, 'HttpExceptionFilter');

    response.status(status).json({
      code: status,
      timestamp: new Date().toLocaleString(),
      error: exceptionResponse?.message || exceptionResponse,
      msg: `${status >= 500 ? 'Server Error' : 'Client Error'}`
    });
  }
}
