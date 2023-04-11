import {
  CategoryPresenter,
  CollectionPresenter,
  PaginationPresenter,
} from './category.presenter';
import { instanceToPlain } from 'class-transformer';

describe('CategoryPresenter Unit Test', function () {
  describe('constructor', function () {
    it('should set a value', function () {
      const now = new Date();
      const presenter = new CategoryPresenter({
        id: 'uuid',
        name: 'nome',
        description: 'desc',
        is_active: true,
        created_at: now,
      });

      expect(presenter.id).toBe('uuid');
      expect(presenter.name).toBe('nome');
      expect(presenter.description).toBe('desc');
      expect(presenter.is_active).toBe(true);
      expect(presenter.created_at).toBe(now);
    });

    it('should present data', function () {
      const now = new Date();
      const presenter = new CategoryPresenter({
        id: 'uuid',
        name: 'nome',
        description: 'desc',
        is_active: true,
        created_at: now,
      });

      expect(instanceToPlain(presenter)).toStrictEqual({
        id: 'uuid',
        name: 'nome',
        description: 'desc',
        is_active: true,
        created_at: now.toISOString(),
      });
    });
  });
});

describe('PaginationPresenter Unit Tests', function () {
  it('should set string number values', function () {
    const presenter = new PaginationPresenter({
      current_page: '1' as any,
      total: '2' as any,
      last_page: '3' as any,
      per_page: '4' as any,
    });

    expect(presenter.current_page).toBe('1');
    expect(presenter.total).toBe('2');
    expect(presenter.last_page).toBe('3');
    expect(presenter.per_page).toBe('4');
  });

  it('should convert to integer', function () {
    const presenter = new PaginationPresenter({
      current_page: '1.1' as any,
      total: '2.1' as any,
      last_page: '3.1' as any,
      per_page: '4.1' as any,
    });

    expect(instanceToPlain(presenter)).toStrictEqual({
      current_page: 1,
      total: 2,
      last_page: 3,
      per_page: 4,
    });
  });
});

class StubCollectionPresenter extends CollectionPresenter {
  data = [1, 2, 3];
}

describe('CollectionPresenter Unit Tests', function () {
  it('should set string number values', function () {
    const presenter = new StubCollectionPresenter({
      current_page: '1' as any,
      total: '2' as any,
      last_page: '3' as any,
      per_page: '4' as any,
    });

    expect(presenter['paginationPresenter']).toBeInstanceOf(
      PaginationPresenter,
    );
    expect(presenter.meta).toEqual(presenter['paginationPresenter']);

    expect(presenter['paginationPresenter'].current_page).toBe('1');
    expect(presenter['paginationPresenter'].total).toBe('2');
    expect(presenter['paginationPresenter'].last_page).toBe('3');
    expect(presenter['paginationPresenter'].per_page).toBe('4');
  });

  it('should convert to integer', function () {
    const presenter = new StubCollectionPresenter({
      current_page: '1.1' as any,
      total: '2.1' as any,
      last_page: '3.1' as any,
      per_page: '4.1' as any,
    });

    expect(instanceToPlain(presenter)).toStrictEqual({
      data: [1, 2, 3],
      meta: {
        current_page: 1,
        total: 2,
        last_page: 3,
        per_page: 4,
      },
    });
  });
});
