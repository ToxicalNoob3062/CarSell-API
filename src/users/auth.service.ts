import { promisify } from 'util';
import { Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) { }

    signIn() {

    }

    async signUp(email: string, password: string) {
        const users = await this.usersService.find(email);
        if (users.length) return null;
        const salt = randomBytes(8).toString("hex");
        const hash = (await scrypt(password, salt, 32)) as Buffer;
        const result = `${salt}.${hash.toString("hex")}`;
        const user = await this.usersService.create(email, result);
        return user;
    }
}