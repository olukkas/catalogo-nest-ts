import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../../app.module';
import { CategoryRepository } from '@fc/micro-videos/category/domain';
import { CATEGORY_PROVIDERS } from '../../category.providers';

describe('CategoriesController (e2e)', () => {
  let app: INestApplication;
  let categoryRepo: CategoryRepository.Repository;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    categoryRepo = moduleFixture.get<CategoryRepository.Repository>(
      CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
    );

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('POST /categories', async () => {
    const res = await request(app.getHttpServer())
      .post('/categories')
      .send({ name: 'Movie' })
      .expect(201);

    expect(Object.keys(res.body)).toStrictEqual([
      'id',
      'name',
      'description',
      'is_active',
      'created_at',
    ]);

    const category = await categoryRepo.findById(res.body.id);
    expect(res.body.id).toBe(category.id);
    expect(res.body.created_at).toBe(category.created_at.toISOString());
    expect(res.body).toMatchObject({
      name: category.name,
      description: category.description,
      is_active: category.is_active,
    });
  });
});
