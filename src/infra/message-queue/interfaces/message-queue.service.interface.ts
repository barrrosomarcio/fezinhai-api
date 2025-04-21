import { Observable } from 'rxjs';

export interface IMessageQueueService {
  sendMessage<T>(
    queueName: string,
    message: T,
    delaySeconds?: number,
  ): Observable<string>;

  sendMessageBatch<T>(
    queueName: string,
    messages: Array<{
      id: string;
      message: T;
      delaySeconds?: number;
    }>,
  ): Observable<{ successful: string[] }>;

  registerQueue(name: string, url: string): void;
}
