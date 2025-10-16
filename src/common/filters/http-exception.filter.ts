import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name)

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const payload = {
      statusCode: status,
      path: request.url,
      timestamp: new Date().toISOString(),
      message: exception.getResponse(),
    }

    this.logger.error(`[${request.method}] ${request.url}`, String(exception));
    response.status(status).send(payload);
  }
}