import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import session from 'express-session';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets('public');
  app.use(
    session({
      secret: 'asdfaf', // session方案 需要一个唯一字符串密钥
      resave: false,
      saveUninitialized: false
    })
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
