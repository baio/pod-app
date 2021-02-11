import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../api/src/app/app.module';
import * as request from 'supertest';
import * as mongoose from 'mongoose';
import { before } from 'lodash';

// run these only on freshly migrated data from data file
describe('crud-data', () => {
  let app: INestApplication;
  let server: any;

  let createdId: string;

  beforeAll(async () => {
    const connection = await mongoose.connect(process.env.DB_HOST, {
      dbName: process.env.DB_NAME,
    });
    await connection.connection.dropDatabase();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector))
    );
    await app.init();

    server = app.getHttpServer();
  }, 5000);

  afterAll(async () => {
    await app.close();
  });

  it('create data', () => {
    return request(server)
      .post('/data')
      .send({ subscriberId: '001', usageBytes: 10, status: 'active' })
      .expect(201)
      .expect((res) => {
        const body = res.body;
        createdId = body._id;
      });
  });

  it('get item after create', () => {
    return request(server)
      .get(`/data/${createdId}`)
      .expect(200)
      .expect((res) => {
        const body = res.body;
        expect(body).toEqual({
          _id: createdId,
          __v: 0,
          subscriberId: '001',
          usageBytes: 10,
          status: 'active',
        });
      });
  });

  it('update data', () => {
    return request(server)
      .put(`/data/${createdId}`)
      .send({ subscriberId: '001', usageBytes: 11, status: 'active' })
      .expect(200);
  });

  it('update inexistent data', () => {
    return request(server)
      .put(`/data/5555555`)
      .send({ subscriberId: '001', usageBytes: 11, status: 'active' })
      .expect(404);
  });

  it('get item after update', () => {
    return request(server)
      .get(`/data/${createdId}`)
      .expect(200)
      .expect((res) => {
        const body = res.body;
        expect(body).toEqual({
          _id: createdId,
          __v: 0,
          subscriberId: '001',
          usageBytes: 11,
          status: 'active',
        });
      });
  });

  it('remove data', () => {
    return request(server).delete(`/data/${createdId}`).expect(200);
  });

  it('remove inexistent data', () => {
    return request(server).delete(`/data/${createdId}`).expect(404);
  });

  it('get item after remove', () => {
    return request(server).get(`/data/${createdId}`).expect(404);
  });

  describe('filters', () => {
    describe('usageByres range', () => {
      beforeAll(async () => {
        await request(server)
          .post('/data')
          .send({ subscriberId: '001', usageBytes: 10, status: 'active' });
        await request(server)
          .post('/data')
          .send({ subscriberId: '002', usageBytes: 20, status: 'active' });
        await request(server)
          .post('/data')
          .send({ subscriberId: '003', usageBytes: 30, status: 'active' });
      });

      it('filter.usageBytes=1,20 should give 2 items', () =>
        request(server)
          .get(`/data?filter.usageBytes=1,20`)
          .expect(200)
          .expect((res) => {
            const body = res.body;
            expect(body.items.length).toEqual(2);
          }));

      it('filter.usageBytes=,20 should give 2 items', () =>
        request(server)
          .get(`/data?filter.usageBytes=,20`)
          .expect(200)
          .expect((res) => {
            const body = res.body;
            expect(body.items.length).toEqual(2);
          }));

      it('filter.usageBytes=,19 should give 1 items', () =>
        request(server)
          .get(`/data?filter.usageBytes=,19`)
          .expect(200)
          .expect((res) => {
            const body = res.body;
            expect(body.items.length).toEqual(1);
          }));

      it('filter.usageBytes=21, should give 1 items', () =>
        request(server)
          .get(`/data?filter.usageBytes=21,`)
          .expect(200)
          .expect((res) => {
            const body = res.body;
            expect(body.items.length).toEqual(1);
          }));
    });
  });
});
