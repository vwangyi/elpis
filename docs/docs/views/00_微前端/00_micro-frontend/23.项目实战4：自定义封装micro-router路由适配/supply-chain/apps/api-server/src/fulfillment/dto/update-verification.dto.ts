import { Type } from 'class-transformer'
import { IsEnum, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator'

import { VerificationStatus } from '../fulfillment-verification.entity'

export class UpdateVerificationDto {
  @IsEnum(VerificationStatus)
  status!: VerificationStatus

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  verifiedDeliveryAmount?: number

  @IsOptional()
  @IsString()
  @MaxLength(500)
  resolution?: string
}
