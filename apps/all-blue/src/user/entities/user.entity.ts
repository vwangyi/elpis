import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ name: 'u_name', length: 6 })
  username: string;

  @Column({ length: 50 })
  password: string;

  @Column() // 默认是 varchat(255)
  age: number;

  @Column({ length: 11 })
  phone: number;

  @Column('text') // 数据库中类型是 text 长文本类型
  desc: string;

  @Column('double', { default: 0 }) // 数据库中类型是 double类型
  email: number;
}
