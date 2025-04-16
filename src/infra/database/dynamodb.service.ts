import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, DeleteCommand, QueryCommand, ScanCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { Observable, defer, of, throwError } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { DynamoDBString } from './types/dynamodb-attribute.types';
import { BaseEntity } from './interfaces/base-entity.interface';

@Injectable()
export class DynamoDBService implements OnModuleInit {
  private client: DynamoDBClient;
  private docClient: DynamoDBDocumentClient;
  private readonly logger = new Logger(DynamoDBService.name);

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.startConnection();
  }

  private startConnection(): void {
    try {
      const databaseConfig = this.configService.get('database');      
      if (!databaseConfig.credentials.accessKeyId || !databaseConfig.credentials.secretAccessKey) {
        throw new Error('AWS credentials are not configured');
      }

      this.client = new DynamoDBClient(databaseConfig);
      this.docClient = DynamoDBDocumentClient.from(this.client);
      this.logger.log('DynamoDBService initialized');
    } catch (error) {
      this.logger.error('Error connecting to DynamoDB:', error);
      throw error;
    }
  }

  private formatKey(key: Record<string, any>): Record<string, DynamoDBString> {
    return Object.entries(key).reduce((acc, [k, v]) => {
      acc[k] = { S: String(v) };
      return acc;
    }, {} as Record<string, DynamoDBString>);
  }

  get(tableName: string, key: Record<string, any>): Observable<Record<string, any> | null> {
    return defer(() => 
      of(new GetCommand({
        TableName: tableName,
        Key: this.formatKey(key),
      })).pipe(
        mergeMap(getCommand => this.docClient.send(getCommand)),
        map(response => response.Item || null),
        catchError(error => throwError(() => error))
      )
    );
  }

  put<T extends BaseEntity>(tableName: string, item: T): Observable<void> {
    return defer(() => 
      of(new PutCommand({
        TableName: tableName,
        Item: item,
      })).pipe(
        mergeMap(putCommand => this.docClient.send(putCommand)),
        map(() => undefined),
        catchError(error => throwError(() => error))
      )
    );
  }

  delete(tableName: string, key: Record<string, any>): Observable<void> {
    return defer(() => 
      of(new DeleteCommand({
        TableName: tableName,
        Key: this.formatKey(key),
      })).pipe(
        mergeMap(deleteCommand => this.docClient.send(deleteCommand)),
        map(() => undefined),
        catchError(error => throwError(() => error))
      )
    );
  }

  query(
    tableName: string,
    keyConditionExpression: string,
    expressionAttributeValues: Record<string, any>,
    filterExpression?: string,
    limit?: number,
  ): Observable<Record<string, any>[]> {
    return defer(() => 
      of(new QueryCommand({
        TableName: tableName,
        KeyConditionExpression: keyConditionExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        FilterExpression: filterExpression,
        Limit: limit,
      })).pipe(
        mergeMap(queryCommand => this.docClient.send(queryCommand)),
        map(response => response.Items || []),
        catchError(error => throwError(() => error))
      )
    );
  }

  scan(
    tableName: string,
    filterExpression?: string,
    expressionAttributeValues?: Record<string, any>,
    limit?: number,
  ): Observable<Record<string, any>[]> {
    return defer(() => 
      of(new ScanCommand({
        TableName: tableName,
        FilterExpression: filterExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        Limit: limit,
      })).pipe(
        mergeMap(scanCommand => this.docClient.send(scanCommand)),
        map(response => response.Items || []),
        catchError(error => throwError(() => error))
      )
    );
  }

  update(
    tableName: string,
    key: Record<string, any>,
    updateExpression: string,
    expressionAttributeValues: Record<string, any>,
    expressionAttributeNames?: Record<string, string>
  ): Observable<Record<string, any> | null> {
    return defer(() => 
      of(new UpdateCommand({
        TableName: tableName,
        Key: this.formatKey(key),
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        ExpressionAttributeNames: expressionAttributeNames,
        ReturnValues: 'ALL_NEW',
      })).pipe(
        mergeMap(updateCommand => this.docClient.send(updateCommand)),
        map(response => response.Attributes || null),
        catchError(error => throwError(() => error))
      )
    );
  }
} 