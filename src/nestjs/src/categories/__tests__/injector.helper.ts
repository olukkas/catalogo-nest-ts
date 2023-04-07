import { CategoriesController } from '../categories.controller';
import { CategoryRepository } from '@fc/micro-videos/category/domain';
import {
  CreateCategoryUseCase,
  DeleteCategoryUseCase,
  GetCategoryUseCase,
  ListCategoriesUseCase,
  UpdateCategoryUseCase,
} from '@fc/micro-videos/category/application';

export type Initializer = {
  name: string;
  useCase: any;
};

export class InjectorHelper {
  constructor(private repo: CategoryRepository.Repository) {}

  initUseCases(cases: Initializer[], controller: CategoriesController) {
    for (const { name, useCase } of cases) {
      controller[name] = new useCase(this.repo);
    }
  }
}

export const DEFAULT_USE_CASES = [
  { name: 'createUseCase', useCase: CreateCategoryUseCase.UseCase },
  { name: 'updateUseCase', useCase: UpdateCategoryUseCase.UseCase },
  { name: 'deleteUseCase', useCase: DeleteCategoryUseCase.UseCase },
  { name: 'getUseCase', useCase: GetCategoryUseCase.UseCase },
  { name: 'listUseCase', useCase: ListCategoriesUseCase.UseCase },
];
