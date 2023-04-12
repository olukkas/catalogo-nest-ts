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
import { Category, CategoryRepository } from '@fc/micro-videos/category/domain';
import { NotFoundError } from 'rxjs';
import { CategoryCollectionPresenter } from '../../presenter/category.presenter';

describe('CategoriesController integration tests', function () {
  let controller: CategoriesController;
  let repository: CategoryRepository.Repository;

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
    const category = Category.fake().aCategory().build();

    beforeEach(async () => await repository.insert(category));

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

  it('should delete a category', async () => {
    const category = Category.fake().aCategory().build();

    await repository.insert(category);
    const response = await controller.remove(category.id);

    expect(response).not.toBeDefined();
    await expect(repository.findById(category.id)).rejects.toThrow(
      new NotFoundError(`Entity Not Found using ID ${category.id}`),
    );
  });

  it('should get a category', async () => {
    const category = Category.fake().aCategory().build();
    await repository.insert(category);
    const response = await controller.findOne(category.id);

    expect(response).toBeDefined();
    expect(response.id).toBe(category.id);
    expect(response.description).toBe(category.description);
    expect(response.name).toBe(category.name);
    expect(response.is_active).toBe(category.is_active);
    expect(response.created_at).toStrictEqual(category.created_at);
  });

  describe('search method', () => {
    it('should returns categories query empty ordered by created_at', async () => {
      const currentDate = new Date();

      const categories = Category.fake()
        .theCategories(4)
        .withName((index) => index + '')
        .withCreatedAt((index) => new Date(currentDate.getTime() + index))
        .build();

      await repository.bulkInsert(categories);

      const arrange = [
        {
          send: {},
          expected: {
            items: [...categories].reverse(),
            current_page: 1,
            last_page: 1,
            per_page: 15,
            total: 4,
          },
        },
        {
          send: { per_page: 2 },
          expected: {
            items: [categories[3], categories[2]],
            current_page: 1,
            last_page: 2,
            per_page: 2,
            total: 4,
          },
        },
        {
          send: { per_page: 2, page: 2 },
          expected: {
            items: [categories[1], categories[0]],
            current_page: 2,
            last_page: 2,
            per_page: 2,
            total: 4,
          },
        },
      ];

      for (const { send, expected } of arrange) {
        const presenter = await controller.search(send);
        expect(presenter).toEqual(new CategoryCollectionPresenter(expected));
      }
    });

    it('should returns categories using pagination, sort and filter', async () => {
      const names = ['a', 'AAA', 'AaA', 'b', 'c'];

      const categories = Category.fake()
        .theCategories(5)
        .withName((index) => names[index])
        .build();

      await repository.bulkInsert(categories);

      const arrange = [
        {
          send_data: {
            page: 1,
            per_page: 2,
            sort: 'name',
            filter: 'a',
          },
          expected: {
            items: [categories[1], categories[2]],
            current_page: 1,
            last_page: 2,
            per_page: 2,
            total: 3,
          },
        },
        {
          send_data: {
            page: 2,
            per_page: 2,
            sort: 'name',
            filter: 'a',
          },
          expected: {
            items: [categories[0]],
            current_page: 2,
            last_page: 2,
            per_page: 2,
            total: 3,
          },
        },
      ];

      for (const { send_data, expected } of arrange) {
        const presenter = await controller.search(send_data);
        expect(presenter).toEqual(new CategoryCollectionPresenter(expected));
      }
    });
  });
});
