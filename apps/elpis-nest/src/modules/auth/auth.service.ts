/* eslint-disable */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import md5 from 'md5';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(username: string, password: string) {
    const user = await this.userService.findByUsername(username);
    const pwd = md5(password).toUpperCase();

    if (pwd !== user.password) {
      throw new UnauthorizedException();
    }

    const payload = {
      username: user.username,
      uesrId: user.id,
    };

    return {
      token: await this.jwtService.signAsync(payload),
    };
  }
}
