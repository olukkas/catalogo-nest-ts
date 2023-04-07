import { CategoriesController } from '../../categories.controller';
import { Test } from '@nestjs/testing';
import { ConfigModule } from '../../../config/config.module';
import { DatabaseModule } from '../../../database/database.module';
import { CategoriesModule } from '../../categories.module';
import { DEFAULT_USE_CASES, InjectorHelper } from '../injector.helper';
import {
  CreateCategoryUseCase,
  DeleteCategoryUseCase,
  GetCategoryUseCase,
  ListCategoriesUseCase,
  UpdateCategoryUseCase,
} from '@fc/micro-videos/category/application';
import { CATEGORY_PROVIDERS } from '../../category.providers';
import { CategoryRepository } from '@fc/micro-videos/category/domain';
import { CategorySequelize } from '@fc/micro-videos/category/infra';
import CategoryModel = CategorySequelize.CategoryModel;

describe('CategoriesController integration tests', function () {
  let controller: CategoriesController;
  let repository: CategoryRepository.Repository;
  const factory = CategorySequelize.CategoryModel.factory();

  beforeEach(async () => {
    const modulo = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), DatabaseModule, CategoriesModule],
    }).compile();

    repository = modulo.get(
      CATEGORY_PROVIDERS.REPOSITORIES.CATEGORY_REPOSITORY.provide,
    );

    const helper = new InjectorHelper(repository);

    controller = modulo.get(CategoriesController);
    helper.initUseCases(DEFAULT_USE_CASES, controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(controller['getUseCase']).toBeInstanceOf(GetCategoryUseCase.UseCase);
    expect(controller['createUseCase']).toBeInstanceOf(
      CreateCategoryUseCase.UseCase,
    );
    expect(controller['updateUseCase']).toBeInstanceOf(
      UpdateCategoryUseCase.UseCase,
    );
    expect(controller['deleteUseCase']).toBeInstanceOf(
      DeleteCategoryUseCase.UseCase,
    );
    expect(controller['listUseCase']).toBeInstanceOf(
      ListCategoriesUseCase.UseCase,
    );
  });

  describe('should create a category', function () {
    const arrange = [
      {
        request: {
          name: 'Movie',
        },
        expectedOutput: {
          name: 'Movie',
          description: null,
          is_active: true,
        },
      },
      {
        request: {
          name: 'Movie',
          description: 'Category to handle movies',
          is_active: false,
        },
        expectedOutput: {
          name: 'Movie',
          description: 'Category to handle movies',
          is_active: false,
        },
      },
    ];

    test.each(arrange)(
      'with request $request',
      async ({ request, expectedOutput }) => {
        const presenter = await controller.create(request);
        const entity = await repository.findById(presenter.id);

        expect(entity).toMatchObject({
          id: presenter.id,
          name: expectedOutput.name,
          description: expectedOutput.description,
          is_active: expectedOutput.is_active,
          created_at: presenter.created_at,
        });

        expect(presenter.id).toBe(entity.id);
        expect(presenter.name).toBe(expectedOutput.name);
        expect(presenter.description).toBe(expectedOutput.description);
        expect(presenter.is_active).toBe(expectedOutput.is_active);
        expect(presenter.created_at).toStrictEqual(entity.created_at);
      },
    );
  });

  describe('should update a category', function () {
    let category: CategoryModel;

    beforeEach(async () => {
      category = await factory.create();
    });

    const arrange = [
      {
        request: {
          name: 'Movie',
        },
        expectedOutput: {
          name: 'Movie',
          description: null,
          is_active: true,
        },
      },
      {
        request: {
          name: 'Séries',
          description: null,
          is_active: false,
        },
        expectedOutput: {
          name: 'Séries',
          description: null,
          is_active: false,
        },
      },
    ];

    test.each(arrange)(
      'with request $request',
      async ({ request, expectedOutput }) => {
        const presenter = await controller.update(category.id, request);
        const entity = await repository.findById(category.id);

        expect(entity).toMatchObject({
          id: presenter.id,
          name: expectedOutput.name,
          description: expectedOutput.description,
          is_active: expectedOutput.is_active,
          created_at: presenter.created_at,
        });

        expect(presenter.id).toBe(entity.id);
        expect(presenter.description).toBe(expectedOutput.description);
        expect(presenter.name).toBe(expectedOutput.name);
        expect(presenter.is_active).toBe(expectedOutput.is_active);
        expect(presenter.created_at).toStrictEqual(entity.created_at);
      },
    );
  });
});
