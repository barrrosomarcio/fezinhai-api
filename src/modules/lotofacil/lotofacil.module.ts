import { Module } from '@nestjs/common';
import { LotofacilController } from './lotofacil.controller';
import { LotofacilService } from './lotofacil.service';
import { LotofacilRepository } from './lotofacil.repository';
import { DatabaseModule } from '../../infra/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [LotofacilController],
  providers: [LotofacilService, LotofacilRepository],
  exports: [LotofacilService],
})
export class LotofacilModule {}
