import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DatabaseTables } from '../../infra/database/domain/database.types';
import { DatabaseService } from '../../infra/database/database.service';
import { LotofacilResultsEntity } from './domain/lotofacil-results.entity';

@Injectable()
export class LotofacilRepository {
  private readonly tableName = DatabaseTables.LOTOFACIL_CONCURSOS;

  constructor(private readonly databaseService: DatabaseService) {}

  save(results: LotofacilResultsEntity): Observable<LotofacilResultsEntity> {
    return this.databaseService
      .put(this.tableName, results)
      .pipe(map(() => results));
  }
} 