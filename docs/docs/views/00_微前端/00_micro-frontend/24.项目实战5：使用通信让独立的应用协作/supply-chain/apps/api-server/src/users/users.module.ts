import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Organization } from '../organizations/organization.entity'
import { User } from './user.entity'
import { UsersService } from './users.service'

@Module({
  imports: [TypeOrmModule.forFeature([User, Organization])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
