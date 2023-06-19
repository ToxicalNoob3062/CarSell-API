import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app/app.module';

describe('Authentication System', () => {
    const mail = 'rahat3062@mail.com';
    let app: INestApplication;
    let res: request.Response;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('handles a signup request', async () => {
        res = await request(app.getHttpServer())
            .post('/auth/signup')
            .send({ email: mail, password: 'pass@word' })
            .expect(201);
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(mail);
    });

    it('signup a user and get it back from its cookies', async () => {
        const cookie = res.get('Set-Cookie');
        const { body } = await request(app.getHttpServer())
            .get('/auth/retrieve')
            .set('Cookie', cookie)
            .expect(200);
        expect(body.email).toEqual(mail);
    });
});