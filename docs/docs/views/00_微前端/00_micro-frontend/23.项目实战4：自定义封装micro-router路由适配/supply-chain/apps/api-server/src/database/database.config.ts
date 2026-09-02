import type { ConfigService } from '@nestjs/config'
import type { TypeOrmModuleOptions } from '@nestjs/typeorm'

export function databaseConfig(config: ConfigService): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    host: config.get('DATABASE_HOST', 'localhost'),
    port: Number(config.get('DATABASE_PORT', 5432)),
    username: config.get('DATABASE_USER', 'supply_chain'),
    password: config.get('DATABASE_PASSWORD', 'supply_chain_dev'),
    database: config.get('DATABASE_NAME', 'supply_chain'),
    autoLoadEntities: true,
    synchronize: true,
    retryAttempts: 10,
    retryDelay: 1000,
  }
}
