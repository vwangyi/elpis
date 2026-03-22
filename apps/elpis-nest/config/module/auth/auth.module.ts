// import { Module } from '@nestjs/common';
// import { JwtModule } from '@nestjs/jwt';
// import { AuthController } from './auth.controller';
// import { AuthService } from './auth.service';
// import { APP_GUARD } from '@nestjs/core';
// import { AuthGuard } from './auth.guard';
// import { UserModule } from '../user/user.module';
// import { JWT_SECRET_KEY } from './auth.jwt.secrect';

// @Module({
//   imports: [
//     UserModule,
//     JwtModule.register({
//       global: true,
//       secret: JWT_SECRET_KEY,
//       signOptions: { expiresIn: 30 * 24 * 60 * 60 + 's' },
//     }),
//   ],
//   controllers: [AuthController],
//   providers: [
//     AuthService,
//     {
//       provide: APP_GUARD,
//       useClass: AuthGuard,
//     },
//   ],
// })
// export class AuthModule {}
