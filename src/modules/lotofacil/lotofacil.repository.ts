import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DatabaseTables } from '../../infra/database/domain/database.types';
import { DatabaseService } from '../../infra/database/database.service';
import { LotofacilResultsEntity } from './domain/lotofacil-results.entity';
import { HttpErrors } from '../../shared/errors/http-errors.filter';

@Injectable()
export class LotofacilRepository {
  private readonly tableName = DatabaseTables.LOTOFACIL_CONCURSOS;

  constructor(private readonly databaseService: DatabaseService) {}

  save(results: LotofacilResultsEntity): Observable<LotofacilResultsEntity> {
    return this.databaseService
      .put(this.tableName, results)
      .pipe(map(() => results));
  }

  // TODO: Melhorar configuração da tabela e indices para melhoria de performance dessa query.
  getLatest(): Observable<LotofacilResultsEntity> {
    return this.databaseService
      .scan<LotofacilResultsEntity>(this.tableName)
      .pipe(
        map((results) => {
          if (!results || results.length === 0) {
            throw HttpErrors.notFound('Nenhum resultado encontrado');
          }
          return results.sort((a, b) => b.concurso - a.concurso)[0];
        }),
      );
  }
}
