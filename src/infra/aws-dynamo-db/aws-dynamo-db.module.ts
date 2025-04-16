import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AwsDynamoDBService } from './aws-dynamo-db.service';
@Module({
  imports: [ConfigModule],
  providers: [AwsDynamoDBService],
  exports: [AwsDynamoDBService],
})
export class AwsDynamoDBModule {} 