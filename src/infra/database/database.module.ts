import { Module } from '@nestjs/common';
import { AwsDynamoDBModule } from '../aws-dynamo-db/aws-dynamo-db.module';
import { DatabaseService } from './database.service';

@Module({
  imports: [AwsDynamoDBModule],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
