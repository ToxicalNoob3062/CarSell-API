import { Injectable } from '@nestjs/common';
import { UsersService } from './users.service';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) { }

    signIn() {

    }

    async signUp(email: string, password: string) {
        const users = await this.usersService.find(email);
        if (users.length) return false;

    }
}