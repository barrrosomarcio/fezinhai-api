import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HttpErrors } from '../../shared/errors/http-errors.filter';

@Injectable()
export class RedisService implements OnModuleInit {
  private client: Redis;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.startConnection();
  }

  private startConnection() {
    const redisHost = this.configService.get<string>('REDIS_HOST');
    const redisPort = this.configService.get<number>('REDIS_PORT');
    const redisPassword = this.configService.get<string>('REDIS_PASSWORD');

    if (!redisHost || !redisPort) {
      throw HttpErrors.internalServerError('Redis connection not configured');
    }

    this.client = new Redis({
      host: redisHost,
      port: redisPort,
      password: redisPassword,
    });

    this.client.on('error', (error) => {
      console.error('Redis connection error:', error);
    });
  }

  set(key: string, value: string, ttl?: number): Observable<string> {
    if (ttl) {
      return from(this.client.set(key, value, 'EX', ttl)).pipe(
        catchError((error) => {
          throw HttpErrors.internalServerError(`Redis error: ${error.message}`);
        }),
      );
    }

    return from(this.client.set(key, value)).pipe(
      catchError((error) => {
        throw HttpErrors.internalServerError(`Redis error: ${error.message}`);
      }),
    );
  }

  get(key: string): Observable<string | null> {
    return from(this.client.get(key)).pipe(
      catchError((error) => {
        throw HttpErrors.internalServerError(`Redis error: ${error.message}`);
      }),
    );
  }

  del(key: string): Observable<number> {
    return from(this.client.del(key)).pipe(
      catchError((error) => {
        throw HttpErrors.internalServerError(`Redis error: ${error.message}`);
      }),
    );
  }

  exists(key: string): Observable<boolean> {
    return from(this.client.exists(key)).pipe(
      map((result) => result === 1),
      catchError((error) => {
        throw HttpErrors.internalServerError(`Redis error: ${error.message}`);
      }),
    );
  }

  expire(key: string, seconds: number): Observable<boolean> {
    return from(this.client.expire(key, seconds)).pipe(
      map((result) => result === 1),
      catchError((error) => {
        throw HttpErrors.internalServerError(`Redis error: ${error.message}`);
      }),
    );
  }
}
