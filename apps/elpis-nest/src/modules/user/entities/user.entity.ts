import { Entity, Column, Unique, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user') // 不传默认是类名 user表 传了 admin_user 就是admin_user表。这个注解的作用就是 和数据库有了映射关系
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Unique(['username'])
  username: string;

  @Column()
  password: string;

  @Column()
  avatar: string;

  @Column()
  role: string;

  @Column()
  nickname: string;

  @Column()
  active: number;
}
