import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
// 自己写的 AuthGuard类 需要实现 CanActivate 这个接口
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic: boolean = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true; // 公开路由直接放行
    }

    // 如果不是公开路由，这里应该进行实际的JWT验证等
    // 暂时先返回true让请求通过，后续再实现完整的认证逻辑
    return true;

    // 或者如果您还没有实现完整的认证，可以暂时注释掉这个守卫
  }
}
