import type { ExecutionContext } from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'

import { IS_PUBLIC_ROUTE } from './public.decorator'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super()
  }

  override canActivate(context: ExecutionContext) {
    // 同时读取方法和 Controller 元数据，方法级配置可以覆盖类级配置。
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_ROUTE, [
      context.getHandler(),
      context.getClass(),
    ])
    return isPublic ? true : super.canActivate(context)
  }
}
