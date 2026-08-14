import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { UploadModule } from './upload/upload.module';
import { diskStorage } from 'multer';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'node:path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'codewy.top',
      port: 3306,
      username: 'root',
      password: 'Root@123456',
      database: 'onepiece_dev',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // 可以修改数据库根据实体和数据库会一致
      timezone: 'Z', // 表示用 UTC时间
    }),
    UserModule,
    UploadModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
