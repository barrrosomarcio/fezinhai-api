import { Module } from '@nestjs/common';
import { LotofacilController } from './lotofacil.controller';
import { LotofacilService } from './lotofacil.service';
import { LotofacilRepository } from './lotofacil.repository';
import { DatabaseModule } from '../../infra/database/database.module';
import { CacheModule } from '../../infra/cache/cache.module';
import { ConfigService } from '@nestjs/config';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    DatabaseModule,
    CacheModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [LotofacilController],
  providers: [LotofacilService, LotofacilRepository],
  exports: [LotofacilService],
})
export class LotofacilModule {}
