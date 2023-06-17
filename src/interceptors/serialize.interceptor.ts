import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { plainToClass } from 'class-transformer';
import { Class } from 'src/custom.types';

export class SerializeInterceptor implements NestInterceptor {
    constructor(private dto: Class) { }
    intercept(_: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(map((data => {
            return plainToClass(this.dto, data, {
                excludeExtraneousValues: true, //Tells to export prop with @Expose decorators only.
            });
        })));
    };
}