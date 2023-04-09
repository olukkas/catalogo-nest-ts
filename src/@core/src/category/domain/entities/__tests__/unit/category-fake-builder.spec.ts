import { CategoryFakeBuilder } from '../../category-fake-builder';
import { Chance } from 'chance';


describe('CategoryFakeBuilder Unit tests', function () {

  describe('name prop', function () {
    const faker = CategoryFakeBuilder.aCategory();

    it('should be a function', function () {
      expect(typeof faker['_name']).toBe('function');
    });

    it('should call word method', function () {
      const chance = Chance();
      const spy = jest.spyOn(chance, 'word');

      faker['chance'] = chance;
      faker.build();

      expect(spy).toHaveBeenCalled();
    });

    test('withName', () => {
      faker.withName('test name');
      expect(faker.name).toBe('test name')

      faker.withName(() => 'teste name 2');
      expect(faker.name).toBe('teste name 2');
    });

    it("should pass index to name factory", () => {
      faker.withName((index) => `test name ${index}`);
      const category = faker.build();
      expect(category.name).toBe(`test name 0`);

      const fakerMany = CategoryFakeBuilder.theCategories(2);
      fakerMany.withName((index) => `test name ${index}`);
      const categories = fakerMany.build();

      expect(categories[0].name).toBe(`test name 0`);
      expect(categories[1].name).toBe(`test name 1`);
    });
  });

  describe("description prop", () => {
    const faker = CategoryFakeBuilder.aCategory();

    it("should be a function", () => {
      expect(typeof faker["_description"] === "function").toBeTruthy();
    });

    it("should call the paragraph method", () => {
      const chance = Chance();
      const spyWordMethod = jest.spyOn(chance, "paragraph");
      faker["chance"] = chance;
      faker.build();

      expect(spyWordMethod).toHaveBeenCalled();
    });

    test("withDescription", () => {
      const $this = faker.withDescription("test description");
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker["_description"]).toBe("test description");

      faker.withDescription(() => "test description");
      //@ts-expect-error description is callable
      expect(faker["_description"]()).toBe("test description");

      expect(faker.description).toBe("test description");
    });

    it("should pass index to description factory", () => {
      faker.withDescription((index) => `test description ${index}`);
      const category = faker.build();
      expect(category.description).toBe(`test description 0`);

      const fakerMany = CategoryFakeBuilder.theCategories(2);
      fakerMany.withDescription((index) => `test description ${index}`);
      const categories = fakerMany.build();

      expect(categories[0].description).toBe(`test description 0`);
      expect(categories[1].description).toBe(`test description 1`);
    });
  });

  describe("is_active prop", () => {
    const faker = CategoryFakeBuilder.aCategory();

    it("should be a function", () => {
      expect(typeof faker["_is_active"] === "function").toBeTruthy();
    });

    test("activate", () => {
      const $this = faker.activate();
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker["_is_active"]).toBeTruthy();
      expect(faker.is_active).toBeTruthy();
    });

    test("deactivate", () => {
      const $this = faker.deactivate();

      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker["_is_active"]).toBeFalsy();
      expect(faker.is_active).toBeFalsy();
    });
  });

  describe("created_at prop", () => {
    const faker = CategoryFakeBuilder.aCategory();

    it("should throw error when any with methods has called", () => {
      const fakerCategory = CategoryFakeBuilder.aCategory();
      expect(() => fakerCategory.created_at).toThrow(
        new Error("Property created_at not have a factory, use 'with' methods")
      );
    });

    it("should be undefined", () => {
      expect(faker["_created_at"]).toBeUndefined();
    });

    test("withCreatedAt", () => {
      const date = new Date();
      const $this = faker.withCreatedAt(date);
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker["_created_at"]).toBe(date);

      faker.withCreatedAt(() => date);
      expect(faker["_created_at"]()).toBe(date);
      expect(faker.created_at).toBe(date);
    });

    it("should pass index to created_at factory", () => {
      const date = new Date();
      faker.withCreatedAt((index) => new Date(date.getTime() + index + 2));
      const category = faker.build();
      expect(category.created_at.getTime()).toBe(date.getTime() + 2);

      const fakerMany = CategoryFakeBuilder.theCategories(2);
      fakerMany.withCreatedAt((index) => new Date(date.getTime() + index + 2));
      const categories = fakerMany.build();

      expect(categories[0].created_at.getTime()).toBe(date.getTime() + 2);
      expect(categories[1].created_at.getTime()).toBe(date.getTime() + 1 + 2);
    });
  });
});