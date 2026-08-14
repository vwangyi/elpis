import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { NumericType } from 'typeorm/driver/mongodb/typings';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import md5 from 'md5';

@Injectable()
export class UserService {
  // @InjectEntityManager()
  // private entityManager: EntityManager;
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  // 根据用户名查找用户
  async findOneByUsername(username: string) {
    return await this.userRepository.findOneBy({ username });
  }

  async login(user: LoginUserDto) {
    const loginUser = await this.findOneByUsername(user.username);
    if (!loginUser) {
      throw new HttpException('用户不存在', 400);
    }
    if (loginUser.password !== md5(user.password)) {
      throw new HttpException('密码错误', 400);
    }

    return loginUser;
  }

  async register(user: RegisterUserDto) {
    const result = await this.userRepository.findOneBy({
      username: user.username
    });
    if (result) {
      return new HttpException('用户名已存在', 200);
    }
    const newUser = new User(); // 把entity实例化对象
    newUser.username = user.username;
    newUser.password = md5(user.password);

    try {
      await this.userRepository.save(newUser);
      return '注册成功';
    } catch (e) {
      console.log('e', e);
      return '注册失败';
    }
  }

  async create(createUserDto: CreateUserDto) {
    // const user = await  this.entityManager.save(User, createUserDto);
    const user = await this.userRepository.save(createUserDto);
    console.log(user);
    return user;
  }

  async findAll(username: string, age: number) {
    // return await this.entityManager.find(User);

    // // 这个where默认是 and 关系
    // return await this.userRepository.find({
    //   where: {
    //     username,
    //     age
    //   }
    // });

    // 实现或者关系 需要用到 createQueryBuilder 的方式 写sql
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :username or user.age = :age', { username, age })
      .getMany();
  }

  async findOne(id: number) {
    // return await this.entityManager.findOneBy(User, { id })
    return await this.userRepository.findOneBy({ id });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    // return await this.entityManager.save(User, { id, ...updateUserDto})
    return await this.userRepository.save({ id, ...updateUserDto });
  }

  async remove(id: number) {
    // return await this.entityManager.delete(User, { id })
    return await this.userRepository.delete({ id });
  }
}
