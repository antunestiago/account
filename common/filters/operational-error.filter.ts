import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { Request, Response } from 'express';

export enum ErrorType {
  DataValidationError = 1,
  BusinessRuleError = 2,
  NotFoundError = 3,
}

export class OperationalError extends Error {
  constructor(readonly errorType: ErrorType, readonly errors: string[]) {
    super(errors?.join(", "));
  }
}

export class DataValidationError extends OperationalError {
  constructor(errors: string[]) {
    super(ErrorType.DataValidationError, errors);
  }
}

export class NotFoundError extends OperationalError {
  constructor(errors: string[]) {
    super(ErrorType.NotFoundError, errors);
  }
}

export class BusinessRuleError extends OperationalError {
  constructor(errors: string[]) {
    super(ErrorType.BusinessRuleError, errors);
  }
}

@Catch(OperationalError)
export class OperationalErrorFilter implements ExceptionFilter {
  private readonly errorMap: Map<ErrorType, HttpStatus> = new Map()
    .set(ErrorType.DataValidationError, HttpStatus.BAD_REQUEST)
    .set(ErrorType.BusinessRuleError, HttpStatus.BAD_REQUEST)
    .set(ErrorType.NotFoundError, HttpStatus.NOT_FOUND);

  catch(error: OperationalError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = this.resolveStatus(error);

    response
      .status(status)
      .json({
        statusCode: status,
        errors: error.errors,
      });
  }

  private resolveStatus(error: OperationalError): HttpStatus {
    const status = this.errorMap.get(error.errorType);
    return status ?? HttpStatus.INTERNAL_SERVER_ERROR;
  }
}