import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

@Catch()
export class GlobalExceptionHandler implements ExceptionFilter {
  private readonly logger: Logger = new Logger(GlobalExceptionHandler.name);

  catch(exception: any, host: ArgumentsHost): void {
    const context: HttpArgumentsHost = host.switchToHttp();
    const request: any = context.getRequest();
    const response: any = context.getResponse();

    let status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
      this.logger.warn(message);
    } else {
      this.logger.error(exception.stack);
    }

    response.status(status).json({
      timestamp: new Date().toISOString(),
      path: request.url,
      status,
      message,
    });
  }
}
