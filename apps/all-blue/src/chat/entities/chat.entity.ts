import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn
} from 'typeorm';

@Entity('chat_message')
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, default: 'public', comment: '房间名' })
  room: string;

  @Column({ length: 50, comment: '发送者昵称' })
  username: string;

  @Column({ type: 'text', comment: '消息内容' })
  content: string;

  @CreateDateColumn({ comment: '发送时间' })
  createTime: Date;
}
