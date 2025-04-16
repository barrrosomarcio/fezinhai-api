import { Injectable, Logger, HttpException } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { UserRepository } from './user.repository';
import { UserEntity } from './domain/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserPreferencesDto } from './dto/update-user-preferences.dto';
import { map, switchMap, catchError } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { HttpErrors } from '../../shared/errors/http-errors.filter';
import { DynamoDBErrors } from '../../shared/errors/database-erros.filter';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(private readonly userRepository: UserRepository) {}

  private handleError(error: any): Observable<never> {
    if (error.name && DynamoDBErrors.ErrorCodes[error.name]) {
      this.logger.error('DynamoDB Error occurred:', {
        error: error.message,
        name: error.name
      });
      return throwError(() => DynamoDBErrors.handleError(error));
    }

    if (error instanceof HttpException) {
      return throwError(() => error);
    }

    this.logger.error('Error occurred:', {
      error: error.message,
      name: error.name
    });
    return throwError(() => HttpErrors.badRequest(error.message || 'An unexpected error occurred'));
  }

  create(createUserDto: CreateUserDto): Observable<UserEntity> {
    const user = UserEntity.create({
      email: createUserDto.email,
      name: createUserDto.name,
      password: createUserDto.password,
      preferences: createUserDto.preferences ?? { theme: 'light', notifications: true },
    });
    return this.userRepository.save(user).pipe(
      catchError(error => this.handleError(error))
    );
  }

  findOne(id: string): Observable<UserEntity> {
    return this.userRepository.findById(id).pipe(
      map(user => {
        if (!user) throw HttpErrors.notFound(`User with ID ${id} not found`);
        return user;
      }),
      catchError(error => this.handleError(error))
    );
  }

  findByEmail(email: string): Observable<UserEntity> {
    return this.userRepository.findByEmail(email).pipe(
      map(users => {
        if (!users.length) throw HttpErrors.notFound(`User with email ${email} not found`);
        return users[0];
      }),
      catchError(error => this.handleError(error))
    );
  }

  update(id: string, updateUserDto: UpdateUserDto): Observable<UserEntity> {
    return this.userRepository.findById(id).pipe(
      map(user => {
        if (!user) throw HttpErrors.notFound(`User with ID ${id} not found`);
        return user;
      }),
      switchMap(user => {
        if (updateUserDto.email) {
          user.email = updateUserDto.email;
        }
        if (updateUserDto.name) {
          user.name = updateUserDto.name;
        }
        if (updateUserDto.password) {
          user.password = updateUserDto.password;
        }
        return this.userRepository.update(user).pipe(
          map(updatedUser => {
            if (!updatedUser) throw HttpErrors.notFound(`Failed to update user with ID ${id}`);
            return updatedUser;
          })
        );
      }),
      catchError(error => this.handleError(error))
    );
  }

  updatePreferences(id: string, preferencesDto: UpdateUserPreferencesDto): Observable<UserEntity> {
    return this.userRepository.findById(id).pipe(
      map(user => {
        if (!user) throw HttpErrors.notFound(`User with ID ${id} not found`);
        return user;
      }),
      switchMap(user => {
        const currentPreferences = user.preferences;
        const updatedPreferences = {
          theme: preferencesDto.theme ?? currentPreferences.theme,
          notifications: preferencesDto.notifications ?? currentPreferences.notifications,
        };
        user.preferences = updatedPreferences;
        return this.userRepository.update(user).pipe(
          map(updatedUser => {
            if (!updatedUser) throw HttpErrors.notFound(`Failed to update user preferences with ID ${id}`);
            return updatedUser;
          })
        );
      }),
      catchError(error => this.handleError(error))
    );
  }

  remove(id: string): Observable<{ success: boolean }> {
    return this.userRepository.findById(id).pipe(
      map(user => {
        if (!user) throw HttpErrors.notFound(`User with ID ${id} not found`);
        return user;
      }),
      switchMap(() => this.userRepository.delete(id)),
      catchError(error => this.handleError(error))
    );
  }

  deactivate(id: string): Observable<UserEntity> {
    return this.userRepository.findById(id).pipe(
      map(user => {
        if (!user) throw HttpErrors.notFound(`User with ID ${id} not found`);
        return user;
      }),
      switchMap(user => {
        user.isActive = false;
        return this.userRepository.update(user).pipe(
          map(updatedUser => {
            if (!updatedUser) throw HttpErrors.notFound(`Failed to deactivate user with ID ${id}`);
            return updatedUser;
          })
        );
      }),
      catchError(error => this.handleError(error))
    );
  }

  activate(id: string): Observable<UserEntity> {
    return this.userRepository.findById(id).pipe(
      map(user => {
        if (!user) throw HttpErrors.notFound(`User with ID ${id} not found`);
        return user;
      }),
      switchMap(user => {
        user.isActive = true;
        return this.userRepository.update(user).pipe(
          map(updatedUser => {
            if (!updatedUser) throw HttpErrors.notFound(`Failed to activate user with ID ${id}`);
            return updatedUser;
          })
        );
      }),
      catchError(error => this.handleError(error))
    );
  }
} 