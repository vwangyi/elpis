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
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'dev'}` // 默认 开发环境
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService], // 需要注入 ConfigModule的ConfigService
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST') ?? 'localhost', // 通过这种方式取到 .env里面的值
        port: configService.get<number>('DB_PORT') ?? 3306,
        username: configService.get<string>('DB_USERNAME') ?? 'root',
        password: configService.get<string>('DB_PASSWORD') ?? '',
        database: configService.get<string>('DB_DATABASE') ?? 'test',
        synchronize: process.env.NODE_ENV === 'dev', // 可以修改数据库根据实体和数据库会一致
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        timezone: 'Z',
        logging: true
      })
    }),
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: 'codewy.top',
    //   port: 3306,
    //   username: 'root',
    //   password: 'Root@123456',
    //   database: 'onepiece_dev',
    //   entities: [__dirname + '/**/*.entity{.ts,.js}'],
    //   synchronize: true, // 可以修改数据库根据实体和数据库会一致
    //   timezone: 'Z' // 表示用 UTC时间
    // }),
    UserModule,
    UploadModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
