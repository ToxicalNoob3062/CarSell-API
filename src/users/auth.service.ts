import { Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { scrypt } from '../extras/utility.functions';
import { randomBytes } from 'crypto';



@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) { }



    async signIn(user: User, password: string) {
        const [salt, storedHash] = user.password.split('.');
        const hash = (await scrypt(password, salt, 32)) as Buffer;
        if (hash.toString('hex') === storedHash) return user;
        return null;
    }

    async signUp(email: string, password: string) {
        let user = await this.usersService.findByMail(email);
        if (user) return null;
        const salt = randomBytes(8).toString("hex");
        const hash = (await scrypt(password, salt, 32)) as Buffer;
        const result = `${salt}.${hash.toString("hex")}`;
        user = await this.usersService.create(email, result);
        return user;
    }
}