import { IsEnum } from 'class-validator'

import { ExceptionStatus } from '../fulfillment-exception.entity'

export class UpdateExceptionStatusDto {
  @IsEnum(ExceptionStatus)
  status!: ExceptionStatus
}
