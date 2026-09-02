import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common'

import { CreateVerificationDto } from './dto/create-verification.dto'
import { UpdateSettlementStatusDto } from './dto/update-settlement-status.dto'
import { SettlementService } from './settlement.service'

@Controller('settlements')
export class SettlementController {
  constructor(private readonly settlementService: SettlementService) {}

  @Get('summary')
  summary() {
    return this.settlementService.summary()
  }

  @Get('batches')
  findAll() {
    return this.settlementService.findAll()
  }

  @Patch('batches/:id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateSettlementStatusDto) {
    return this.settlementService.updateStatus(id, dto)
  }

  @Post('batches/:id/verifications')
  createVerification(@Param('id') id: string, @Body() dto: CreateVerificationDto) {
    return this.settlementService.createVerification(id, dto)
  }
}
