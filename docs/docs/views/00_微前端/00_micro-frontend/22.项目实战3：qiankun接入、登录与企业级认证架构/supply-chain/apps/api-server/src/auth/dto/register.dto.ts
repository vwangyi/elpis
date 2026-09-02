import { ApiProperty } from '@nestjs/swagger'
import { IsString, Matches, MaxLength, MinLength } from 'class-validator'

export class RegisterDto {
  @ApiProperty({ example: 'zhangsan' })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^[a-zA-Z][a-zA-Z0-9_-]+$/, {
    message: '用户名必须以字母开头，只能包含字母、数字、下划线和连字符',
  })
  username: string

  @ApiProperty({ example: '张三' })
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  displayName: string

  @ApiProperty({ example: 'GROUP-HQ' })
  @IsString()
  @MaxLength(32)
  organizationCode: string

  @ApiProperty({ example: 'Secure123!' })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password: string
}
