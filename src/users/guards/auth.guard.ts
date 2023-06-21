import { ExecutionContext, CanActivate } from '@nestjs/common';

export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest();
        return req.session?.userId;
    }
}