import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GenerateUUID } from '../utils';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const now = Date.now();
    const xRequestId = GenerateUUID(20);
    Logger.log(`Incoming Request[#${xRequestId}] ${req.method}: ${req.path}`);

    return next.handle().pipe(
      tap(() => {
        Logger.log(`Finished Request[#${xRequestId}] in ${Date.now() - now}ms`);
      }),
    );
  }
}
