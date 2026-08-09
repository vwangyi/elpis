import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  getUserList() {
    return [
      { id: 1, name: 'jack', age: 19 },
      { id: 2, name: 'rose', age: 17 }
    ];
  }

  query(name: string, age: number) {
    return `查询条件：name=${name}，age=${age}`;
  }

  findOne(id: number) {
    return `查询id=${id}的用户`;
  }

  add(user: CreateUserDto) {
    return `添加用户：${JSON.stringify(user)}`;
  }
}
