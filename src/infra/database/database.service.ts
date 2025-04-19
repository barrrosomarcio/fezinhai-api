import { Injectable } from '@nestjs/common';
import { IDatabaseService } from './interfaces/database.service.interface';
import { AwsDynamoDBService } from '../aws-dynamo-db/aws-dynamo-db.service';
import { Observable } from 'rxjs';
import { DynamoDBValueInput } from './mappers/base-dynamodb.mapper';
@Injectable()
export class DatabaseService implements IDatabaseService {
  constructor(private readonly dynamoDBService: AwsDynamoDBService) {}

  get<T>(
    tableName: string,
    key: Record<string, DynamoDBValueInput>,
  ): Observable<T> {
    return this.dynamoDBService.get<T>(tableName, key);
  }

  put<T>(tableName: string, item: T): Observable<void> {
    return this.dynamoDBService.put<T>(tableName, item);
  }

  delete(
    tableName: string,
    key: Record<string, DynamoDBValueInput>,
  ): Observable<void> {
    return this.dynamoDBService.delete(tableName, key);
  }

  query<T>(
    tableName: string,
    keyConditionExpression: string,
    expressionAttributeValues: Record<string, DynamoDBValueInput>,
    indexName?: string,
    limit?: number,
    scanIndexForward?: boolean,
  ): Observable<T[]> {
    return this.dynamoDBService.query<T>(
      tableName,
      keyConditionExpression,
      expressionAttributeValues,
      limit,
      scanIndexForward,
    );
  }

  scan<T>(tableName: string): Observable<T[]> {
    return this.dynamoDBService.scan<T>(tableName);
  }

  update<T>(
    tableName: string,
    key: Record<string, DynamoDBValueInput>,
    updateExpression: string,
    expressionAttributeValues: Record<string, DynamoDBValueInput>,
  ): Observable<T> {
    return this.dynamoDBService.update<T>(
      tableName,
      key,
      updateExpression,
      expressionAttributeValues,
    );
  }
}
