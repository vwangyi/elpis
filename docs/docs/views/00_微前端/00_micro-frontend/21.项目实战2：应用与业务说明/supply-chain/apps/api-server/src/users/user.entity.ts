import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { Organization } from '../organizations/organization.entity'

export enum UserStatus {
  Active = 'active',
  Disabled = 'disabled',
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 50, unique: true })
  username: string

  @Column({ name: 'display_name', type: 'varchar', length: 80 })
  displayName: string

  @Column({ name: 'password_hash', type: 'varchar', length: 100, select: false })
  passwordHash: string

  @Column({
    type: 'enum',
    enum: UserStatus,
    enumName: 'user_status_enum',
    default: UserStatus.Active,
  })
  status: UserStatus

  @Column({ name: 'organization_id', type: 'uuid' })
  organizationId: string

  @ManyToOne(() => Organization, (organization) => organization.users, { nullable: false })
  @JoinColumn({ name: 'organization_id' })
  organization: Organization

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date
}
