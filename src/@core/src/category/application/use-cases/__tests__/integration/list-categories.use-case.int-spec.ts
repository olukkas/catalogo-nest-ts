import { ListCategoriesUseCase } from "../../list-categories.use-case";
import { CategorySequelize } from '#category/infra';
import { setupSequelize } from '#seedwork/infra';
import { CategoryFakeBuilder } from '#category/domain/entities/category-fake-builder';
import { Category } from '#category/domain';

const { CategoryRepository, CategoryModel } = CategorySequelize;

describe("ListCategoriesUseCase Integration Tests", () => {
  let useCase: ListCategoriesUseCase.UseCase;
  let repository: CategorySequelize.CategoryRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategoryRepository(CategoryModel);
    useCase = new ListCategoriesUseCase.UseCase(repository);
  });

  it("should return output using empty input with categories ordered by created_at", async () => {
    const entities = CategoryFakeBuilder
      .theCategories(2)
      .withName(index => `category ${index}`)
      .withCreatedAt(index => new Date(new Date().getTime() + index))
      .build();

    for (const category of entities) {
      await repository.insert(category);
    }

    const output = await useCase.execute({});
    
    expect(output).toMatchObject({
      items: [...entities]
        .reverse()
        .map((i) => i.toJSON()),
      total: 2,
      current_page: 1,
      per_page: 15,
      last_page: 1,
    });
  });

  it("should returns output using pagination, sort and filter", async () => {
    const names = ['a', 'AAA', 'AaA', 'b', 'c'];

    const entities = Category.fake()
      .theCategories(5)
      .withName(index => names[index])
      .build();

    await repository.bulkInsert(entities);

    let output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: "name",
      filter: "a",
    });

    expect(output).toMatchObject({
      items: [entities[1], entities[2]].map((i) => i.toJSON()),
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });

    output = await useCase.execute({
      page: 2,
      per_page: 2,
      sort: "name",
      filter: "a",
    });

    expect(output).toMatchObject({
      items: [entities[0]].map((i) => i.toJSON()),
      total: 3,
      current_page: 2,
      per_page: 2,
      last_page: 2,
    });

    output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: "name",
      sort_dir: "desc",
      filter: "a",
    });

    expect(output).toMatchObject({
      items: [entities[0], entities[2]].map((i) => i.toJSON()),
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });
  });
});
