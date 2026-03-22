// import { Controller, ParseIntPipe, Req } from '@nestjs/common';
// import { Get, Post, Put, Delete } from '@nestjs/common';
// import { Param, Query, Body } from '@nestjs/common';

// import { UserService } from './user.service';
// import { wrapperResponse } from '../../utils';

// /*
//   /user      新增用户     post
//   /user/:id  删除用户     delete
//   /user/:id  修改用户     put
//   /user      获取用户列表  get
//   /user/:id  获取用户信息  get
// */

// @Controller('user')
// export class UserController {
//   constructor(private readonly userService: UserService) {}

//   @Get('find/all')
//   findAll(@Query() query) {
//     return this.userService.findAll(query);
//   }

//   @Get('find')
//   find(@Query() query) {
//     query.id = 1;
//     return this.userService.find(query);
//   }

//   @Get('info')
//   getUserByToken(@Req() request) {
//     return wrapperResponse(
//       this.userService.findByUsername(request.user.username),
//       '获取用户信息成功',
//     );
//   }

//   @Get(':id')
//   getUser(@Param('id', ParseIntPipe) id: number) {
//     return this.userService.find(id);
//   }

//   @Get()
//   getAllUser(@Query() query) {
//     return wrapperResponse(this.userService.findAll(query), '获取用户列表成功');
//   }

//   @Put()
//   update(@Body() body) {
//     return wrapperResponse(this.userService.update(body), '编辑用户成功');
//   }

//   @Post()
//   create(@Body() body) {
//     return wrapperResponse(this.userService.create(body), '新增用户成功');
//   }

//   @Delete(':id')
//   remove(@Param('id', ParseIntPipe) id: number) {
//     return this.userService.remove(id);
//   }
// }
