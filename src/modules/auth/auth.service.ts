import { Injectable, HttpException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { from, Observable, throwError } from 'rxjs';
import { map, catchError, mergeMap } from 'rxjs/operators';
import { UserService } from '../users/user.service';
import { LoginDto, RegisterDto, AuthResponseDto } from './dto/auth.dto';
import { UserEntity } from '../users/domain/user.entity';
import { HttpErrors } from '../../shared/errors/http-errors.filter';
import { DynamoDBErrors } from '../../shared/errors/database-erros.filter';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  private handleError(error: any): Observable<never> {
    this.logger.error('Error occurred:', {
      error: error.message,
      name: error.name
    });

    if (error.name && DynamoDBErrors.ErrorCodes[error.name]) {
      return throwError(() => DynamoDBErrors.handleError(error));
    }
    return throwError(() => HttpErrors.badRequest(error.message || 'An unexpected error occurred'));
  }

  private generateToken(user: UserEntity): Observable<any> {
    return from(this.jwtService.sign({
        sub: user.id,
        email: user.email,
        name: user.name
    })).pipe(
        map(token => ({ token, user })),
        catchError(error => {
          this.logger.error('Error generating token:', {
            userId: user.id,
            error: error.message
          });
          return throwError(() => error);
        })
    );
  }

  private mapToAuthResponse(user: UserEntity, token: string): AuthResponseDto {
    return {
      accessToken: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
        preferences: user.preferences,
      },
    };
  }

  register(registerDto: RegisterDto): Observable<AuthResponseDto> {
    return this.userService.create(registerDto as CreateUserDto).pipe(
      mergeMap(user => this.generateToken(user)),
      map(({ user, token }) => this.mapToAuthResponse(user, token)),
      catchError(error => this.handleError(error))
    );
  }

  login(loginDto: LoginDto): Observable<AuthResponseDto> {
    this.logger.log('Login attempt:', { email: loginDto.email });
    return this.userService.findByEmail(loginDto.email).pipe(
      mergeMap(user => {
        if (!user.isActive) {
          this.logger.warn('Login attempt for inactive user:', { email: loginDto.email });
          throw HttpErrors.unauthorized('User is not active');
        }
        if (user.password !== loginDto.password) {
          this.logger.warn('Invalid credentials:', { email: loginDto.email });
          throw HttpErrors.unauthorized('Invalid credentials');
        }
        return this.generateToken(user);
      }),
      map(({ user, token }) => this.mapToAuthResponse(user, token)),
      catchError(error => this.handleError(error))
    );
  }
} 