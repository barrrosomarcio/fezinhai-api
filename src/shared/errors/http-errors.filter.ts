import { HttpException, HttpStatus } from '@nestjs/common';

export class HttpErrors {
  static notFound(resource: string): HttpException {
    return new HttpException(
      {
        status: HttpStatus.NOT_FOUND,
        error: `O recurso ${resource} não foi encontrado`,
        code: 'NOT_FOUND',
        details: {
          resource,
          reason: 'O recurso solicitado não existe ou foi removido',
        },
      },
      HttpStatus.NOT_FOUND,
    );
  }

  static badRequest(message: string, details?: Record<string, unknown>): HttpException {
    return new HttpException(
      {
        status: HttpStatus.BAD_REQUEST,
        error: message,
        code: 'BAD_REQUEST',
        details: {
          reason: 'A requisição contém dados inválidos ou mal formatados',
          ...details,
        },
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  static unauthorized(message = 'Acesso não autorizado'): HttpException {
    return new HttpException(
      {
        status: HttpStatus.UNAUTHORIZED,
        error: message,
        code: 'UNAUTHORIZED',
        details: {
          reason: 'Credenciais ausentes ou inválidas',
          action: 'Faça login novamente ou forneça credenciais válidas',
        },
      },
      HttpStatus.UNAUTHORIZED,
    );
  }

  static forbidden(message = 'Acesso negado'): HttpException {
    return new HttpException(
      {
        status: HttpStatus.FORBIDDEN,
        error: message,
        code: 'FORBIDDEN',
        details: {
          reason: 'Usuário não tem permissão para acessar este recurso',
          action: 'Solicite acesso ao administrador do sistema',
        },
      },
      HttpStatus.FORBIDDEN,
    );
  }

  static conflict(resource: string, message: string): HttpException {
    return new HttpException(
      {
        status: HttpStatus.CONFLICT,
        error: message,
        code: 'CONFLICT',
        details: {
          resource,
          reason: 'Conflito ao tentar criar ou modificar um recurso existente',
          action: 'Verifique se o recurso já existe antes de criar',
        },
      },
      HttpStatus.CONFLICT,
    );
  }

  static internalServerError(message: string, errorId?: string): HttpException {
    const timestamp = new Date().toISOString();
    return new HttpException(
      {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Erro interno do servidor',
        code: 'INTERNAL_SERVER_ERROR',
        details: {
          message,
          errorId: errorId || timestamp,
          timestamp,
          action: 'Entre em contato com o suporte técnico informando o errorId',
        },
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  static validationError(errors: Record<string, string[]>): HttpException {
    return new HttpException(
      {
        status: HttpStatus.BAD_REQUEST,
        error: 'Erro de validação',
        code: 'VALIDATION_ERROR',
        details: {
          errors,
          reason: 'Os dados fornecidos não atendem aos critérios de validação',
          action: 'Corrija os campos com erro e tente novamente',
        },
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
