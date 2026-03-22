import {
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  VersionColumn,
} from 'typeorm';

export enum DeleteStatus {
  NOT_DELETED = 0,
  DELETED = 1,
}

export abstract class BaseEntity {
  // 主键 ID
  @PrimaryGeneratedColumn() // 主键且自增
  id: number; // 或者使用 `bigint`，对应数据库中的 BIGINT  id唯一标识一条数据 userId唯一标识一个用户

  // 乐观锁版本号
  @VersionColumn({ default: 0 }) // 每次修改都要+1
  version: number;

  // 逻辑删除标志 (0: 未删除, 1: 已删除)
  @Column({
    type: 'tinyint',
    default: DeleteStatus.NOT_DELETED,
    comment: '0未删除, 1已删除',
  })
  is_deleted: DeleteStatus;

  // 创建时间 (由数据库自动生成)
  @CreateDateColumn({ type: 'timestamp', comment: '记录创建时间' })
  create_time: Date;

  // 更新时间 (由数据库自动生成)
  @UpdateDateColumn({ type: 'timestamp', comment: '记录最后更新时间' })
  update_time: Date;

  // 添加创建人和更新人
  @Column({ length: 256, nullable: true, comment: '创建人' })
  creator: string;

  @Column({ length: 256, nullable: true, comment: '更新人' })
  updater: string;
}
