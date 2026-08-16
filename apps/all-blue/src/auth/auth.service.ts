import { Inject, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from '../user/user.service';
import md5 from 'md5';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../user/dto/login-user.dto';

@Injectable()
export class AuthService {
  // 在auth模块 注入 user模块的service
  @Inject(UserService)
  private userService: UserService;

  @Inject(JwtService)
  private jwtService: JwtService;

  async validateUser(username: string, password: string) {
    const user = await this.userService.findOneByUsername(username);
    if (user && user.password === md5(password)) {
      return user;
    }
    return null;
  }

  async login(user: LoginUserDto) {
    const payload = { username: user.username, sub: user.password };
    return {
      access_token: this.jwtService.sign(payload)
    };
  }
}
