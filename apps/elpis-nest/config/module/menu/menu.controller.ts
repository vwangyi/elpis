// import {
//   Body,
//   Controller,
//   Delete,
//   Get,
//   Param,
//   ParseIntPipe,
//   Post,
//   Put,
// } from '@nestjs/common';
// import { MenuService } from './menu.service';
// import { wrapperResponse } from '../../utils';

// @Controller('menu')
// export class MenuController {
//   constructor(private readonly menuService: MenuService) {}

//   @Get('active')
//   getActiveMenu() {
//     return wrapperResponse(
//       this.menuService.findActive(), '获取菜单成功'
//     );
//   }

//   @Get(':id')
//   getMenu(@Param('id', ParseIntPipe) id: number) {
//     // return this.userService.findOne(id);
//   }

//   @Get()
//   getAllMenu() {
//     return wrapperResponse(
//       this.menuService.findAll(),
//       '获取菜单成功',
//     );
//   }

//   @Post()
//   create(@Body() body) {
//     return wrapperResponse(
//       this.menuService.create(body),
//       '菜单创建成功',
//     );
//   }

//   @Put()
//   update(@Body() body) {
//     return wrapperResponse(
//       this.menuService.update(body),
//       '菜单更新成功',
//     );
//   }

//   @Delete(':id')
//   remove(@Param('id', ParseIntPipe) id: number) {
//     // return this.userService.remove(id);
//   }
// }
