import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({
    secret: 'asdfasfs', 
    signOptions: { expiresIn: '7d'} , // 过期时间 60s 表示60秒 7d表示7day
  })],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
