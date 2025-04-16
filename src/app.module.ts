import { Module } from '@nestjs/common';
import { DynamoDBService } from './infra/database/dynamodb.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [AuthModule, UsersModule, HealthModule],
  controllers: [],
  providers: [DynamoDBService],
})
export class AppModule {}
