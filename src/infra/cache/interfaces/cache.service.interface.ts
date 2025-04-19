import { Observable } from 'rxjs';

export interface ICacheService {
  set<T>(key: string, value: T, ttl?: number): Observable<void>;

  get<T>(key: string): Observable<T | null>;

  delete(key: string): Observable<boolean>;

  exists(key: string): Observable<boolean>;
} 