import { HttpException } from '@nestjs/common';
import { HttpErrors } from './http-errors.filter';

export class DynamoDBErrors {
    static readonly ErrorCodes = {
        CONDITIONAL_CHECK_FAILED: 'ConditionalCheckFailedException',
        RESOURCE_NOT_FOUND: 'ResourceNotFoundException',
        PROVISIONED_THROUGHPUT_EXCEEDED: 'ProvisionedThroughputExceededException',
        REQUEST_LIMIT_EXCEEDED: 'RequestLimitExceeded',
        ITEM_SIZE_TOO_LARGE: 'ItemSizeTooLarge',
        TABLE_NOT_FOUND: 'TableNotFoundException',
        VALIDATION_EXCEPTION: 'ValidationException',
        INTERNAL_SERVER_ERROR: 'InternalServerError'
    } as const;

    static handleError(error: any): HttpException {
        switch (error.name) {
            case this.ErrorCodes.CONDITIONAL_CHECK_FAILED:
                return HttpErrors.conflict(this.extractFieldFromError(error));
            case this.ErrorCodes.RESOURCE_NOT_FOUND:
                return HttpErrors.notFound(this.extractFieldFromError(error));
            case this.ErrorCodes.PROVISIONED_THROUGHPUT_EXCEEDED:
                return HttpErrors.badRequest('Request rate too high. Please try again later');
            case this.ErrorCodes.REQUEST_LIMIT_EXCEEDED:
                return HttpErrors.badRequest('Request limit exceeded. Please try again later');
            case this.ErrorCodes.ITEM_SIZE_TOO_LARGE:
                return HttpErrors.badRequest('Item size exceeds the maximum allowed size');
            case this.ErrorCodes.TABLE_NOT_FOUND:
                return HttpErrors.notFound('The specified table was not found');
            case this.ErrorCodes.VALIDATION_EXCEPTION:
                return HttpErrors.badRequest(this.extractValidationMessage(error));
            case this.ErrorCodes.INTERNAL_SERVER_ERROR:
                return HttpErrors.badRequest('Database error');
            default:
                return HttpErrors.badRequest('Database error');
        }
    }

    private static extractFieldFromError(error: any): string {
        // Extrai o nome do campo do detalhe do erro
        const detail = error.detail || '';
        const match = detail.match(/\((.*?)\)/);
        return match ? match[1] : 'field';
    }

    private static extractValidationMessage(error: any): string {
        if (error.message) {
            return error.message;
        }
        return 'Invalid request parameters';
    }
} 