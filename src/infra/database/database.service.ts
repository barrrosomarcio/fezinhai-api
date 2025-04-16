import { Injectable } from '@nestjs/common';
import { IDatabaseService } from './interfaces/database.service.interface';
import { AwsDynamoDBService } from '../aws-dynamo-db/aws-dynamo-db.service';
import { Observable } from 'rxjs';

@Injectable()
export class DatabaseService implements IDatabaseService {
  constructor(private readonly dynamoDBService: AwsDynamoDBService) {}

  get<T>(tableName: string, key: Record<string, any>): Observable<T> {
    return this.dynamoDBService.get<T>(tableName, key);
  }

  put<T>(tableName: string, item: T): Observable<void> {
    return this.dynamoDBService.put<T>(tableName, item);
  }

  delete(tableName: string, key: Record<string, any>): Observable<void> {
    return this.dynamoDBService.delete(tableName, key);
  }

  query<T>(tableName: string, keyConditionExpression: string, expressionAttributeValues: Record<string, any>): Observable<T[]> {
    return this.dynamoDBService.query<T>(tableName, keyConditionExpression, expressionAttributeValues);
  }

  scan<T>(tableName: string): Observable<T[]> {
    return this.dynamoDBService.scan<T>(tableName);
  }

  update<T>(tableName: string, key: Record<string, any>, updateExpression: string, expressionAttributeValues: Record<string, any>): Observable<T> {
    return this.dynamoDBService.update<T>(tableName, key, updateExpression, expressionAttributeValues);
  }
} 