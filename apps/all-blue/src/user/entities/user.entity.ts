import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  // PrimaryGeneratedColumn 表示自增
  @PrimaryGeneratedColumn()
  // @PrimaryColumn() // 没有自增
  id: number;

  //Column装饰器就是对数据库字段的修饰
  @Column({ name: 'u_name', length: 100 })
  name: string;

  @Column() // 默认是 varchat(255)
  age: number;

  @Column({ length: 11 })
  phone: number;

  @Column('text') // 数据库中类型是 text 长文本类型
  desc: string;

  @Column('double', { default: 0 }) // 数据库中类型是 double类型
  other: number;
}
