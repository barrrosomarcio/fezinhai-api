import { Injectable } from '@nestjs/common';
import { DynamoDBService } from '../../infra/database/dynamodb.service';
import { UserEntity } from './domain/user.entity';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DatabaseTables } from 'src/infra/database/domain/database.types';

@Injectable()
export class UserRepository {
  private readonly tableName = DatabaseTables.USERS;

  constructor(
    private readonly dynamoDBService: DynamoDBService,
  ) {}

  findById(id: string): Observable<UserEntity | null> {
    return this.dynamoDBService.get(this.tableName, { id }) as Observable<UserEntity | null>;
  }

  findByEmail(email: string): Observable<UserEntity[]> {
    return this.dynamoDBService.query(
      this.tableName,
      'email = :email',
      { ':email': email }
    ) as Observable<UserEntity[]>;
  }

  save(user: UserEntity): Observable<UserEntity> {
    return this.dynamoDBService.put(this.tableName, user).pipe(
      map(() => user)
    );
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
        ':updatedAt': user.updatedAt,
      },
      {
        '#name': 'name',
        '#email': 'email',
        '#password': 'password',
        '#isActive': 'isActive',
        '#preferences': 'preferences',
        '#updatedAt': 'updatedAt',
      }
    ) as Observable<UserEntity | null>;
  }

  delete(id: string): Observable<{ success: boolean }> {
    return this.dynamoDBService.delete(this.tableName, { id }).pipe(
      map(() => ({ success: true }))
    );
  }
} 