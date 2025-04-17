import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  DeleteCommand,
  QueryCommand,
  ScanCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpErrors } from '../../shared/errors/http-errors.filter';
import { DynamoDBValueInput } from '../../infra/database/mappers/base-dynamodb.mapper';
@Injectable()
export class AwsDynamoDBService implements OnModuleInit {
  private client: DynamoDBClient;
  private docClient: DynamoDBDocumentClient;

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

    this.client = new DynamoDBClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    this.docClient = DynamoDBDocumentClient.from(this.client);
  }

  get<T>(
    tableName: string,
    key: Record<string, DynamoDBValueInput>,
  ): Observable<T> {
    const command = new GetCommand({
      TableName: tableName,
      Key: key,
    });

    return from(this.docClient.send(command)).pipe(
      map((result) => result.Item as T),
      catchError((error) => {
        throw HttpErrors.internalServerError(
          `DynamoDB error: ${error.message}`,
        );
      }),
    );
  }

  put<T>(tableName: string, item: T): Observable<void> {
    const command = new PutCommand({
      TableName: tableName,
      Item: item as Record<string, DynamoDBValueInput>,
    });

    return from(this.docClient.send(command)).pipe(
      map(() => undefined),
      catchError((error) => {
        throw HttpErrors.internalServerError(
          `DynamoDB error: ${error.message}`,
        );
      }),
    );
  }

  delete(
    tableName: string,
    key: Record<string, DynamoDBValueInput>,
  ): Observable<void> {
    const command = new DeleteCommand({
      TableName: tableName,
      Key: key,
    });

    return from(this.docClient.send(command)).pipe(
      map(() => undefined),
      catchError((error) => {
        throw HttpErrors.internalServerError(
          `DynamoDB error: ${error.message}`,
        );
      }),
    );
  }

  query<T>(
    tableName: string,
    keyConditionExpression: string,
    expressionAttributeValues: Record<string, DynamoDBValueInput>,
  ): Observable<T[]> {
    const command = new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: keyConditionExpression,
      ExpressionAttributeValues: expressionAttributeValues,
    });

    return from(this.docClient.send(command)).pipe(
      map((result) => result.Items as T[]),
      catchError((error) => {
        throw HttpErrors.internalServerError(
          `DynamoDB error: ${error.message}`,
        );
      }),
    );
  }

  scan<T>(tableName: string): Observable<T[]> {
    const command = new ScanCommand({
      TableName: tableName,
    });

    return from(this.docClient.send(command)).pipe(
      map((result) => result.Items as T[]),
      catchError((error) => {
        throw HttpErrors.internalServerError(
          `DynamoDB error: ${error.message}`,
        );
      }),
    );
  }

  update<T>(
    tableName: string,
    key: Record<string, DynamoDBValueInput>,
    updateExpression: string,
    expressionAttributeValues: Record<string, DynamoDBValueInput>,
  ): Observable<T> {
    const command = new UpdateCommand({
      TableName: tableName,
      Key: key,
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    });

    return from(this.docClient.send(command)).pipe(
      map((result) => result.Attributes as T),
      catchError((error) => {
        throw HttpErrors.internalServerError(
          `DynamoDB error: ${error.message}`,
        );
      }),
    );
  }
}
