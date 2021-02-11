import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../api/src/app/app.module';
import * as request from 'supertest';

// run these only on freshly migrated data from data file
describe.skip('filter-data', () => {
  let app: INestApplication;
  let server: any;

  beforeAll(async () => {
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

  it('default filter get 25 items', () => {
    return request(server)
      .get('/data')
      .expect(200)
      .expect((res) => {
        const body = res.body;
        expect(body.pager.page).toEqual(1);
        expect(body.pager.limit).toEqual(25);
        expect(body.pager.count).toEqual(1016);
        expect(body.items.length).toEqual(25);
      });
  });

  it('get page 5 should work', () => {
    return request(server)
      .get('/data?page=5')
      .expect(200)
      .expect((res) => {
        const body = res.body;
        expect(body.pager.page).toEqual(5);
      });
  });

  it('filter by subscriberId 3005179918000 gives correct result', () => {
    return request(server)
      .get('/data?filter.subscriberId=3005179918000')
      .expect(200)
      .expect((res) => {
        const body = res.body;
        expect(body.pager.count).toEqual(1);
        expect(body.items.length).toEqual(1);
      });
  });

  it('filter by status give correct result', () => {
    return request(server)
      .get('/data?filter.status=suspended')
      .expect(200)
      .expect((res) => {
        const body = res.body;
        expect(body.pager.limit).toEqual(25);
        expect(body.pager.page).toEqual(1);
        expect(body.items.length).toEqual(25);
        expect(body.pager.count).toEqual(207);
      });
  });

  it('sort by usageBytes should giv correct result', () => {
    return request(server)
      .get('/data?sort=usageBytes')
      .expect(200)
      .expect((res) => {
        const body = res.body;
        expect(body.pager.limit).toEqual(25);
        expect(body.pager.page).toEqual(1);
        expect(body.items.length).toEqual(25);
        expect(body.items[0].usageBytes).toEqual(0);
        expect(body.items[24].usageBytes).toEqual(0);
      });
  });
  it('sort by usageBytes should give correct result', () => {
    return request(server)
      .get('/data?sort=-usageBytes&page=28')
      .expect(200)
      .expect((res) => {
        const body = res.body;
        expect(body.pager.limit).toEqual(25);
        expect(body.items.length).toEqual(25);
        expect(body.items[0].usageBytes).toEqual(3418112);
        expect(body.items[2].usageBytes).toEqual(1482752);
      });
  });

  it('sort by usageBytes should give correct result', () => {
    return request(server)
      .get('/data?sort=-usageBytes&filter.usageBytes=1,1500000')
      .expect(200)
      .expect((res) => {
        const body = res.body;
        expect(body.pager.limit).toEqual(25);
        expect(body.items.length).toEqual(7);
        expect(body.pager.count).toEqual(7);
        expect(body.items[0].usageBytes).toEqual(1482752);
        expect(body.items[6].usageBytes).toEqual(2048);
      });
  });


});
