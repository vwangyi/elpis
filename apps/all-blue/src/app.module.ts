import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { UploadModule } from './upload/upload.module';
import { diskStorage } from 'multer';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'node:path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { TodoModule } from './todo/todo.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ChatModule } from './chat/chat.module';
import { LoggerModule } from './logger/logger.module';
import { LoggerMiddleware } from './logger/logger.middleware';
import { ResponseInterceptor } from './logger/response.interceptor';
import { HttpExceptionFilter } from './logger/http-exception.filter';

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
    // 自定义日志模块
    LoggerModule,
    UserModule,
    UploadModule,
    AuthModule,
    TodoModule,
    ChatModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // 全局响应拦截器
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor
    },
    // 全局异常过滤器
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter
    }
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 全局请求日志中间件
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
