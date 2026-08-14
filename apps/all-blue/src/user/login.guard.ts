import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class LoginGuard implements CanActivate {
  @Inject(JwtService)
  private jwtService: JwtService;

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    // 获取头信息
    const authorization = request.header('Authorization') || '';

    const bearer = authorization.split(' ');

    if (!bearer || bearer.length < 2) {
      throw new UnauthorizedException('登录失效，请重新登录');
    }

    const token = bearer?.[1] || '';

    try {
      const info = this.jwtService.verify(token);
      (request as any).user = info.user;
      return true;
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException('登录失效，请重新登录');
    }
  }
}
