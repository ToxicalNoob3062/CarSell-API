import { Test } from "@nestjs/testing";
import { AuthService } from "../auth.service";
import { UsersService } from "../users.service";
import { User } from "../user.entity";

describe("AuthService", () => {
    let service: AuthService, id = 1;
    const usersCache: User[] = [];
    const mail = 'rahat3062@gmail.com';
    const pass = "robert";

    beforeEach(async () => {
        const fakeUsersService = {
            find: (email: string): Promise<User[]> => {
                const filteredUser = usersCache.filter(user => user.email === email);
                return Promise.resolve(filteredUser);
            },
            create: (email: string, password: string): Promise<User> => {
                const user = { id, email, password } as User;
                usersCache.push(user); id++;
                return Promise.resolve(user);
            }
        };
        const module = await Test.createTestingModule({
            providers: [AuthService, {
                provide: UsersService,
                useValue: fakeUsersService
            }]
        }).compile();

        service = module.get(AuthService);
    });

    it("Create an instace of auth service!", async () => {
        expect(service).toBeDefined();
    });

    it("Check if user could singup!", async () => {
        const { password } = await service.signUp(mail, pass);
        expect(password).not.toEqual(pass);
        const [salt, hash] = password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    });

    it('Throws an error if user signs up with email that is in use!', async () => {
        await expect(service.signUp(mail, pass)).resolves.toBeFalsy();
    });

    it('Returns null for incorrect password', async () => {
        await expect(service.signIn(usersCache[0], 'wrong@pass')).resolves.toBeNull();
    });

    it(`Returns a user if correct password id provided!`, async () => {
        await expect(service.signIn(usersCache[0], pass)).resolves.toBeTruthy();
    });
});


