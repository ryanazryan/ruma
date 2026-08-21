import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

interface ExceptionResponse {
  message?: string | string[];
  errors?: unknown[];
}

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const body =
      exception instanceof HttpException ? exception.getResponse() : undefined;

    const exceptionResponse =
      typeof body === 'object' && body !== null
        ? (body as ExceptionResponse)
        : undefined;

    const message = this.resolveMessage(body, exceptionResponse, status);

    const errors = this.resolveErrors(exceptionResponse);

    response.status(status).json({
      success: false,
      message,
      errors,
    });
  }

  private resolveMessage(
    body: string | object | undefined,
    exceptionResponse: ExceptionResponse | undefined,
    status: number,
  ): string {
    if (typeof body === 'string') {
      return body;
    }

    if (typeof exceptionResponse?.message === 'string') {
      return exceptionResponse.message;
    }

    if (status === Number(HttpStatus.UNPROCESSABLE_ENTITY)) {
      return 'Validation failed.';
    }

    return 'An unexpected error occurred.';
  }

  private resolveErrors(
    exceptionResponse: ExceptionResponse | undefined,
  ): unknown[] {
    if (exceptionResponse?.errors) {
      return exceptionResponse.errors;
    }

    return Array.isArray(exceptionResponse?.message)
      ? exceptionResponse.message
      : [];
  }
}
