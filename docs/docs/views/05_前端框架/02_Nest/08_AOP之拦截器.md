## 拦截器 和 rxjs 
- AOP在nest中的应用 拦截器

- `nest g itc timeout`: `给timeout这个模块加拦截器` 







- 可以作用于 

1. 整个controller上
2. controller的某个方法上
3. 整个应用上

```ts
@UseInterceptors(TimeoutInterceptor);
export class xxx {


    @Get()
    @UseInterceptors(TimeoutInterceptor);
    findAll() {}
}
```

> 方式1 
```ts
// app.moudle.ts
import { APP_GUARD } from '@nestjs/core'
import { PersonGuard } from './xxx'
@Module({
    imports:[],
    controllers:[],
    provides: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: PersonGuard, // 把类给IOC容器管理  （全局使用）
        }, 
        {
            provide: APP_INTERCEPTOR,
            useClass: TimeIntercepor, // 把类给IOC容器管理 （全局使用）
        }
    ]
})
```

> 方式2 不建议用
```ts
// main.ts
import {PersonGuard } from './person/person.guard'
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
//   app.useGlobalGuards(new PersonGuard())
app.useGlobalInterceptor(new TimeIntercepor()) // 一样的问题 自己new 的对象 没有让IOC容器管理
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```



RXJS 类似 lodash 