import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, HttpException } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { LotofacilController } from './lotofacil.controller';
import { LotofacilService } from './lotofacil.service';
import { SaveResultsDto } from './dto/save-results.dto';
import { HttpErrors } from '../../shared/errors/http-errors.filter';
import { DynamoDBErrors } from '../../shared/errors/database-erros.filter';
import { mockResultDto, mockSavedEntity } from './mocks/lotofacil.mocks';

describe('LotofacilController', () => {
  let controller: LotofacilController;
  let service: LotofacilService;

  const mockLotofacilService = {
    saveResults: jest.fn(),
    getLatestResult: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LotofacilController],
      providers: [
        {
          provide: LotofacilService,
          useValue: mockLotofacilService,
        },
      ],
    }).compile();

    controller = module.get<LotofacilController>(LotofacilController);
    service = module.get<LotofacilService>(LotofacilService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('saveResults', () => {
    it('should successfully save results and return entity', (done) => {
      mockLotofacilService.saveResults.mockReturnValue(of(mockSavedEntity));

      controller.saveResults(mockResultDto).subscribe({
        next: (result) => {
          expect(result).toBe(mockSavedEntity);
          expect(service.saveResults).toHaveBeenCalledWith(mockResultDto);
          done();
        },
        error: done,
      });
    });

    it('should handle validation error', (done) => {
      const validationErrors = {
        concurso: ['O número do concurso é obrigatório'],
        dezenas: ['Deve conter exatamente 15 números'],
      };

      mockLotofacilService.saveResults.mockReturnValue(
        throwError(() => HttpErrors.validationError(validationErrors)),
      );

      controller.saveResults(mockResultDto).subscribe({
        error: (error) => {
          expect(error.response).toEqual({
            status: HttpStatus.BAD_REQUEST,
            error: 'Erro de validação',
            code: 'VALIDATION_ERROR',
            details: {
              errors: validationErrors,
              reason: 'Os dados fornecidos não atendem aos critérios de validação',
              action: 'Corrija os campos com erro e tente novamente',
            },
          });
          done();
        },
      });
    });

    it('should handle DynamoDB ConditionalCheckFailedException', (done) => {
      const dbError = {
        name: 'ConditionalCheckFailedException',
        message: 'The conditional request failed',
        detail: '(Registro)',
      };

      mockLotofacilService.saveResults.mockReturnValue(
        throwError(() => DynamoDBErrors.handleError(dbError)),
      );

      controller.saveResults(mockResultDto).subscribe({
        error: (error) => {
          expect(error.response).toEqual({
            status: HttpStatus.CONFLICT,
            error: 'Registro já existe',
            code: 'CONFLICT',
            details: {
              resource: 'Registro',
              reason: 'Conflito ao tentar criar ou modificar um recurso existente',
              action: 'Verifique se o recurso já existe antes de criar',
            },
          });
          done();
        },
      });
    });

    it('should handle DynamoDB ResourceNotFoundException', (done) => {
      const dbError = {
        name: 'ResourceNotFoundException',
        message: 'Resource not found',
        detail: '(Registro)',
      };

      mockLotofacilService.saveResults.mockReturnValue(
        throwError(() => DynamoDBErrors.handleError(dbError)),
      );

      controller.saveResults(mockResultDto).subscribe({
        error: (error) => {
          expect(error.response).toEqual({
            status: HttpStatus.NOT_FOUND,
            error: 'O recurso Registro não foi encontrado',
            code: 'NOT_FOUND',
            details: {
              resource: 'Registro',
              reason: 'O recurso solicitado não existe ou foi removido',
            },
          });
          done();
        },
      });
    });

    it('should handle unknown DynamoDB error', (done) => {
      const unknownError = {
        name: 'UnknownError',
        message: 'Erro inesperado ao processar a requisição',
      };

      mockLotofacilService.saveResults.mockReturnValue(
        throwError(() => HttpErrors.badRequest(unknownError.message)),
      );

      controller.saveResults(mockResultDto).subscribe({
        error: (error) => {
          expect(error.response).toEqual({
            status: HttpStatus.BAD_REQUEST,
            error: unknownError.message,
            code: 'BAD_REQUEST',
            details: {
              reason: 'A requisição contém dados inválidos ou mal formatados',
            },
          });
          done();
        },
      });
    });

    it('should handle empty results array', (done) => {
      const emptyDto: SaveResultsDto = { results: [] };

      mockLotofacilService.saveResults.mockReturnValue(
        throwError(() => HttpErrors.badRequest('O array de resultados não pode estar vazio')),
      );

      controller.saveResults(emptyDto).subscribe({
        error: (error) => {
          expect(error.response).toEqual({
            status: HttpStatus.BAD_REQUEST,
            error: 'O array de resultados não pode estar vazio',
            code: 'BAD_REQUEST',
            details: {
              reason: 'A requisição contém dados inválidos ou mal formatados',
            },
          });
          done();
        },
      });
    });

    it('should handle internal server error', (done) => {
      const errorMessage = 'Erro ao processar os dados do concurso';
      const timestamp = new Date().toISOString();
      
      jest.spyOn(Date.prototype, 'toISOString').mockReturnValue(timestamp);

      mockLotofacilService.saveResults.mockReturnValue(
        throwError(() => HttpErrors.internalServerError(errorMessage)),
      );

      controller.saveResults(mockResultDto).subscribe({
        error: (error) => {
          expect(error.response).toEqual({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Erro interno do servidor',
            code: 'INTERNAL_SERVER_ERROR',
            details: {
              message: errorMessage,
              errorId: timestamp,
              timestamp,
              action: 'Entre em contato com o suporte técnico informando o errorId',
            },
          });
          done();
        },
      });
    });
  });

  describe('getLatestResult', () => {
    it('should successfully return the latest result', (done) => {
      mockLotofacilService.getLatestResult.mockReturnValue(of(mockSavedEntity));

      controller.getLatestResult().subscribe({
        next: (result) => {
          expect(result).toBe(mockSavedEntity);
          expect(service.getLatestResult).toHaveBeenCalled();
          done();
        },
        error: done,
      });
    });

    it('should handle not found error', (done) => {
      mockLotofacilService.getLatestResult.mockReturnValue(
        throwError(() => HttpErrors.notFound('Nenhum resultado encontrado'))
      );

      controller.getLatestResult().subscribe({
        error: (error) => {
          expect(error.response).toEqual({
            status: HttpStatus.NOT_FOUND,
            error: 'O recurso Nenhum resultado encontrado não foi encontrado',
            code: 'NOT_FOUND',
            details: {
              resource: 'Nenhum resultado encontrado',
              reason: 'O recurso solicitado não existe ou foi removido',
            },
          });
          done();
        },
      });
    });

    it('should handle internal server error', (done) => {
      const errorMessage = 'Erro ao buscar o resultado mais recente';
      const timestamp = new Date().toISOString();
      
      jest.spyOn(Date.prototype, 'toISOString').mockReturnValue(timestamp);

      mockLotofacilService.getLatestResult.mockReturnValue(
        throwError(() => HttpErrors.internalServerError(errorMessage))
      );

      controller.getLatestResult().subscribe({
        error: (error) => {
          expect(error.response).toEqual({
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Erro interno do servidor',
            code: 'INTERNAL_SERVER_ERROR',
            details: {
              message: errorMessage,
              errorId: timestamp,
              timestamp,
              action: 'Entre em contato com o suporte técnico informando o errorId',
            },
          });
          done();
        },
      });
    });
  });
}); 