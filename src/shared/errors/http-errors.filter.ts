import { HttpException, HttpStatus } from '@nestjs/common';

export class HttpErrors {
    static notFound(resource: string): HttpException {
        return new HttpException({
            status: HttpStatus.NOT_FOUND,
            error: `${resource} not found`,
            code: 'NOT_FOUND'
        }, HttpStatus.NOT_FOUND);
    }

    static badRequest(message: string): HttpException {
        return new HttpException({
            status: HttpStatus.BAD_REQUEST,
            error: message,
            code: 'BAD_REQUEST'
        }, HttpStatus.BAD_REQUEST);
    }

    static unauthorized(message = 'Unauthorized'): HttpException {
        return new HttpException({
            status: HttpStatus.UNAUTHORIZED,
            error: message,
            code: 'UNAUTHORIZED'
        }, HttpStatus.UNAUTHORIZED);
    }

    static forbidden(message = 'Forbidden'): HttpException {
        return new HttpException({
            status: HttpStatus.FORBIDDEN,
            error: message,
            code: 'FORBIDDEN'
        }, HttpStatus.FORBIDDEN);
    }

    static conflict(message: string): HttpException {
        return new HttpException({
            status: HttpStatus.CONFLICT,
            error: message,
            code: 'CONFLICT'
        }, HttpStatus.CONFLICT);
    }
} 