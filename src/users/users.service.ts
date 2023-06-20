import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private repo: Repository<User>,
    ) { }
    async create(email: string, password: string) {
        const userInstance = this.repo.create({ email, password });
        return await this.repo.save(userInstance);
    }
    async findOne(id: number) {
        if (!id) return null;
        return await this.repo.findOneBy({ id });
    }
    async find(email: string) {
        return await this.repo.find({ where: { email } });
    }
    async update(id: number, attrs: Partial<User>) {
        const user = await this.findOne(id);
        if (!user) return user;
        Object.assign(user, attrs);
        return await this.repo.save(user);
    }
    async remove(id: number) {
        const user = await this.findOne(id);
        if (!user) return null;
        if (user.reports.length) return `User with id:${id} has existing reports!`;
        return await this.repo.remove(user);
    }
}
