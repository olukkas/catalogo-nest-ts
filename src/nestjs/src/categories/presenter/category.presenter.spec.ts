import {
  CategoryCollectionPresenter,
  CategoryPresenter,
} from './category.presenter';
import { instanceToPlain } from 'class-transformer';
import { PaginationPresenter } from '../../@share/presenters/pagination.presenter';

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

describe('CategoryCollectionPresenter Unit Tests', () => {
  it('should set values', () => {
    const created_at = new Date();
    const presenter = new CategoryCollectionPresenter({
      items: [
        {
          id: '61cd7b66-c215-4b84-bead-9aef0911aba7',
          name: 'movie',
          description: 'some description',
          is_active: true,
          created_at,
        },
      ],
      current_page: 1,
      per_page: 2,
      last_page: 3,
      total: 4,
    });

    expect(presenter.meta).toBeInstanceOf(PaginationPresenter);
    expect(presenter.meta).toEqual(
      new PaginationPresenter({
        current_page: 1,
        per_page: 2,
        last_page: 3,
        total: 4,
      }),
    );
    expect(presenter.data).toStrictEqual([
      new CategoryPresenter({
        id: '61cd7b66-c215-4b84-bead-9aef0911aba7',
        name: 'movie',
        description: 'some description',
        is_active: true,
        created_at,
      }),
    ]);
  });

  it('should presenter data', () => {
    const created_at = new Date();
    let presenter = new CategoryCollectionPresenter({
      items: [
        {
          id: '61cd7b66-c215-4b84-bead-9aef0911aba7',
          name: 'movie',
          description: 'some description',
          is_active: true,
          created_at,
        },
      ],
      current_page: 1,
      per_page: 2,
      last_page: 3,
      total: 4,
    });

    expect(instanceToPlain(presenter)).toStrictEqual({
      meta: {
        current_page: 1,
        per_page: 2,
        last_page: 3,
        total: 4,
      },
      data: [
        {
          id: '61cd7b66-c215-4b84-bead-9aef0911aba7',
          name: 'movie',
          description: 'some description',
          is_active: true,
          created_at: created_at.toISOString(),
        },
      ],
    });

    presenter = new CategoryCollectionPresenter({
      items: [
        {
          id: '61cd7b66-c215-4b84-bead-9aef0911aba7',
          name: 'movie',
          description: 'some description',
          is_active: true,
          created_at,
        },
      ],
      current_page: '1.1' as any,
      per_page: '2.1' as any,
      last_page: '3.1' as any,
      total: '4.1' as any,
    });

    expect(instanceToPlain(presenter)).toStrictEqual({
      meta: {
        current_page: 1,
        per_page: 2,
        last_page: 3,
        total: 4,
      },
      data: [
        {
          id: '61cd7b66-c215-4b84-bead-9aef0911aba7',
          name: 'movie',
          description: 'some description',
          is_active: true,
          created_at: created_at.toISOString(),
        },
      ],
    });
  });
});
