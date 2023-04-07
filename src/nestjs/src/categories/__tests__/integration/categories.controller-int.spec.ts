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
});
