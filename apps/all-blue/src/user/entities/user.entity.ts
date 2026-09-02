import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  PrimaryColumn,
  CreateDateColumn
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, comment: '用户名' })
  username: string;

  @Column({ length: 50, comment: '密码' })
  password: string;

  @CreateDateColumn({ comment: '创建时间' })
  createTime: Date;

  @CreateDateColumn({ comment: '更新时间' })
  updateTime: Date;

  @Column({ nullable: true }) // 默认是 varchar(255)
  age: number;

  @Column({ length: 11, nullable: true })
  phone: string;

  @Column('text', { nullable: true }) // 数据库中类型是 text 长文本类型
  desc: string;

  @Column({ nullable: true }) // 数据库中类型是 double类型
  email: number;

  @Column({
    type: 'timestamp',
    nullable: true,
    transformer: {
      to: (value: string | Date): Date => {
        if (typeof value === 'string') {
          return new Date(`${value}T00:00:00.000Z`);
        }
        return value;
      },
      from: (value: Date): Date => value
    }
  })
  birthday: Date;

  /* ================================================================
   *  追加字段（对齐草帽一伙角色表结构）
   * ================================================================ */

  @Column({ length: 50, nullable: true, comment: '角色姓名（中文常用名）' })
  name: string;

  @Column({ length: 50, nullable: true, comment: '日文名' })
  japaneseName: string;

  @Column({ length: 100, nullable: true, comment: '绰号/外号（如：草帽小子）' })
  epithet: string;

  @Column({ length: 10, nullable: true, comment: '性别' })
  gender: string;

  @Column({ type: 'int', nullable: true, comment: '身高（单位：cm）' })
  height: number;

  @Column({
    length: 20,
    nullable: true,
    default: 'Alive',
    comment: '状态（Alive, Deceased, Unknown）'
  })
  status: string;

  @Column({
    length: 100,
    nullable: true,
    comment: '所属组织/海贼团（如：草帽一伙）'
  })
  affiliation: string;

  @Column({
    length: 100,
    nullable: true,
    comment: '职位/身份（如：船长，航海士）'
  })
  occupation: string;

  @Column({ type: 'bigint', nullable: true, comment: '悬赏金（单位：贝里）' })
  bounty: number;

  @Column({
    name: 'devil_fruit', // devilFruit 格式化为 devil_fruit
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: '恶魔果实能力名称'
  })
  devilFruit: string | null;

  @Column({ type: 'text', nullable: true, comment: '梦想/目标' })
  dream: string;
}
