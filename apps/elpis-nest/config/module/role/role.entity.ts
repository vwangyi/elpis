import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('role')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Unique(['roleName'])
  name: string;

  @Column()
  remark: string;
}
