import { Entity, Column, PrimaryGeneratedColumn, AfterInsert, AfterUpdate, AfterRemove } from "typeorm";
import { Exclude } from "class-transformer";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    @Exclude()
    password: string;

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