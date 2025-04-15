import { Injectable } from '@nestjs/common';
import { DynamoDBService } from '../../infra/database/dynamodb.service';
import { UserEntity } from './domain/user.entity';
import { UserMapper } from './mappers/user.mapper';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class UserRepository {
  private readonly tableName = 'Users';

  constructor(
    private readonly dynamoDBService: DynamoDBService,
    private readonly userMapper: UserMapper,
  ) {}

  findById(id: string): Observable<UserEntity | null> {
    return this.dynamoDBService.get(this.tableName, { id }, this.userMapper);
  }

  findByEmail(email: string): Observable<UserEntity[]> {
    return this.dynamoDBService.query(
      this.tableName,
      'email = :email',
      { ':email': email },
      this.userMapper,
    );
  }

  save(user: UserEntity): Observable<UserEntity> {
    return this.dynamoDBService.put(this.tableName, user, this.userMapper);
  }

  update(user: UserEntity): Observable<UserEntity | null> {
    return this.dynamoDBService.update(
      this.tableName,
      { id: user.id },
      'SET #name = :name, #email = :email, #password = :password, #isActive = :isActive, #preferences = :preferences, #updatedAt = :updatedAt',
      {
        ':name': user.name,
        ':email': user.email,
        ':password': user.password,
        ':isActive': user.isActive,
        ':preferences': user.preferences,
        ':updatedAt': user.updatedAt.toISOString(),
      },
      this.userMapper,
      {
        '#name': 'name',
        '#email': 'email',
        '#password': 'password',
        '#isActive': 'isActive',
        '#preferences': 'preferences',
        '#updatedAt': 'updatedAt',
      }
    );
  }

  delete(id: string): Observable<{ success: boolean }> {
    return this.dynamoDBService.delete(this.tableName, { id });
  }
} 