import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import type { Request } from 'express'

import { AuthService } from './auth.service'
import type { AuthenticatedUser } from './auth.types'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { JwtAuthGuard } from './jwt-auth.guard'

interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser
}

@ApiTags('认证')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '账号密码登录并签发 JWT' })
  login(@Body() input: LoginDto) {
    return this.authService.login(input)
  }

  @Post('register')
  @ApiOperation({ summary: '注册组织成员账号并签发 JWT' })
  register(@Body() input: RegisterDto) {
    return this.authService.register(input)
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '验证 JWT 并返回当前用户载荷' })
  profile(@Req() request: AuthenticatedRequest) {
    return request.user
  }
}
