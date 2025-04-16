import { Observable } from 'rxjs';

export interface IDatabaseService {
  get<T>(tableName: string, key: Record<string, any>): Observable<T>;
  put<T>(tableName: string, item: T): Observable<void>;
  delete(tableName: string, key: Record<string, any>): Observable<void>;
  query<T>(tableName: string, keyConditionExpression: string, expressionAttributeValues: Record<string, any>): Observable<T[]>;
  scan<T>(tableName: string): Observable<T[]>;
  update<T>(tableName: string, key: Record<string, any>, updateExpression: string, expressionAttributeValues: Record<string, any>): Observable<T>;
} 