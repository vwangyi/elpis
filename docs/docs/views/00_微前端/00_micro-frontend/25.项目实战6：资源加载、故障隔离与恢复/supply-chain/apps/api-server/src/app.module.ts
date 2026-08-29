import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { APP_GUARD } from '@nestjs/core'

import { AuthModule } from './auth/auth.module'
import { JwtAuthGuard } from './auth/jwt-auth.guard'
import { databaseConfig } from './database/database.config'
import { DashboardModule } from './dashboard/dashboard.module'
import { FulfillmentModule } from './fulfillment/fulfillment.module'
import { HealthModule } from './health/health.module'
import { OrdersModule } from './orders/orders.module'
import { OrganizationsModule } from './organizations/organizations.module'
import { SettlementModule } from './settlement/settlement.module'
import { UsersModule } from './users/users.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env', '../../.env'] }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: databaseConfig,
    }),
    OrganizationsModule,
    UsersModule,
    AuthModule,
    HealthModule,
    OrdersModule,
    FulfillmentModule,
    SettlementModule,
    DashboardModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
