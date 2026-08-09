import { Get, Post, Patch, Delete } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { Body, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Headers, Inject, Ip, Query, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    console.log('id====', typeof id, id);
    return this.userService.findOne(+id);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Get('find')
  query(@Query('name') name: string, @Query('age') age: number) {
    console.log(name, age);
    return 123;
  }

  @Post('add')
  add(@Body() user: CreateUserDto) {
    console.log(user);
    return 123;
  }

  @Get('other')
  other(
    @Ip() ip: string,
    @Headers('content-type') headers: string,
    @Req() req: Request,
    @Res() res: Response
  ) {
    console.log(ip, headers, req.url);
    res.end('other'); // 如果接了req就只能手动返回前端了
  }
}
