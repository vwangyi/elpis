/* eslint-disable */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleModule } from './modules/article/article.module';
import { UploadModule } from './modules/upload/upload.module';

/*
  CREATE USER 'elpis_dev'@'%' IDENTIFIED BY 'elpis_dev@123';
GRANT ALL PRIVILEGES ON *.* TO 'elpis_dev'@'%' WITH GRANT OPTION;
mysql -h 119.29.175.228 -u elpis_dev -p
*/
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      // host: '119.29.175.228',
      // host: 'codewy.top', // mysql -u elpis_dev -p
      host: '127.0.0.1', // mysql -u elpis_dev -p
      port: 3306,
      username: 'elpis_dev',
      password: 'elpis_dev@123', // 目前不考虑安全问题 直接写这里
      database: 'elpis_dev',
      // synchronize 设置为true 表示当我们写好实体类 数据库就自动创建好了 有个缺点可能会覆盖数据库的数据 所以 正式环境禁止使用
      synchronize: process.env._ENV !== 'prod',
      autoLoadEntities: true, //
    }),
    UserModule,
    AuthModule,
    ArticleModule,
    UploadModule,
  ],
  controllers: [AppController],

  /* providers 是一个数组。数组项就是一个类 这里是 AppService.  这个数组可以看成一个参数列表。  
  那么 上一行的 AppController 这个类 就可以接收到参数

  举例 providers: [AppService, TestService],

  class AppController {
    constructor(
      private readonly appService: AppService,
      private readonly appService: TestService,
    ) {} 
  }
  

   */
  providers: [AppService],
})
export class AppModule {}
