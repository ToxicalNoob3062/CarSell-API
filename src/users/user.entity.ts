import {
    Entity, Column, PrimaryGeneratedColumn, AfterInsert, AfterUpdate, AfterRemove,
    OneToMany
} from "typeorm";

import { Report } from "../reports/report.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ default: false })
    admin: boolean;

    @OneToMany(() => Report, (report) => report.user, { eager: true })
    reports: Report[];

    //the below methods use typeorm hooks with methods and this will only be executed if we interact with database
    //creating a database instance.

    @AfterInsert()
    logInsert() {
        console.log(`User was created with an id of ${this.id}!`);
    }

    @AfterUpdate()
    logUpdate() {
        console.log(`User was updated which was holding an id of ${this.id}!`);
    }

    @AfterRemove()
    logRemove() {
        console.log(`A User Removal Event Detected!⚡😱`);
    }
};