import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api')
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
    credentials: true,
  })
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }),
  )

  const swaggerConfig = new DocumentBuilder()
    .setTitle('集团供应链协同平台 API')
    .setDescription('订单履约、异常协同与业财结算接口')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, swaggerConfig))

  await app.listen(process.env.API_PORT ?? 3000)
}

void bootstrap()
