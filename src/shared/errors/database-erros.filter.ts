import { HttpException } from '@nestjs/common';
import { HttpErrors } from './http-errors.filter';

// Interface para erros do DynamoDB
export interface DynamoDBError extends Error {
  name: string;
  message: string;
  detail?: string;
  code?: string;
}

export class DynamoDBErrors {
  static readonly ErrorCodes = {
    CONDITIONAL_CHECK_FAILED: 'ConditionalCheckFailedException',
    RESOURCE_NOT_FOUND: 'ResourceNotFoundException',
    PROVISIONED_THROUGHPUT_EXCEEDED: 'ProvisionedThroughputExceededException',
    REQUEST_LIMIT_EXCEEDED: 'RequestLimitExceeded',
    ITEM_SIZE_TOO_LARGE: 'ItemSizeTooLarge',
    TABLE_NOT_FOUND: 'TableNotFoundException',
    VALIDATION_EXCEPTION: 'ValidationException',
    INTERNAL_SERVER_ERROR: 'InternalServerError',
  } as const;

  static handleError(error: DynamoDBError): HttpException {
    const field = this.extractFieldFromError(error);
    
    switch (error.name) {
      case this.ErrorCodes.CONDITIONAL_CHECK_FAILED:
        return HttpErrors.conflict(field, `${field} já existe`);
      case this.ErrorCodes.RESOURCE_NOT_FOUND:
        return HttpErrors.notFound(field);
      case this.ErrorCodes.PROVISIONED_THROUGHPUT_EXCEEDED:
        return HttpErrors.badRequest(
          'Taxa de requisições muito alta. Tente novamente mais tarde',
        );
      case this.ErrorCodes.REQUEST_LIMIT_EXCEEDED:
        return HttpErrors.badRequest(
          'Limite de requisições excedido. Tente novamente mais tarde',
        );
      case this.ErrorCodes.ITEM_SIZE_TOO_LARGE:
        return HttpErrors.badRequest(
          'Tamanho do item excede o máximo permitido',
        );
      case this.ErrorCodes.TABLE_NOT_FOUND:
        return HttpErrors.notFound('Tabela especificada não encontrada');
      case this.ErrorCodes.VALIDATION_EXCEPTION:
        return HttpErrors.badRequest(this.extractValidationMessage(error));
      case this.ErrorCodes.INTERNAL_SERVER_ERROR:
        return HttpErrors.badRequest('Erro no banco de dados');
      default:
        return HttpErrors.badRequest('Erro no banco de dados');
    }
  }

  private static extractFieldFromError(error: DynamoDBError): string {
    // Extrai o nome do campo do detalhe do erro
    const detail = error.detail || '';
    const match = detail.match(/\((.*?)\)/);
    return match ? match[1] : 'Registro';
  }

  private static extractValidationMessage(error: DynamoDBError): string {
    if (error.message) {
      return error.message;
    }
    return 'Parâmetros da requisição inválidos';
  }
}
