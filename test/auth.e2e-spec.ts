import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { disconnect } from 'mongoose';
import { AuthDto } from '../src/auth/dtos/auth.dto';

const loginDto: AuthDto = {
  login: 'a01@a.ru',
  password: '1',
};

describe('App (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const { body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto);
    token = body.access_token;
  });

  it('/auth/login (POST) fail', (done) => {
    request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...loginDto, password: '2' })
      .expect(403);

    done();
  });

  it('/auth/login (POST) fail', (done) => {
    request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...loginDto, login: 'gfhgh@ggh.ru' })
      .expect(403);

    done();
  });

  it('/review/create (POST) success', (done) => {
    request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(200)
      .then(({ body }: request.Response) => {
        const access_token = body.access_token;
        //console.log(`createdId`);
        //console.log(createdId);
        expect(access_token).toBe(token);
        done();
      });
  });

  afterAll(() => {
    disconnect();
  });
});
