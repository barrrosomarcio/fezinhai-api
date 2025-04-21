import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  SQSClient,
  SendMessageCommand,
  SendMessageCommandInput,
  SendMessageBatchCommand,
  SendMessageBatchCommandInput,
  SendMessageBatchRequestEntry,
  SendMessageCommandOutput,
  SendMessageBatchCommandOutput,
} from '@aws-sdk/client-sqs';
import { Observable, from } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrors } from '../../shared/errors/http-errors.filter';

@Injectable()
export class AwsSqsService implements OnModuleInit {
  private client: SQSClient;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.startConnection();
  }

  private startConnection() {
    const region = this.configService.get<string>('AWS_REGION');
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>(
      'AWS_SECRET_ACCESS_KEY',
    );

    if (!region || !accessKeyId || !secretAccessKey) {
      throw HttpErrors.internalServerError('AWS credentials not configured');
    }

    this.client = new SQSClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  sendMessage<T>(
    queueUrl: string,
    message: T,
    delaySeconds?: number,
    messageGroupId?: string,
    messageDeduplicationId?: string,
  ): Observable<string | SendMessageCommandOutput> {
    const input: SendMessageCommandInput = {
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(message),
      DelaySeconds: delaySeconds,
    };

    if (messageGroupId) {
      input.MessageGroupId = messageGroupId;
    }

    if (messageDeduplicationId) {
      input.MessageDeduplicationId = messageDeduplicationId;
    }

    const command = new SendMessageCommand(input);

    return from(this.client.send(command)).pipe(
      catchError((error) => {
        throw HttpErrors.internalServerError(`AWS SQS error: ${error.message}`);
      }),
    );
  }

  sendMessageBatch<T>(
    queueUrl: string,
    entries: Array<{
      id: string;
      message: T;
      delaySeconds?: number;
      messageGroupId?: string;
      messageDeduplicationId?: string;
    }>,
  ): Observable<SendMessageBatchCommandOutput> {
    const input: SendMessageBatchCommandInput = {
      QueueUrl: queueUrl,
      Entries: entries.map(
        ({
          id,
          message,
          delaySeconds,
          messageGroupId,
          messageDeduplicationId,
        }) => {
          const entry: SendMessageBatchRequestEntry = {
            Id: id,
            MessageBody: JSON.stringify(message),
            DelaySeconds: delaySeconds,
          };

          if (messageGroupId) {
            entry.MessageGroupId = messageGroupId;
          }

          if (messageDeduplicationId) {
            entry.MessageDeduplicationId = messageDeduplicationId;
          }

          return entry;
        },
      ),
    };

    const command = new SendMessageBatchCommand(input);

    return from(this.client.send(command)).pipe(
      catchError((error) => {
        throw HttpErrors.internalServerError(
          `AWS SQS batch error: ${error.message}`,
        );
      }),
    );
  }
}
