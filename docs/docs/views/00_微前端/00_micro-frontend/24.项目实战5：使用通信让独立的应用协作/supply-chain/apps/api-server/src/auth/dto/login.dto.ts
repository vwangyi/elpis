import { ApiProperty } from '@nestjs/swagger'
import { IsString, MaxLength, MinLength } from 'class-validator'

export class LoginDto {
  @ApiProperty({ example: 'admin' })
  @IsString()
  @MaxLength(50)
  username: string

  @ApiProperty({ example: 'Admin123!' })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password: string
}
