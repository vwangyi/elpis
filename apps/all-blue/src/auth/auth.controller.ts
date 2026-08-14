import { Controller, Get, Post, Body, Patch, Param, Delete, Session, Req, Inject, Res, Headers, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import type { Request, Response } from 'express';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  @Inject()
  private jwtService: JwtService;

  constructor(private readonly authService: AuthService) {}


  @Get('jwt1')
  getJwt1(@Res({ passthrough: true }) res: Response): string {
    const token = this.jwtService.sign({ count: 1 });
    res.setHeader('Authorization', `Bearer ${token}`);
    return 'hello jwt1';
  }


  @Get('jwt2')
  getJwt2(
    @Headers('authorization') authorization: string,
    @Res({ passthrough: true }) res: Response
  ): string {
    if (authorization) {
   try{
       const token = authorization?.split(' ')?.[1] || '' ;
      const payload = this.jwtService.verify(token);
      const newToken = this.jwtService.sign({count: payload.count + 1});
    res.setHeader('Authorization', `Bearer ${newToken}`);
   } catch(e) {
    console.log('catch error', e );
    throw new UnauthorizedException()
   }
  
 
    } else {

    throw new UnauthorizedException()
   }
    return 'hello jwt2';
  }





  @Get('session1')
  getSession(
    @Session() session: Record<string, any> // 直接通过@Session()装饰器 获得
  ): number {
    console.log('session', session, typeof session.views);
    session.views = session.views ? session.views + 1 : 1;
    return session.views;
  }

  @Get('session2')
  getSession2(
    @Req() req: Request // 也可以通过 @Req装饰器 获得
  ): number {
    const session = req.session;
    console.log('session2', session);
    session.views = session.views ? session.views + 1 : 1;
    return session.views;
  }

 
}
