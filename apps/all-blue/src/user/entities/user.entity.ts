import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number; 

  @Column({length: 50, comment: '用户名'})
  username: string;

  @Column({ length: 50, comment: '密码' })
  password: string;

  @CreateDateColumn({comment: '创建时间'}) 
  createTime: Date;


  @CreateDateColumn({comment: '更新时间'}) 
  updateTime: Date;

  @Column({ nullable: true}) // 默认是 varchat(255)
  age: number;

  @Column({ length: 11, nullable: true })
  phone: string; 

  @Column('text', { nullable: true }) // 数据库中类型是 text 长文本类型
  desc: string;

  @Column({ nullable: true }) // 数据库中类型是 double类型
  email: number;

  @Column({
    type: 'timestamp',
    transformer: {
      to: (value: string | Date): Date => {
        if(typeof value === 'string') {
            return new Date(`${value}T00:00:00.000Z`);
        }
        return value; 
      },
      from: (value: Date): Date => value 
    }
  })
  birthday: Date;
}
