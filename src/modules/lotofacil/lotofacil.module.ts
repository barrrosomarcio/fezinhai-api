import { Module } from '@nestjs/common';
import { LotofacilController } from './lotofacil.controller';
import { LotofacilService } from './lotofacil.service';
import { LotofacilRepository } from './lotofacil.repository';
import { DatabaseModule } from '../../infra/database/database.module';
import { CacheModule } from '../../infra/cache/cache.module';
@Module({
  imports: [DatabaseModule, CacheModule],
  controllers: [LotofacilController],
  providers: [LotofacilService, LotofacilRepository],
  exports: [LotofacilService],
})
export class LotofacilModule {}
