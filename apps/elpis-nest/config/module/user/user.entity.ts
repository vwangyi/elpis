// import { Entity, Column, Unique } from 'typeorm';
// import { BaseEntity } from '../../entities/base.entity';

// /* entity 实体类 对应 t_user表 表示 t_user表有哪些字段 id username ...
//   数据库的表字段 和这个 当前entity文件 保持一致的
// */
// @Entity('t_user')
// export class User extends BaseEntity {
//   @Column()
//   userId: number; // userId 唯一标识一个用户

//   @Column() // 表示一个列名字段
//   @Unique(['username']) // 表示唯一键 （业务决定用户名不能重复）
//   username: string;

//   @Column()
//   password: string;

//   @Column()
//   avatar: string;

//   @Column()
//   role: string;

//   @Column()
//   nickname: string;

//   @Column()
//   active: number;

// }
