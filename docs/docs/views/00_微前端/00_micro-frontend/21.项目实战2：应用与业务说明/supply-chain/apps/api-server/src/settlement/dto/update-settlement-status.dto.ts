import { Type } from 'class-transformer'
import { IsEnum, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator'

import { SettlementStatus } from '../settlement-batch.entity'

export class UpdateSettlementStatusDto {
  @IsEnum(SettlementStatus)
  status!: SettlementStatus

  @IsOptional()
  @IsString()
  @MaxLength(50)
  invoiceNo?: string

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  differenceAmount?: number

  @IsOptional()
  @IsString()
  @MaxLength(200)
  differenceReason?: string
}
