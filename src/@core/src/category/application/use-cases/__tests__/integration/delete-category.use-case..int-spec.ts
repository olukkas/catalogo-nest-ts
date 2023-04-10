import {DeleteCategoryUseCase} from "../../delete-category.use-case";
import NotFoundError from "../../../../../@seedwork/domain/errors/not-found.error";
import { CategorySequelize } from '#category/infra';
import { setupSequelize } from '#seedwork/infra';
import { Category } from '#category/domain';

const { CategoryRepository, CategoryModel } = CategorySequelize;

describe("DeleteCategoryUseCase Integration Tests", () => {
  let useCase: DeleteCategoryUseCase.UseCase;
  let repository: CategorySequelize.CategoryRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategoryRepository(CategoryModel);
    useCase = new DeleteCategoryUseCase.UseCase(repository);
  });

  it("should throws error when entity not found", async () => {
    await expect(() =>
      useCase.execute({ id: "fake id"})
    ).rejects.toThrow(new NotFoundError(`Entity Not Found using ID fake id`));
  });

  it("should delete a category", async () => {
    const entity = Category.fake()
      .aCategory()
      .build();

    await repository.insert(entity);

    await useCase.execute({
      id: entity.id,
    });

    const noHasModel = await CategoryModel.findByPk(entity.id)
    expect(noHasModel).toBeNull();
  });
});
