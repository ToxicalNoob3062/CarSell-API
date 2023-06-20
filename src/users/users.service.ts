import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { scrypt } from 'src/extras/utility.functions';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private repo: Repository<User>,
    ) { }
    async saveUser(user: User) {
        return await this.repo.save(user);
    }
    async create(email: string, password: string) {
        const userInstance = this.repo.create({ email, password });
        return this.saveUser(userInstance);
    }
    async findById(id: number) {
        if (!id) return null;
        return await this.repo.findOneBy({ id });
    }
    async findByMail(email: string) {
        return await this.repo.findOneBy({ email });
    }
    async update(user: User, attrs: Partial<User>) {
        if (attrs.password) {
            const [salt] = user.password.split('.');
            const hash = (await scrypt(attrs.password, salt, 32)) as Buffer;
            attrs.password = `${salt}.${hash.toString('hex')}`;
        }
        Object.assign(user, attrs);
        return this.saveUser(user);
    }
    async remove(user: User) {
        if (user.reports.length) return null;
        return await this.repo.remove(user);
    }
}
