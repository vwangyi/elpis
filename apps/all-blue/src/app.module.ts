import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { UploadModule } from './upload/upload.module';
import { diskStorage } from 'multer';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'node:path';

@Module({
  imports: [UserModule, UploadModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
