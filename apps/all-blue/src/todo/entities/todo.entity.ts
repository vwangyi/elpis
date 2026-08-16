import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, comment: '待办标题' })
  title: string;

  @Column({ length: 500, nullable: true, comment: '待办描述' })
  description: string;

  @Column({ type: 'tinyint', default: 0, comment: '状态: 0-未完成 1-已完成' })
  status: number;

  @CreateDateColumn({ comment: '创建时间' })
  createTime: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updateTime: Date;
}
