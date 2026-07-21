import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, tap } from 'rxjs';

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  private readonly logger: Logger = new Logger(RequestLoggingInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const className: string = context.getClass().name;
    const methodName: string = context.getHandler().name;
    const request: any = context.switchToHttp().getRequest();

    const params: string = JSON.stringify(request.params);
    const body: string = request.body ? JSON.stringify(request.body) : 'none';

    // Логировать тело запроса - небезопасно!
    // Потому что тело запроса может содержать секреты
    // либо может быть просто очень большим.
    // В нашем конкретном примере следовало бы отказаться от логирования тела,
    // потому что сюда будут попадать пароли пользователей.
    // Но в качестве учебного примера - оставим.
    this.logger.debug(
      `${className}.${methodName} called with params: ${params} and body: ${body}`,
    );

    const startedAt: number = Date.now();

    return next.handle().pipe(
      tap((): void => {
        this.logger.debug(
          `${className}.${methodName} returned result in ${Date.now() - startedAt} ms`,
        );
      }),
      catchError((error: any): never => {
        this.logger.warn(
          `${className}.${methodName} threw error: ${error.message} in ${Date.now() - startedAt} ms`,
        );
        throw error;
      }),
    );
  }
}
