import { Injectable, HttpException, Logger } from '@nestjs/common';
import { Observable, throwError, from, mergeMap, toArray } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LotofacilRepository } from './lotofacil.repository';
import { LotofacilResultsEntity } from './domain/lotofacil-results.entity';
import { SaveResultsDto } from './dto/save-results.dto';
import { HttpErrors } from '../../shared/errors/http-errors.filter';
import { DynamoDBError, DynamoDBErrors } from '../../shared/errors/database-erros.filter';

@Injectable()
export class LotofacilService {
  private logger = new Logger(LotofacilService.name);

  constructor(private readonly repository: LotofacilRepository) {}

  private handleError(error: DynamoDBError): Observable<never> {
    this.logger.error('Error occurred:', {
      error: error.message,
      name: error.name,
    });

    if (error instanceof HttpException) {
      return throwError(() => error);
    }

    if (error.name && DynamoDBErrors.ErrorCodes[error.name]) {
      return throwError(() => DynamoDBErrors.handleError(error));
    }

    return throwError(() =>
      HttpErrors.badRequest(error.message || 'An unexpected error occurred'),
    );
  }

  saveResults(dto: SaveResultsDto): Observable<LotofacilResultsEntity[]> {
    this.logger.log('Saving lotofacil results');
    return from(dto.results).pipe(
      mergeMap((result) => {
        const entity = LotofacilResultsEntity.create({
          concurso: result.concurso,
          data: result.data,
          dezenas: result.dezenas,
          premiacoes: result.premiacoes,
          acumulou: result.acumulou,
          acumuladaProxConcurso: result.acumuladaProxConcurso,
          dataProxConcurso: result.dataProxConcurso,
          proxConcurso: result.proxConcurso,
          timeCoracao: result.timeCoracao,
          mesSorte: result.mesSorte,
        });
        return this.repository.save(entity);
      }),
      toArray(),
      catchError((error) => this.handleError(error)),
    );
  }

  getLatestResult(): Observable<LotofacilResultsEntity> {
    this.logger.log('Getting latest lotofacil result');
    return this.repository.getLatest().pipe(
      map((result) => {
        if (!result) {
          throw HttpErrors.notFound('Nenhum resultado encontrado');
        }
        return result;
      }),
      catchError((error) => this.handleError(error)),
    );
  }
} 