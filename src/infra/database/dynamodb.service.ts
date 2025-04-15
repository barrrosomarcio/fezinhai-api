import { Injectable, HttpException } from '@nestjs/common';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, DeleteCommand, QueryCommand, ScanCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { databaseConfig } from './database.config';
import { Observable, defer, of, throwError } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { BaseDynamoDBMapper } from './mappers/base-dynamodb.mapper';
import { BaseEntity } from './interfaces/base-entity.interface';
import { DynamoDBErrors } from '../../shared/errors/database-erros.filter';

@Injectable()
export class DynamoDBService {
  private readonly client: DynamoDBClient;
  private readonly docClient: DynamoDBDocumentClient;

  constructor() {
    this.client = new DynamoDBClient(databaseConfig);
    this.docClient = DynamoDBDocumentClient.from(this.client);
  }

  private handleError(error: any): Observable<never> {
    if (error instanceof HttpException) {
      return throwError(() => error);
    }
    const httpException = DynamoDBErrors.handleError(error);
    return throwError(() => httpException);
  }

  get<T extends BaseEntity>(tableName: string, key: Record<string, any>, mapper: BaseDynamoDBMapper<T>): Observable<T | null> {
    return defer(() => 
      of(new GetCommand({
        TableName: tableName,
        Key: key,
      })).pipe(
        mergeMap(getCommand => this.docClient.send(getCommand)),
        map(response => {
          if (!response.Item) return null;
          return mapper.toEntity(response.Item);
        }),
        catchError(error => this.handleError(error))
      )
    );
  }

  put<T extends BaseEntity>(tableName: string, entity: T, mapper: BaseDynamoDBMapper<T>): Observable<T> {
    return defer(() => 
      of(new PutCommand({
        TableName: tableName,
        Item: mapper.toDynamoDB(entity),
      })).pipe(
        mergeMap(putCommand => this.docClient.send(putCommand)),
        map(() => entity),
        catchError(error => this.handleError(error))
      )
    );
  }

  delete(tableName: string, key: Record<string, any>): Observable<{ success: boolean }> {
    return defer(() => 
      of(new DeleteCommand({
        TableName: tableName,
        Key: key,
      })).pipe(
        mergeMap(deleteCommand => this.docClient.send(deleteCommand)),
        map(() => ({ success: true })),
        catchError(error => this.handleError(error))
      )
    );
  }

  query<T extends BaseEntity>(
    tableName: string,
    keyConditionExpression: string,
    expressionAttributeValues: Record<string, any>,
    mapper: BaseDynamoDBMapper<T>,
    filterExpression?: string,
    limit?: number,
  ): Observable<T[]> {
    return defer(() => 
      of(new QueryCommand({
        TableName: tableName,
        KeyConditionExpression: keyConditionExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        FilterExpression: filterExpression,
        Limit: limit,
      })).pipe(
        mergeMap(queryCommand => this.docClient.send(queryCommand)),
        map(response => (response.Items || []).map(item => mapper.toEntity(item))),
        catchError(error => this.handleError(error))
      )
    );
  }

  scan<T extends BaseEntity>(
    tableName: string,
    mapper: BaseDynamoDBMapper<T>,
    filterExpression?: string,
    expressionAttributeValues?: Record<string, any>,
    limit?: number,
  ): Observable<T[]> {
    return defer(() => 
      of(new ScanCommand({
        TableName: tableName,
        FilterExpression: filterExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        Limit: limit,
      })).pipe(
        mergeMap(scanCommand => this.docClient.send(scanCommand)),
        map(response => (response.Items || []).map(item => mapper.toEntity(item))),
        catchError(error => this.handleError(error))
      )
    );
  }

  update<T extends BaseEntity>(
    tableName: string,
    key: Record<string, any>,
    updateExpression: string,
    expressionAttributeValues: Record<string, any>,
    mapper: BaseDynamoDBMapper<T>,
    expressionAttributeNames?: Record<string, string>
  ): Observable<T | null> {
    return defer(() => 
      of(new UpdateCommand({
        TableName: tableName,
        Key: key,
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        ExpressionAttributeNames: expressionAttributeNames,
        ReturnValues: 'ALL_NEW',
      })).pipe(
        mergeMap(updateCommand => this.docClient.send(updateCommand)),
        map(response => {
          if (!response.Attributes) return null;
          return mapper.toEntity(response.Attributes);
        }),
        catchError(error => this.handleError(error))
      )
    );
  }
} 