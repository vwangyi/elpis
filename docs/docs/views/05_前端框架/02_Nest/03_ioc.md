

## IOC 控制反转 
controller层
service层
dao层
datasource 数据源

- 其实每一层我们需要的是一个单例模式 保证我们每次调用service都是同一个service对象
- 在大型项目中 我们自己去维护这种单例 很麻烦
- 所以诞生了 IOC控制反转解决方案 其实也叫 依赖注入
- 依赖注入是IOC的实现之一 

- 通过IOC 我们从主动创建对象和维护对象，转变为 被动等待依赖注入，实现从主动下厨到等待服务员上菜的转变，这就是IOC控制反转的精髓

- 本质就是 维护一个 IOC容器 每次从IOC容器里面拿对象 所以就保持单例模式了 

## nestjs中如何应用IOC容器  

- 在 controller中导出的class类   并没有new实例化 而是通过 @Controller() 装饰器来装饰这个类 
- service中导出的类 也没有实例化 而是通过 @Injectable()装饰器 来装饰类  这样就被IOC容器管理了

- 需要提供服务 且 被 IOC容器 管理的 都可以用 @Injectable()装饰器  后续拦截器也是用@Injectable()

> 在module中 
```ts

@Module({
    imports: [],
    // controller是消费者 
    controllers: [UserController],
    // provides提供服务的提供者   provides里面 其实就是 键值对 provide是key useClass和useValue是value 
    // 这里注入之后 就是在 IOC容器里面注入了  然后才可以在 controller文件里面引用 
    provides: [
        {
            provide: UserService, // 就是key名而已  也可以直接传字符串 key
            useClass: UserService
        },
        {
            // provide是key
            provide: 'car',
            // useValue可以是一个字面量对象  
            useValue: {
                brand: 'BYD',
                price: 9999
            }
        },
        {
            provide: 'random',
            useFactory: () => Math.rondom() // useFactory 可以是一个函数
        }
    ],
    provides: [UserService], // 简写

})  
export class UserModule {}


@Module({
  imports: [UserModule, PersonModule],
  // controller是消费者 
  controllers: [AppController],
  
    // provides提供服务的提供者   provides里面 其实就是 键值对 provide是key useClass和useValue是value 
    // 这里注入之后 就是在 IOC容器里面注入了  然后才可以在 controller文件里面引用 
  providers: [
    {
      provide: AppService, // key值一般和useClass的类名一致
      useClass: AppService,
    },
    {
      provide: 'car',
      useValue: {
        brand: 'BYD',
        price: 100000,
      },
    },
    {
      provide: 'random',
      useFactory:  (
        car: { brand: string; price: number },
        appService: AppService,
      ) => { 
        return {
          random: Math.random(),
          brand: car.brand,
          hello: appService.getHello(),
        }
      },
      inject: ['car', AppService],
    },
  ],
})
export class AppModule {}


```
> 在controller中使用
```ts 
@Controller('app')
export class AppController {
  @Inject(UserService) // 这里传递的就是上面的key名  上面key是字符串 这里也是字符串 一般用类名

  @Inject('car')
  private car: { brand: string; price: number };

  @Inject('random')
  private random: number;

  // 最常用是 构造函数注入 而不是属性注入 
  constructor(private readonly appService: AppService) {}
 
  @Get('hello1')
  getHello1(): string {
    return (
      this.appService.getHello() +
      '---' +
      this.car.brand +
      '---' +
      this.car.price +
      '---' +
      this.random
    );
  }
 
}

```
