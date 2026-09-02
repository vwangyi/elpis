import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare, hash } from 'bcryptjs'

import { UserStatus } from '../users/user.entity'
import { UsersService } from '../users/users.service'
import type { JwtPayload } from './auth.types'
import type { LoginDto } from './dto/login.dto'
import type { RegisterDto } from './dto/register.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(input: LoginDto) {
    const user = await this.usersService.findByUsernameWithPassword(input.username)
    const passwordMatched = user ? await compare(input.password, user.passwordHash) : false

    if (!user || !passwordMatched || user.status !== UserStatus.Active) {
      throw new UnauthorizedException('用户名或密码错误')
    }

    return this.createSession(user)
  }

  async register(input: RegisterDto) {
    const user = await this.usersService.create({
      username: input.username,
      displayName: input.displayName,
      passwordHash: await hash(input.password, 12),
      organizationCode: input.organizationCode,
    })
    return this.createSession(user)
  }

  private async createSession(user: {
    id: string
    username: string
    displayName: string
    organizationId: string
    organization: { id: string; name: string }
  }) {
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      organizationId: user.organizationId,
    }

    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        organization: { id: user.organization.id, name: user.organization.name },
      },
    }
  }
}
