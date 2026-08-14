import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { NumericType } from 'typeorm/driver/mongodb/typings';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class UserService {

  // @InjectEntityManager()
  // private entityManager: EntityManager;
  @InjectRepository(User)
  private readonly userRepositoty: Repository<User>;


  async login(user: LoginUserDto) {
return user;
  }

    async register(user: RegisterUserDto) {
return user;
    
  }


  async create(createUserDto: CreateUserDto) {
    // const user = await  this.entityManager.save(User, createUserDto);
    const user = await this.userRepositoty.save(createUserDto);
    console.log(user)
    return user;
  }

  async findAll(username: string, age: number) {
    // return await this.entityManager.find(User);

    // // 这个where默认是 and 关系 
    // return await this.userRepositoty.find({
    //   where: {
    //     username, 
    //     age
    //   }
    // });

    // 实现或者关系 需要用到 createQueryBuilder 的方式 写sql
    return this.userRepositoty
      .createQueryBuilder('user')
      .where('user.username = :username or user.age = :age', { username, age })
      .getMany();
  }

  async findOne(id: number) {
    // return await this.entityManager.findOneBy(User, { id })
    return await this.userRepositoty.findOneBy({id});
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    // return await this.entityManager.save(User, { id, ...updateUserDto})
    return await this.userRepositoty.save({ id, ...updateUserDto});
  }

  async remove(id: number) {
    // return await this.entityManager.delete(User, { id })
    return await this.userRepositoty.delete({ id })
  }
}
