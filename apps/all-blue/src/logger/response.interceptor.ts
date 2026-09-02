import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Request } from 'express';
import { MyLogger } from './my-logger';

/**
 * 响应日志拦截器
 *
 * 拦截 HTTP 响应，记录请求 URL、方法、IP 和响应数据，
 * 用于追踪接口返回内容，便于问题排查。
 *
 * 在 AppModule 中通过 APP_INTERCEPTOR 全局注册。
 */
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  @Inject(MyLogger)
  private logger: MyLogger;

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req: Request = context.switchToHttp().getRequest();
    return next.handle().pipe(
      map(data => {
        const logFormat = `
        ################################################
        Request original url: ${req.originalUrl}
        Method: ${req.method}
        IP: ${req.ip}
        Response Data: ${JSON.stringify(data)}
        ################################################
        `;
        this.logger.log(logFormat, 'Response LoggerInterceptor');
        return data;
      })
    );
  }
}
