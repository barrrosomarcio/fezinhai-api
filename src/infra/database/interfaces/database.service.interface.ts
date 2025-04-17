import { Observable } from 'rxjs';
import { DynamoDBValueInput } from '../mappers/base-dynamodb.mapper';
export interface IDatabaseService {
  get<T>(
    tableName: string,
    key: Record<string, DynamoDBValueInput>,
  ): Observable<T>;
  put<T>(tableName: string, item: T): Observable<void>;
  delete(
    tableName: string,
    key: Record<string, DynamoDBValueInput>,
  ): Observable<void>;
  query<T>(
    tableName: string,
    keyConditionExpression: string,
    expressionAttributeValues: Record<string, DynamoDBValueInput>,
  ): Observable<T[]>;
  scan<T>(tableName: string): Observable<T[]>;
  update<T>(
    tableName: string,
    key: Record<string, DynamoDBValueInput>,
    updateExpression: string,
    expressionAttributeValues: Record<string, DynamoDBValueInput>,
  ): Observable<T>;
}
