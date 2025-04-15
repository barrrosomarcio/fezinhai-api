import { BaseDynamoDBMapper } from '../../../infra/database/mappers/base-dynamodb.mapper';
import { UserEntity, UserPreferences } from '../domain/user.entity';
import { DynamoDBAttributeMap } from '../../../infra/database/types/dynamodb-attribute.types';

export class UserMapper extends BaseDynamoDBMapper<UserEntity> {
  toEntity(item: DynamoDBAttributeMap): UserEntity {
    const mappedItem = this.mapFromDynamoDBValue({ M: item }) as any;
    
    return new UserEntity({
      id: mappedItem.id,
      email: mappedItem.email,
      name: mappedItem.name,
      password: mappedItem.password,
      preferences: mappedItem.preferences as UserPreferences,
      isActive: mappedItem.isActive,
      deletedAt: mappedItem.deletedAt ? new Date(mappedItem.deletedAt) : undefined,
      createdAt: new Date(mappedItem.createdAt),
      updatedAt: new Date(mappedItem.updatedAt),
    });
  }

  toDynamoDB(entity: UserEntity): DynamoDBAttributeMap {
    return {
      id: this.mapToDynamoDBValue(entity.id),
      email: this.mapToDynamoDBValue(entity.email),
      name: this.mapToDynamoDBValue(entity.name),
      password: this.mapToDynamoDBValue(entity.password),
      isActive: this.mapToDynamoDBValue(entity.isActive),
      preferences: this.mapToDynamoDBValue(entity.preferences),
      createdAt: this.mapToDynamoDBValue(entity.createdAt.toISOString()),
      updatedAt: this.mapToDynamoDBValue(entity.updatedAt.toISOString()),
      ...(entity.deletedAt && { deletedAt: this.mapToDynamoDBValue(entity.deletedAt.toISOString()) }),
    };
  }
} 