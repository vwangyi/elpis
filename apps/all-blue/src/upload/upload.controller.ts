import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import {
  AnyFilesInterceptor,
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor
} from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import { storage } from './storage';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  // 单文件上传接口
  @Post('single-file')
  // 通过@UseInterceptors这个方法参数器 可以直接配置上传位置
  // @UseInterceptors(FileInterceptor('file', {dest: './uploads'}))
  @UseInterceptors(FileInterceptor('file'))
  singleFileUpload(
    // 通过这个 参数装饰器@UploadedFile() 可以直接拿到上传过来的文件
    @UploadedFile() file: Express.Multer.File
  ) {
    console.log(file);
    return {
      msg: '上传成功',
      file: file.filename
    };
  }

  // 多文件上传
  @Post('multiple-file')
  @UseInterceptors(FilesInterceptor('files', 3))
  multipleFilesUpload(
    // 通过这个 参数装饰器@UploadedFile() 可以直接拿到上传过来的文件
    @UploadedFile() files: Express.Multer.File[]
  ) {
    console.log(files);
    return {
      msg: '上传成功',
      files
    };
  }

  // 多文件上传2
  @Post('multiple-file2')
  // @UseInterceptors(FilesFieldsInterceptor([
  //   { name: 'file1', maxCount: 3 },
  //   { name: 'file2', maxCount: 3 },
  //   { name: 'file3', maxCount: 3 },
  // ]))
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'file1', maxCount: 3 },
      { name: 'file2', maxCount: 3 }
    ])
  )
  multipleFilesUpload2(
    // 通过这个 参数装饰器@UploadedFile() 可以直接拿到上传过来的文件
    @UploadedFile()
    files: {
      file1?: Express.Multer.File[];
      file2?: Express.Multer.File[];
    }
  ) {
    console.log(files);
    return {
      msg: '上传成功',
      files
    };
  }

  // 多文件上传3
  @Post('multiple-file3')
  @UseInterceptors(AnyFilesInterceptor({ storage }))
  multipleFilesUpload3(
    // 通过这个 参数装饰器@UploadedFile() 可以直接拿到上传过来的文件
    @UploadedFile() files: Express.Multer.File[]
  ) {
    console.log(files);
    return {
      msg: '上传成功',
      files
    };
  }

  @Post()
  create(@Body() createUploadDto: CreateUploadDto) {
    return this.uploadService.create(createUploadDto);
  }

  @Get()
  findAll() {
    return this.uploadService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.uploadService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUploadDto: UpdateUploadDto) {
    return this.uploadService.update(+id, updateUploadDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.uploadService.remove(+id);
  }
}
