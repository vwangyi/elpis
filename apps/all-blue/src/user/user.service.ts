import {
  HttpException,
  Injectable,
  OnApplicationBootstrap,
  Logger
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { NumericType } from 'typeorm/driver/mongodb/typings';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import md5 from 'md5';

// 1. 先写service
// 	1.先用@Injectable() 修饰 Service类
// 	2. @InjectRepository(User) 修饰 userRepository 属性
//  3. 就可以 通过 this.userRepository 调用 数据库了  封装普通方法一样的

@Injectable()
export class UserService implements OnApplicationBootstrap {
  private readonly logger = new Logger(UserService.name);

  // @InjectEntityManager()
  // private entityManager: EntityManager;
  @InjectRepository(User)
  private readonly userRepository: Repository<User>;

  /**
   * 应用启动时自动植入草帽一伙种子数据
   * 已存在则跳过，保证幂等
   */
  async onApplicationBootstrap() {
    await this.seedStrawHatCrew();
  }

  private async seedStrawHatCrew() {
    const count = await this.userRepository.count({
      where: { affiliation: '草帽一伙' }
    });
    if (count > 0) {
      this.logger.log(`草帽一伙数据已存在（${count}条），跳过种子植入`);
      return;
    }

    const defaultPassword = md5('123456');

    const crew: Partial<User>[] = [
      {
        username: '蒙奇·D·路飞',
        password: defaultPassword,
        name: '蒙奇·D·路飞',
        epithet: '草帽小子',
        gender: '男',
        birthday: new Date('2000-05-05'),
        age: 19,
        height: 174,
        status: 'Alive',
        affiliation: '草帽一伙',
        occupation: '船长',
        bounty: 1500000000,
        devilFruit: '橡胶果实',
        dream: '成为海贼王'
      },
      {
        username: '罗罗诺亚·索隆',
        password: defaultPassword,
        name: '罗罗诺亚·索隆',
        epithet: '海贼猎人',
        gender: '男',
        birthday: new Date('2000-11-11'),
        age: 21,
        height: 181,
        status: 'Alive',
        affiliation: '草帽一伙',
        occupation: '战斗员',
        bounty: 320000000,
        devilFruit: null,
        dream: '成为世界第一大剑豪'
      },
      {
        username: '娜美',
        password: defaultPassword,
        name: '娜美',
        epithet: '小贼猫',
        gender: '女',
        birthday: new Date('2000-07-03'),
        age: 20,
        height: 170,
        status: 'Alive',
        affiliation: '草帽一伙',
        occupation: '航海士',
        bounty: 66000000,
        devilFruit: null,
        dream: '画出全世界的航海图'
      },
      {
        username: '乌索普',
        password: defaultPassword,
        name: '乌索普',
        epithet: '狙击之王',
        gender: '男',
        birthday: new Date('2000-04-01'),
        age: 19,
        height: 176,
        status: 'Alive',
        affiliation: '草帽一伙',
        occupation: '狙击手',
        bounty: 200000000,
        devilFruit: null,
        dream: '成为勇敢的海上战士'
      },
      {
        username: '山治',
        password: defaultPassword,
        name: '山治',
        epithet: '黑足',
        gender: '男',
        birthday: new Date('2000-03-02'),
        age: 21,
        height: 180,
        status: 'Alive',
        affiliation: '草帽一伙',
        occupation: '厨师',
        bounty: 330000000,
        devilFruit: null,
        dream: '找到传说之海 All Blue'
      },
      {
        username: '托尼托尼·乔巴',
        password: defaultPassword,
        name: '托尼托尼·乔巴',
        epithet: '爱吃棉花糖的乔巴',
        gender: '男',
        birthday: new Date('2000-12-24'),
        age: 17,
        height: 90,
        status: 'Alive',
        affiliation: '草帽一伙',
        occupation: '船医',
        bounty: 1000,
        devilFruit: '人人果实',
        dream: '成为能医治所有疾病的万能药'
      },
      {
        username: '妮可·罗宾',
        password: defaultPassword,
        name: '妮可·罗宾',
        epithet: '恶魔之子',
        gender: '女',
        birthday: new Date('2000-02-06'),
        age: 30,
        height: 188,
        status: 'Alive',
        affiliation: '草帽一伙',
        occupation: '考古学家',
        bounty: 130000000,
        devilFruit: '花花果实',
        dream: '找到真正的历史正文'
      },
      {
        username: '弗兰奇',
        password: defaultPassword,
        name: '弗兰奇',
        epithet: '铁人·弗兰奇',
        gender: '男',
        birthday: new Date('2000-03-09'),
        age: 36,
        height: 240,
        status: 'Alive',
        affiliation: '草帽一伙',
        occupation: '船匠',
        bounty: 94000000,
        devilFruit: null,
        dream: '乘着自己造的船到达世界尽头'
      },
      {
        username: '布鲁克',
        password: defaultPassword,
        name: '布鲁克',
        epithet: '灵魂之王',
        gender: '男',
        birthday: new Date('2000-04-03'),
        age: 90,
        height: 277,
        status: 'Alive',
        affiliation: '草帽一伙',
        occupation: '音乐家',
        bounty: 83000000,
        devilFruit: '黄泉果实',
        dream: '与鲸鱼拉布重逢'
      },
      {
        username: '甚平',
        password: defaultPassword,
        name: '甚平',
        epithet: '海侠',
        gender: '男',
        birthday: new Date('2000-04-02'),
        age: 46,
        height: 301,
        status: 'Alive',
        affiliation: '草帽一伙',
        occupation: '舵手',
        bounty: 438000000,
        devilFruit: null,
        dream: '实现鱼人族与人类的和平共处'
      }
    ];

    try {
      await this.userRepository.save(crew);
      this.logger.log(`草帽一伙种子数据植入成功（${crew.length}条）`);
    } catch (e) {
      this.logger.error('草帽一伙种子数据植入失败', (e as Error).message);
    }
  }

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
      .where('user.username = :username or user.age = :age', {
        username,
        age
      })
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
