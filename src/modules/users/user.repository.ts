import { Injectable } from '@nestjs/common';
import { UserEntity } from './domain/user.entity';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DatabaseTables } from 'src/infra/database/domain/database.types';
import { DatabaseService } from 'src/infra/database/database.service';
@Injectable()
export class UserRepository {
  private readonly tableName = DatabaseTables.USERS;

  constructor(private readonly databaseService: DatabaseService) {}

  findById(id: string): Observable<UserEntity | null> {
    return this.databaseService.get(this.tableName, {
      id,
    });
  }

  findByEmail(email: string): Observable<UserEntity[]> {
    return this.databaseService.query(this.tableName, 'email = :email', {
      ':email': email,
    });
  }

  save(user: UserEntity): Observable<UserEntity> {
    return this.databaseService.put(this.tableName, user).pipe(map(() => user));
  }

  update(user: UserEntity): Observable<UserEntity> {
    return this.databaseService.update(
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
    );
  }

  delete(id: string): Observable<{ success: boolean }> {
    return this.databaseService
      .delete(this.tableName, { id })
      .pipe(map(() => ({ success: true })));
  }
}
