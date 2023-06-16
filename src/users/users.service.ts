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
    create(email: string, password: string) {
        const userInstance = this.repo.create({ email, password });
        return this.repo.save(userInstance);
    }
    findOne(id: number) {
        return this.repo.findOneBy({ id });
    }
    find(email: string) {
        return this.repo.find({ where: { email } });
    }
    async update(id: number, attrs: Partial<User>) {
        const user = await this.findOne(id);
        if (!user) throw new Error(`Could not find an user with an id of ${id}!`);
        Object.assign(user, attrs);
        return this.repo.save(user);
    }
    async remove(id: number) {
        const user = await this.findOne(id);
        return user ? this.repo.remove(user) : (() => { throw new Error(`Could not find an user with an id of ${id}!`); })();
    }
}
