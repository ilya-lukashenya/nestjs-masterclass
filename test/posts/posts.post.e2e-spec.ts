import * as request from 'supertest';

import {
  completePost,
} from './posts.post.e2e-spec.sample-data';

import { App } from 'supertest/types';
import { ConfigService } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';
import { bootstrapNestApplication } from 'test/helpers/bootstrap-nest-application.helper';
import { dropDatabase } from 'test/helpers/drop-database.helper';

describe('[Posts] @Post Endpoints', () => {
  let app: INestApplication;
  let config: ConfigService;
  let httpServer: App;

  beforeEach(async () => {
    app = await bootstrapNestApplication();
    config = app.get<ConfigService>(ConfigService);
    httpServer = app.getHttpServer();
  });

  afterEach(async () => {
    await dropDatabase(config);
    await app.close();
  });

  it('/posts - Endpoint is public', () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjMsImVtYWlsIjoiaWx5YUBnbWFpbC5jb20iLCJpYXQiOjE3MzQ1NTI3NTMsImV4cCI6MTczNDU1NjM1MywiYXVkIjoibG9jYWxob3N0OjMwMDAiLCJpc3MiOiJsb2NhbGhvc3Q6MzAwMCJ9.5Rm65WPJWpoVfdwPkLdNPUW3pNT1JtClJ82UUZjZVqU'
    return request(httpServer).post('/posts').set('Authorization', `Bearer ${token}`).send({}).expect(400);
  });

 
});