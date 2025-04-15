import { BaseEntity } from '../interfaces/base-entity.interface';
import { DynamoDBAttributeMap, DynamoDBValue } from '../types/dynamodb-attribute.types';

export abstract class BaseDynamoDBMapper<T extends BaseEntity> {
  abstract toEntity(item: DynamoDBAttributeMap): T;
  abstract toDynamoDB(entity: T): DynamoDBAttributeMap;

  protected mapToDynamoDBValue(value: any): DynamoDBValue {
    if (value === null || value === undefined) {
      return { NULL: true };
    }

    if (typeof value === 'string') {
      return { S: value };
    }

    if (typeof value === 'number') {
      return { N: value.toString() };
    }

    if (typeof value === 'boolean') {
      return { BOOL: value };
    }

    if (value instanceof Date) {
      return { S: value.toISOString() };
    }

    if (Buffer.isBuffer(value)) {
      return { B: value };
    }

    if (Array.isArray(value)) {
      if (value.every(item => typeof item === 'string')) {
        return { SS: value as string[] };
      }
      if (value.every(item => typeof item === 'number')) {
        return { NS: value.map(n => n.toString()) };
      }
      if (value.every(item => Buffer.isBuffer(item))) {
        return { BS: value as Buffer[] };
      }
      return { L: value.map(item => this.mapToDynamoDBValue(item)) };
    }

    if (typeof value === 'object') {
      const mappedObject: Record<string, DynamoDBValue> = {};
      for (const [key, val] of Object.entries(value)) {
        mappedObject[key] = this.mapToDynamoDBValue(val);
      }
      return { M: mappedObject };
    }

    throw new Error(`Unsupported type for DynamoDB mapping: ${typeof value}`);
  }

  protected mapFromDynamoDBValue(value: DynamoDBValue): any {
    if ('NULL' in value) {
      return null;
    }

    if ('S' in value) {
      return value.S;
    }

    if ('N' in value) {
      return Number(value.N);
    }

    if ('BOOL' in value) {
      return value.BOOL;
    }

    if ('B' in value) {
      return value.B;
    }

    if ('SS' in value) {
      return value.SS;
    }

    if ('NS' in value) {
      return value.NS.map(n => Number(n));
    }

    if ('BS' in value) {
      return value.BS;
    }

    if ('L' in value) {
      return value.L.map(item => this.mapFromDynamoDBValue(item));
    }

    if ('M' in value) {
      const mappedObject: Record<string, any> = {};
      for (const [key, val] of Object.entries(value.M)) {
        mappedObject[key] = this.mapFromDynamoDBValue(val);
      }
      return mappedObject;
    }

    throw new Error(`Unsupported DynamoDB value type: ${JSON.stringify(value)}`);
  }
} 