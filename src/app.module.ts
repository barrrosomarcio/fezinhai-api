import { Module } from '@nestjs/common';
import { DynamoDBService } from './infra/database/dynamodb.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
@Module({
  imports: [DynamoDBService, AuthModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
