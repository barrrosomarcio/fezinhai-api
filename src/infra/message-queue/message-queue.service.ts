import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AwsSqsService } from '../aws-sqs/aws-sqs.service';
import { IMessageQueueService } from './interfaces/message-queue.service.interface';
import {
  SendMessageCommandOutput,
  SendMessageBatchCommandOutput,
} from '@aws-sdk/client-sqs';

@Injectable()
export class MessageQueueService implements IMessageQueueService {
  private queues: Record<string, string> = {};

  constructor(
    private readonly sqsService: AwsSqsService,
    private readonly configService: ConfigService,
  ) {
    const defaultQueueUrl = this.configService.get<string>('SQS_QUEUE_URL');
    if (defaultQueueUrl) {
      this.queues['default'] = defaultQueueUrl;
    }
  }

  registerQueue(name: string, url: string): void {
    this.queues[name] = url;
  }

  private getQueueUrl(queueName: string): string {
    const queueUrl = this.queues[queueName];

    if (!queueUrl) {
      throw new Error(`Queue not found: ${queueName}`);
    }

    return queueUrl;
  }

  sendMessage<T>(
    queueName: string,
    message: T,
    delaySeconds?: number,
  ): Observable<string> {
    const queueUrl = this.getQueueUrl(queueName);

    return this.sqsService.sendMessage(queueUrl, message, delaySeconds).pipe(
      map((result: SendMessageCommandOutput) => {
        return result.MessageId || '';
      }),
    );
  }

  sendMessageBatch<T>(
    queueName: string,
    messages: Array<{ id: string; message: T; delaySeconds?: number }>,
  ): Observable<{ successful: string[] }> {
    const queueUrl = this.getQueueUrl(queueName);

    return this.sqsService.sendMessageBatch(queueUrl, messages).pipe(
      map((result: SendMessageBatchCommandOutput) => {
        return {
          successful: (result.Successful || [])
            .map((s) => s.MessageId || '')
            .filter(Boolean),
        };
      }),
    );
  }
}
