import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() params: { username: string; password: string }) {
    const data = await this.authService.login(params.username, params.password);
    return data;
  }

  // @Post()
  // create(@Body() createAuthDto: CreateAuthDto) {
  //   return this.authService.create(createAuthDto);
  // }

  // @Get()
  // findAll() {
  //   return this.authService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}

// import { Body, Controller, Get, Post, UseFilters } from '@nestjs/common';
// import { Public } from './public.decorator';
// import { AuthService } from './auth.service';
// import { HttpExceptionFilter } from '../../../src/exception/http-exception.filter';
// import { success, error, wrapperResponse } from '../../utils';

// @Controller('auth')
// export class AuthController {
//   constructor(
//     private authService: AuthService,
//   ) {}

//   @Public()
//   @Post('login')
//   @UseFilters(new HttpExceptionFilter())
//   login(@Body() params) {
//     return wrapperResponse(
//       this.authService.login(params.username, params.password),
//       '登录成功',
//     );
//   }
// }
