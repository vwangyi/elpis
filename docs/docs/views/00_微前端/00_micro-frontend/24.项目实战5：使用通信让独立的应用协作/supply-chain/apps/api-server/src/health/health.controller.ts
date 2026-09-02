import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { DataSource } from 'typeorm'

import { Public } from '../auth/public.decorator'

@ApiTags('系统')
@Controller('health')
export class HealthController {
  constructor(private readonly dataSource: DataSource) {}

  @Get()
  @Public()
  @ApiOperation({ summary: '检查 API 与数据库连接' })
  getHealth() {
    return {
      status: 'ok',
      service: 'supply-chain-api',
      database: this.dataSource.isInitialized ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
    }
  }
}
