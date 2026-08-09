import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const name = new Array(32)
            .fill(0)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${name}${extname(file.originalname)}`);
        }
      })
    })
  ],
  controllers: [UploadController],
  providers: [UploadService]
})
export class UploadModule {}
