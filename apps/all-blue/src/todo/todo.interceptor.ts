import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * 统一响应格式拦截器
 * 将 Controller 返回的原始数据包装为 { success, data, message } 结构，
 * 与前端 request.ts 的 ApiResponse 契约对齐。
 */
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
    return next.handle().pipe(
      map(data => ({
        success: true,
        data: data ?? null,
        message: '操作成功'
      }))
    );
  }
}
