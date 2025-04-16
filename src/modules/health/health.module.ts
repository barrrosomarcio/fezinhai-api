import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { ConfigService } from '@nestjs/config';
@Module({
  controllers: [HealthController],
  providers: [HealthService, ConfigService],
})
export class HealthModule {} 