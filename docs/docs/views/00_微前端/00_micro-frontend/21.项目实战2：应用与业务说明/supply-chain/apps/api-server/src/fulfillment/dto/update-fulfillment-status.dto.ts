import { IsEnum } from 'class-validator'

import { FulfillmentStatus } from '../fulfillment.entity'

export class UpdateFulfillmentStatusDto {
  @IsEnum(FulfillmentStatus)
  status!: FulfillmentStatus
}
