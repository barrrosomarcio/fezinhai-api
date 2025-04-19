import { Injectable } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { RedisService } from '../redis/redis.service';
import { ICacheService } from './interfaces/cache.service.interface';

@Injectable()
export class CacheService implements ICacheService {
  constructor(private readonly redisService: RedisService) {}

  set<T>(key: string, value: T, ttl?: number): Observable<void> {
    const serializedValue = JSON.stringify(value);
    
    return this.redisService.set(key, serializedValue, ttl).pipe(
      map(() => {}),
      catchError((error) => {
        console.error(`Error setting cache key ${key}:`, error);
        return of(void 0);
      }),
    );
  }

  get<T>(key: string): Observable<T | null> {
    return this.redisService.get(key).pipe(
      map((result) => {
        if (!result) {
          return null;
        }
        
        try {
          return JSON.parse(result) as T;
        } catch (e) {
          console.error(`Error parsing cached value for key ${key}:`, e);
          return null;
        }
      }),
      catchError((error) => {
        console.error(`Error getting cache key ${key}:`, error);
        return of(null);
      }),
    );
  }

  delete(key: string): Observable<boolean> {
    return this.redisService.del(key).pipe(
      map((result) => result > 0),
      catchError((error) => {
        console.error(`Error deleting cache key ${key}:`, error);
        return of(false);
      }),
    );
  }

  exists(key: string): Observable<boolean> {
    return this.redisService.exists(key).pipe(
      catchError((error) => {
        console.error(`Error checking if cache key ${key} exists:`, error);
        return of(false);
      }),
    );
  }
}
