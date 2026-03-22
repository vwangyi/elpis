import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // 这一步就完成了 user实体类和数据库表的映射关系
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
