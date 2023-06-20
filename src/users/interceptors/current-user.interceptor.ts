import { NestInterceptor, CallHandler, ExecutionContext, Injectable } from "@nestjs/common";
import { UsersService } from "../users.service";

// Not using this anymore as its execution context is after guards.Instead using its middleware version.

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
    constructor(private usersService: UsersService) { }

    async intercept(context: ExecutionContext, handler: CallHandler) {
        const request = context.switchToHttp().getRequest();
        const { userId } = request.session || {};

        if (userId) {
            const user = await this.usersService.findById(userId);
            request.currentUser = user;
        }
        return handler.handle();
    }
}