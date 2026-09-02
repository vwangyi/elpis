import {
  Get,
  Post,
  Patch,
  Delete,
  ValidationPipe,
  UseGuards
} from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { Body, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Headers, Inject, Ip, Query, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginGuard } from './login.guard';
import { AuthService } from '../auth/auth.service';

@Controller('user')
export class UserController {
  // 当前controller 需要调用 其他service
  @Inject()
  private jwtService: JwtService;

  // 当前controller 需要调用 其他service
  @Inject()
  private authService: AuthService;

  // 当前controller 需要调用 自己的service
  constructor(private readonly userService: UserService) {}

  // 登录
  @Post('login')
  async login(
    @Body(ValidationPipe) user: LoginUserDto, // 这里用了 管道 来校验
    @Res({ passthrough: true }) res: Response
  ) {
    const result = await this.userService.login(user);

    // 登录成功后 发放token令牌
    if (result) {
      const token = await this.jwtService.signAsync({
        user: {
          id: result.id,
          username: result.username
        }
      });

      res.header('Authorization', token);

      return {
        message: '登录成功',
        data: result,
        code: 200
      };
    }
    return {
      message: '登录失败',
      code: 400,
      data: null
    };
  }

  // 注册
  @Post('register')
  // 这里用了 ValidationPipe管道 来校验
  register(@Body(ValidationPipe) user: RegisterUserDto) {
    return this.userService.register(user);
  }

  @Get('info')
  @UseGuards(LoginGuard)
  getUserInfo() {
    return '获取用户详细信息';
  }

  @Get('list')
  @UseGuards(LoginGuard)
  getUserList() {
    return '获取用户列表';
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    console.log('controller-----', createUserDto);
    return this.userService.create(createUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Get()
  findAll(@Query('username') username: string, @Query('age') age: number) {
    return this.userService.findAll(username, age);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userService.findOne(+id);
  // }

  // @Get('find')
  // query(@Query('name') name: string, @Query('age') age: number) {
  //   console.log(name, age);
  //   return 123;
  // }

  // @Post('add')
  // add(@Body() user: CreateUserDto) {
  //   console.log(user);
  //   return 123;
  // }

  // @Get('other')
  // other(
  //   @Ip() ip: string,
  //   @Headers('content-type') headers: string,
  //   @Req() req: Request,
  //   @Res() res: Response
  // ) {
  //   console.log(ip, headers, req.url);
  //   res.end('other'); // 如果接了req就只能手动返回前端了
  // }
}
