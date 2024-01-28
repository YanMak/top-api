import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateReviewDto } from '../src/review/dtos/create-review.dto';
import { Types, disconnect } from 'mongoose';
import { REVIEW_NOT_FOUND } from '../src/review/review.constants';
import { AuthDto } from '../src/auth/dtos/auth.dto';

const productId = new Types.ObjectId().toHexString();

const testDto: CreateReviewDto = {
  name: 'test',
  title: 'heder',
  description: 'test desc',
  rating: 5,
  productId,
};

const loginDto: AuthDto = {
  login: 'a01@a.ru',
  password: '1',
};

describe('App (e2e)', () => {
  let app: INestApplication;
  let createdId: string;
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

  it('/review/create (POST) fail', (done) => {
    request(app.getHttpServer())
      .post('/review/create')
      .send({ ...testDto, rating: 0 })
      .expect(400)
      .then(({ body }: request.Response) => {
        //createdId = body._id;
        console.log(body);
        //console.log(createdId);
        //expect(createdId).toBeDefined();
        done();
      });
  });

  it('/review/create (POST) success', (done) => {
    request(app.getHttpServer())
      .post('/review/create')
      .send(testDto)
      .expect(201)
      .then(({ body }: request.Response) => {
        createdId = body._id;
        //console.log(`createdId`);
        //console.log(createdId);
        expect(createdId).toBeDefined();
        done();
      });
  });

  it('review/byProduct/:id (Get) success', (done) => {
    request(app.getHttpServer())
      .get('/review/byProduct/' + productId)
      .set({ Authorization: 'Bearer ' + token })
      .then(({ body }: request.Response) => {
        //console.log('review/byProduct/:id (Get) body');
        //console.log(body);
        expect(body[0].product).toBe(productId.toString());
        done();
      });
  });

  /*
  it('/review/:id (Delete)', (done) => {
    request(app.getHttpServer())
      .delete('/review/' + createdId)
      .expect(200)
      .then(() => {
        done();
      });
  });*/

  it('review/byProduct/:id (Get) fail', (done) => {
    request(app.getHttpServer())
      .get('/review/byProduct/' + new Types.ObjectId().toHexString())
      //.expect(404);
      .set({ Authorization: 'Bearer ' + token })
      .then(({ body }: request.Response) => {
        //console.log('review/byProduct/:id (Get) body');
        //console.log(body);
        expect(body.length).toBe(0);
        done();
      });
  });

  /*
  it('review/byProduct/:id (Delete) success', (done) => {
    request(app.getHttpServer())
      .delete('/review/byProduct/' + productId)
      .expect(200)
      .then(() => {
        done();
      });
  });*/

  it('review/byProduct/:id (Delete) fail', (done) => {
    request(app.getHttpServer())
      .delete('/review/byProduct/' + new Types.ObjectId().toHexString())
      .expect(404, { statusCode: 404, message: REVIEW_NOT_FOUND })
      .then(() => {
        done();
      });
  });

  afterAll(() => {
    disconnect();
  });
});
