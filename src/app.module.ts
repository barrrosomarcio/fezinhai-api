import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { HealthModule } from './modules/health/health.module';
import { DatabaseModule } from './infra/database/database.module';
import databaseConfig from './infra/database/database.config';
import { LotofacilModule } from './modules/lotofacil/lotofacil.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    HealthModule,
    LotofacilModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
