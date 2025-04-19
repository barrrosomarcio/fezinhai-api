import { Observable } from 'rxjs';

export interface IMessageQueueService {
  sendMessage<T>(queueName: string, message: T, delaySeconds?: number): Observable<string>;
  s
  sendMessageBatch<T>(
    queueName: string, 
    messages: Array<{
      id: string;
      message: T;
      delaySeconds?: number;
    }>
  ): Observable<{ successful: string[] }>;
} 