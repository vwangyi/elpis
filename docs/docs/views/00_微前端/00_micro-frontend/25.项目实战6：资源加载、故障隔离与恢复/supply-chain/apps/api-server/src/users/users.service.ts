import { BadRequestException, ConflictException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Organization } from '../organizations/organization.entity'
import { User, UserStatus } from './user.entity'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
  ) {}

  findByUsernameWithPassword(username: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .leftJoinAndSelect('user.organization', 'organization')
      .where('user.username = :username', { username })
      .getOne()
  }

  async create(input: {
    username: string
    displayName: string
    passwordHash: string
    organizationCode: string
  }): Promise<User> {
    const existingUser = await this.userRepository.findOneBy({ username: input.username })
    if (existingUser) throw new ConflictException('用户名已经存在')

    const organization = await this.organizationRepository.findOneBy({
      code: input.organizationCode,
    })
    if (!organization) throw new BadRequestException('组织编码不存在，请联系平台管理员')

    return this.userRepository.save(
      this.userRepository.create({
        username: input.username,
        displayName: input.displayName,
        passwordHash: input.passwordHash,
        organizationId: organization.id,
        organization,
        status: UserStatus.Active,
      }),
    )
  }
}
