import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common'

import { UpdateExceptionStatusDto } from './dto/update-exception-status.dto'
import { UpdateFulfillmentStatusDto } from './dto/update-fulfillment-status.dto'
import { UpdateVerificationDto } from './dto/update-verification.dto'
import { FulfillmentStatus } from './fulfillment.entity'
import { FulfillmentService } from './fulfillment.service'

@Controller('fulfillment')
export class FulfillmentController {
  constructor(private readonly fulfillmentService: FulfillmentService) {}

  @Get('summary')
  summary() {
    return this.fulfillmentService.summary()
  }

  @Get('orders')
  findAll(@Query('search') search?: string, @Query('status') status?: FulfillmentStatus) {
    return this.fulfillmentService.findAll(search, status)
  }

  @Patch('orders/:id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateFulfillmentStatusDto) {
    return this.fulfillmentService.updateStatus(id, dto.status)
  }

  @Get('exceptions')
  findExceptions() {
    return this.fulfillmentService.findExceptions()
  }

  @Patch('exceptions/:id/status')
  updateExceptionStatus(@Param('id') id: string, @Body() dto: UpdateExceptionStatusDto) {
    return this.fulfillmentService.updateExceptionStatus(id, dto.status)
  }

  @Get('verifications')
  findVerifications() {
    return this.fulfillmentService.findVerifications()
  }

  @Patch('verifications/:id')
  updateVerification(@Param('id') id: string, @Body() dto: UpdateVerificationDto) {
    return this.fulfillmentService.updateVerification(id, dto)
  }
}
