import { Get, Post, Patch, Delete, ValidationPipe } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { Body, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Headers, Inject, Ip, Query, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@Controller('user')
export class UserController {
  
  constructor(private readonly userService: UserService) {}

  // 注册
  @Post('register')
  // 这里用了 ValidationPipe管道 来校验
  register(@Body(ValidationPipe) user: RegisterUserDto) {
    return this.userService.register(user)
  }

  // 登录
  @Post()
  login(
    @Body(ValidationPipe) user: LoginUserDto, // 这里用了 管道 来校验
  ) {
    return this.userService.login(user);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
      console.log('controller-----', createUserDto)
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
  findAll(@Query('username') username: string, @Query('age') age: number ) {
    return this.userService.findAll(username, age);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log('id====', typeof id, id);
    return this.userService.findOne(+id);
  }

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
