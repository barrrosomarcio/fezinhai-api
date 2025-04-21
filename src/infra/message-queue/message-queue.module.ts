import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AwsSqsModule } from '../aws-sqs/aws-sqs.module';
import { MessageQueueService } from './message-queue.service';

@Module({
  imports: [ConfigModule, AwsSqsModule],
  providers: [MessageQueueService],
  exports: [MessageQueueService],
})
export class MessageQueueModule {}
