 

## 中间件和守卫 
- 中间件和守卫就是AOP 

- 中间件是express中的概念 而nest底层是express 所以也是nest的概念 



## 局部中间件

```ts
// user.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFuntion } from 'express'
@Injectable()
export class UserMiddleware extends NestMiddleware {

    // 因为当前文件是放在user模块内部的 所以可以用@Inject注入
    @Inject(UserService)
    private userService: UserService;

    use(req: Request, res: Response, next: NextFuntion) {
        console.log('before')
        // 调用注入的服务
        this.userService.findAll()
        next();
        console.log('after')
    }
}
```

```ts
// user.module.ts
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    {
      provide: 'user_service',
      useClass: UserService,
    },
  ],
})
export class UserModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        // 为所有路由都加了 中间件
        // consumer.apply(UserMiddleware).forRoutes(UserController);

        // 给 指定路由加中间件
        consumer.apply(UserMiddleware).forRoutes({
            path: '/user',
            method: RequestMethod.GET,
        });
    }
}

```
## 全局中间件 放到src下 而不是某个模块下

- nest g mi logger --flat --no-spec 
```ts
// user.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFuntion } from 'express'
@Injectable()
export class UserMiddleware extends NestMiddleware { 
    use(req: Request, res: Response, next: NextFuntion) {
        console.log('before')
        // 调用注入的服务
        this.userService.findAll()
        next();
        console.log('after')
    }
}
```
```ts
// main.ts
import { UserMiddleware } from ''
async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.use(new UserMiddleware().use); // 使用全局中间件
    await app.listen(3000);
}
```
