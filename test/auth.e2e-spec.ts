import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app/app.module';

describe('Authentication System', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('handles a signup request', async () => {
        const mail = 'phaserCop321@mail.com';
        return request(app.getHttpServer())
            .post('/auth/signup')
            .send({ email: mail, password: 'fishyfishy' })
            .expect(201)
            .then(res => {
                const { id, email } = res.body;
                expect(id).toBeDefined();
                expect(email).toEqual(mail);
            });
    });
});