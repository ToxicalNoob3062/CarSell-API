import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { plainToClass } from 'class-transformer';
import { UserDto } from 'src/users/dto/user.dto';

export class SerializeInterceptor implements NestInterceptor {
    intercept(_: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(map((data => {
            return plainToClass(UserDto, data, {
                excludeExtraneousValues: true, //Tells to export prop with @Expose decorators only.
            });
        })));
    };
}