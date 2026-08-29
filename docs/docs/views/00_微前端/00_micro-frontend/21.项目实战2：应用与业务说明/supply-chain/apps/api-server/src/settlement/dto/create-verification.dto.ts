import { Type } from 'class-transformer'
import { IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator'

export class CreateVerificationDto {
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  differenceAmount!: number

  @IsString()
  @MaxLength(200)
  differenceReason!: string

  @IsOptional()
  @IsString()
  @MaxLength(60)
  owner?: string
}
