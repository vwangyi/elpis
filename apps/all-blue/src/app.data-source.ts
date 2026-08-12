import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './user/entities/user.entity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  database: 'onepiece_dev',
  host: 'localhost',
  port: 3306,
  password: '123456',
  synchronize: true, // 开发环境使用会自动创建表 生产环境自己导出sql 在生产环境执行来创建表
  logging: true, // 是否在控制台打印日志
  entities: [User],
  migrations: [],
  subscribers: []
});
