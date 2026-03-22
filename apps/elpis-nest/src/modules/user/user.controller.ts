/* eslint-disable */
import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Query,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';

/**
 *  GET /user 创建用户
 *  DELETE /user/:id 删除某个用户
 *  GET /user/list 查询用户列表 带分页
 */
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /* 创建一个用户 */
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
  /* 删除一个用户 */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
  /* 查询所有 带分页 */
  @Get('list')
  findAll(@Query() query: any) {
    return this.userService.getUserList(1, 999999999);
  }

  // @Get(':id')
  // getUserById(@Param('id', ParseIntPipe) id: number) {
  //   return this.userService.findOne(id);
  // }

  // @Get('info')
  // getUserByToken() {
  //   // this.userService.xx
  // }
}
