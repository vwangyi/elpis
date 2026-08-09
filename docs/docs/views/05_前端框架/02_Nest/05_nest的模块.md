
## 模块

```ts
// user.module.ts 
@Module({
  controllers: [UserController],
  providers: [UserService],
  // 1. 导出当前模块 UserService，以便其他模块可以使用
  exports: [UserService],
})
export class UserModule {}
```

```ts
// order.module.ts
@Module({
  // 2. 导入UserService
  imports: [UserService], 
  controllers: [OrderController],
  providers: [OrderService], 
})
export class UserModule {}

// order.service.ts  
@Injectable()
export class OrderSerice {
    // 3. 在OrderSerice 导入 UserService模块
    @Inject(UserService);
    private userService: UserService;

    findOne() {
        // 4. 在OrderSerice 使用 UserService模块
        this.UserService 
    }
}
```


## 全局模块
```ts
// user.module.ts 
@Global() // 1. 把当前user模块 作为全局模块
@Module({
  controllers: [UserController],
  providers: [UserService],
  // 2. 导出当前模块 UserService，以便其他模块可以使用
  exports: [UserService],
})
export class UserModule {}
```

```ts
// order.module.ts
@Module({ 
  // imports: [UserService],  2. 不需要导入了 因为是全局模块 
  controllers: [OrderController],
  providers: [OrderService], 
})
export class UserModule {}

// order.service.ts  
@Injectable()
export class OrderSerice {
    // 3. 在OrderSerice 导入 UserService模块
    @Inject(UserService);
    private userService: UserService;

    findOne() {
        // 4. 在OrderSerice 使用 UserService模块
        this.UserService 
    }
}
```


## 静态导入和动态导入

```ts
// auth.module.ts  假如我有一个auth模块 必须在app.module.ts模块中导入

@Modules({}) // 
export class AuthModule {
    static register(options: Record<string, any>): DynamicModule {

        // 这个返回的对象 就是 @Modules() 传入的对象
         return {
            module: AuthModule,
            controllers: [AuthController],
            provides: [AuthServices, {
                provide: 'CONFIG_options',
                useValue: options
            }],
            exports: [AuthService],
         }
    }
}
```

```ts
// app.module.ts
@Modules({
    // imports: [AuthModule], // 静态导入
    imports: [AuthModule.register({ role: 'admin', type: 'auth' })], // 动态导入
})
```